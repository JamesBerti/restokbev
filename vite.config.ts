// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const PUBLIC_SUPABASE_URL_FALLBACK = "https://qvbspgpgeuarpxppdbok.supabase.co";
const PUBLIC_SUPABASE_KEY_FALLBACK =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2YnNwZ3BnZXVhcnB4cHBkYm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTk3MTMsImV4cCI6MjA5NTczNTcxM30.tGwN_qFC5DLN6oDt7VFLeoMb2j4oAFJn3BflDCmkDpQ";
const PUBLIC_SUPABASE_PROJECT_ID_FALLBACK = "qvbspgpgeuarpxppdbok";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    nitro: {
      preset: "cloudflare-pages",
    },
  },
  vite: {
    // Ensure public Supabase envs are always available in preview/published browser bundles.
    // These are publishable values (safe for client code).
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
        process.env.VITE_SUPABASE_URL ?? PUBLIC_SUPABASE_URL_FALLBACK,
      ),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
        process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? PUBLIC_SUPABASE_KEY_FALLBACK,
      ),
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(
        process.env.VITE_SUPABASE_PROJECT_ID ?? PUBLIC_SUPABASE_PROJECT_ID_FALLBACK,
      ),
    },
  },
});
