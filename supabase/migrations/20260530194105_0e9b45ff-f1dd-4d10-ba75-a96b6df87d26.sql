CREATE TYPE public.order_status AS ENUM ('received','preparing','out_for_delivery','delivered','cancelled');

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  licensee_id UUID NOT NULL,
  retailer_id UUID NOT NULL REFERENCES public.retailers(id) ON DELETE RESTRICT,
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  platform_fee NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status public.order_status NOT NULL DEFAULT 'received',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Licensees view own orders" ON public.orders FOR SELECT TO authenticated
  USING (licensee_id = auth.uid());
CREATE POLICY "Retailers view their orders" ON public.orders FOR SELECT TO authenticated
  USING (public.is_approved_retailer(auth.uid(), retailer_id));
CREATE POLICY "Admins view all orders" ON public.orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Licensees create orders" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (licensee_id = auth.uid() AND public.has_role(auth.uid(), 'licensee'));
CREATE POLICY "Retailers update status" ON public.orders FOR UPDATE TO authenticated
  USING (public.is_approved_retailer(auth.uid(), retailer_id))
  WITH CHECK (public.is_approved_retailer(auth.uid(), retailer_id));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER orders_touch BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  name TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  qty INTEGER NOT NULL CHECK (qty > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View items on visible orders" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (
    o.licensee_id = auth.uid()
    OR public.is_approved_retailer(auth.uid(), o.retailer_id)
    OR public.has_role(auth.uid(), 'admin')
  )));
CREATE POLICY "Licensees insert items on own orders" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.licensee_id = auth.uid()));

CREATE INDEX idx_orders_licensee ON public.orders(licensee_id, created_at DESC);
CREATE INDEX idx_orders_retailer ON public.orders(retailer_id, created_at DESC);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;