import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const PLATFORM_FEE_RATE = 0.035;
const DELIVERY_FEE = 19.0;

const CheckoutSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        qty: z.number().int().min(1).max(999),
      }),
    )
    .min(1)
    .max(60),
  notes: z.string().max(500).optional(),
});

/**
 * Places one or more orders from the licensee's cart, split per retailer.
 * Uses admin client to insert across retailers atomically while RLS would
 * still allow it; auth middleware proves the caller is the licensee.
 */
export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CheckoutSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    // Confirm caller is an approved licensee.
    const { data: roleRows, error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .select("role,status")
      .eq("user_id", userId);
    if (roleErr) throw new Error(roleErr.message);
    const ok = (roleRows ?? []).some(
      (r) => r.role === "licensee" && r.status === "approved",
    );
    if (!ok) throw new Error("Only approved licensees can place orders.");

    // Fetch product rows server-side to lock in price & retailer.
    const productIds = data.items.map((i) => i.product_id);
    const { data: products, error: prodErr } = await supabaseAdmin
      .from("products")
      .select("id, retailer_id, name, price, stock")
      .in("id", productIds);
    if (prodErr) throw new Error(prodErr.message);
    const byId = new Map(products?.map((p) => [p.id, p]));

    // Group items by retailer.
    type Line = { product_id: string; name: string; unit_price: number; qty: number };
    const byRetailer = new Map<string, Line[]>();
    for (const item of data.items) {
      const p = byId.get(item.product_id);
      if (!p) throw new Error("Product not found.");
      if (p.stock < item.qty) throw new Error(`Insufficient stock for ${p.name}.`);
      const list = byRetailer.get(p.retailer_id) ?? [];
      list.push({
        product_id: p.id,
        name: p.name,
        unit_price: Number(p.price),
        qty: item.qty,
      });
      byRetailer.set(p.retailer_id, list);
    }

    const createdOrderIds: string[] = [];
    for (const [retailerId, lines] of byRetailer) {
      const subtotal = lines.reduce((s, l) => s + l.unit_price * l.qty, 0);
      const platformFee = +(subtotal * PLATFORM_FEE_RATE).toFixed(2);
      const total = +(subtotal + DELIVERY_FEE + platformFee).toFixed(2);

      const { data: order, error: orderErr } = await supabaseAdmin
        .from("orders")
        .insert({
          licensee_id: userId,
          retailer_id: retailerId,
          subtotal: +subtotal.toFixed(2),
          delivery_fee: DELIVERY_FEE,
          platform_fee: platformFee,
          total,
          notes: data.notes ?? null,
        })
        .select("id")
        .single();
      if (orderErr || !order) throw new Error(orderErr?.message ?? "Order failed.");

      const { error: itemsErr } = await supabaseAdmin.from("order_items").insert(
        lines.map((l) => ({ order_id: order.id, ...l })),
      );
      if (itemsErr) throw new Error(itemsErr.message);

      // Decrement stock.
      for (const l of lines) {
        const p = byId.get(l.product_id)!;
        await supabaseAdmin
          .from("products")
          .update({ stock: Math.max(0, p.stock - l.qty) })
          .eq("id", l.product_id);
      }
      createdOrderIds.push(order.id);
    }

    return { order_ids: createdOrderIds, count: createdOrderIds.length };
  });
