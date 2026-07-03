
-- 1. order_items: restrict UPDATE/DELETE to admins only
CREATE POLICY "Admins update order items" ON public.order_items
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete order items" ON public.order_items
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. orders: restrict retailer updates so they can only change status/updated_at, not reassign or alter financials
CREATE OR REPLACE FUNCTION public.enforce_retailer_order_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admins can change anything
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  -- Retailers may only change status (and updated_at); all other columns must be unchanged
  IF is_approved_retailer(auth.uid(), OLD.retailer_id) THEN
    IF NEW.id IS DISTINCT FROM OLD.id
       OR NEW.licensee_id IS DISTINCT FROM OLD.licensee_id
       OR NEW.retailer_id IS DISTINCT FROM OLD.retailer_id
       OR NEW.subtotal IS DISTINCT FROM OLD.subtotal
       OR NEW.platform_fee IS DISTINCT FROM OLD.platform_fee
       OR NEW.delivery_fee IS DISTINCT FROM OLD.delivery_fee
       OR NEW.total IS DISTINCT FROM OLD.total
       OR NEW.notes IS DISTINCT FROM OLD.notes
       OR NEW.created_at IS DISTINCT FROM OLD.created_at
    THEN
      RAISE EXCEPTION 'Retailers may only update order status';
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_retailer_order_update_trg ON public.orders;
CREATE TRIGGER enforce_retailer_order_update_trg
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.enforce_retailer_order_update();

-- 3. profiles: allow admins to read all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
