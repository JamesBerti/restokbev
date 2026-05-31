import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { refreshRoles } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const { data: signIn, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setBusy(false); return setErr(error.message); }
    // Look up role to route the user to the right home surface
    const uid = signIn.user?.id;
    let dest: "/" | "/retailer" = "/";
    if (uid) {
      const { data: rs } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      if ((rs ?? []).some((r) => r.role === "retailer")) dest = "/retailer";
    }
    await refreshRoles();
    setBusy(false);
    navigate({ to: dest });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-7 shadow-soft">
        <div className="mb-1 text-2xl font-black text-foreground">Sign in</div>
        <div className="mb-6 text-sm text-muted-foreground">to your ReStok account</div>
        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-semibold text-foreground">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-xs font-semibold text-foreground">Password</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        </label>
        {err && <div className="mb-3 rounded-md bg-destructive-soft px-3 py-2 text-xs text-destructive">{err}</div>}
        <button type="submit" disabled={busy}
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60">
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          New to ReStok? <Link to="/signup" className="font-bold text-primary">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
