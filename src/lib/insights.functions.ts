import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InsightSchema = z.object({
  insights: z
    .array(
      z.object({
        icon: z.string().min(1).max(4),
        title: z.string().min(1).max(60),
        body: z.string().min(1).max(220),
        trend: z.enum(["up", "down", "flat"]),
      }),
    )
    .min(3)
    .max(3),
});

const InputSchema = z.object({
  mode: z.enum(["trends", "reorder", "pairing"]),
  category: z.string().max(40).optional(),
  cart: z
    .array(z.object({ name: z.string().max(120), qty: z.number().int().min(1).max(999) }))
    .max(40)
    .optional(),
});

const MODE_PROMPT: Record<"trends" | "reorder" | "pairing", string> = {
  trends:
    "Generate 3 current BC wholesale beverage market-trend insights for a Vancouver bar/restaurant licensee. Focus on what's moving in the BC LDB wholesale channel right now.",
  reorder:
    "Generate 3 reorder recommendations for a Vancouver licensee, based on what similar venues commonly restock and any cart hints. Be specific about products or categories.",
  pairing:
    "Generate 3 food-and-beverage pairing tips a Vancouver bar/restaurant could use on their menu, with a clear cross-sell angle.",
};

export const getAiInsights = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return { insights: [], error: "AI is not configured." };
    }

    const cartLine = data.cart?.length
      ? `Current cart: ${data.cart.map((c) => `${c.qty}× ${c.name}`).join(", ")}.`
      : "Cart is empty.";
    const catLine = data.category && data.category !== "All"
      ? `Active category filter: ${data.category}.`
      : "No category filter.";

    try {
      const gateway = createLovableAiGatewayProvider(key);
      const { output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        output: Output.object({ schema: InsightSchema }),
        system:
          "You are an AI merchandising analyst for ReStok, a BC wholesale alcohol marketplace for licensed bars and restaurants. Keep insights concrete, BC/Vancouver-aware, and actionable. Use one emoji per insight in the icon field. Never recommend underage sales or undercutting LDB wholesale floor pricing.",
        prompt: `${MODE_PROMPT[data.mode]}\n\n${catLine}\n${cartLine}`,
      });
      return { insights: output.insights, error: null };
    } catch (err) {
      console.error("getAiInsights failed", err);
      const message = err instanceof Error ? err.message : "AI request failed.";
      return { insights: [], error: message };
    }
  });
