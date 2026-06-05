import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Returns full product rows (including ldb_floor) for a retailer the caller owns.
 * ldb_floor is column-revoked from the public/authenticated roles, so direct
 * client reads cannot see it — this server fn uses the admin client after
 * verifying caller is the approved retailer.
 */
export const getRetailerProducts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ retailer_id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: ok } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "retailer")
      .eq("retailer_id", data.retailer_id)
      .eq("status", "approved")
      .maybeSingle();
    if (!ok) throw new Error("Not an approved retailer for this store.");

    const { data: products, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("retailer_id", data.retailer_id)
      .order("name");
    if (error) throw new Error(error.message);
    return { products: products ?? [] };
  });

/**
 * Computes total LDB savings for an order without exposing ldb_floor to the client.
 * Caller must be the licensee on the order, the approved retailer, or admin.
 */
export const getOrderSavings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ order_id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, licensee_id, retailer_id")
      .eq("id", data.order_id)
      .maybeSingle();
    if (!order) throw new Error("Order not found.");

    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role, retailer_id, status")
      .eq("user_id", userId);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin" && r.status === "approved");
    const isRetailer = (roles ?? []).some(
      (r) => r.role === "retailer" && r.status === "approved" && r.retailer_id === order.retailer_id,
    );
    const isLicensee = order.licensee_id === userId;
    if (!isAdmin && !isRetailer && !isLicensee) {
      throw new Error("Not authorized for this order.");
    }

    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("product_id, unit_price, qty")
      .eq("order_id", data.order_id);
    const ids = (items ?? []).map((i) => i.product_id);
    if (!ids.length) return { savings: 0 };

    const { data: prods } = await supabaseAdmin
      .from("products")
      .select("id, ldb_floor")
      .in("id", ids);
    const byId = new Map((prods ?? []).map((p) => [p.id, Number(p.ldb_floor)]));
    const savings = (items ?? []).reduce((s, l) => {
      const floor = byId.get(l.product_id) ?? 0;
      const diff = Math.max(0, floor - Number(l.unit_price));
      return s + diff * l.qty;
    }, 0);
    return { savings: +savings.toFixed(2) };
  });
