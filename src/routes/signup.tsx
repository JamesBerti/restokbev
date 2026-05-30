import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

type Retailer = { id: string; name: string; neighborhood: string | null };

function SignupPage() {
  const navigate = useNavigate();
  const { refreshRoles } = useAuth();
  const [accountType, setAccountType] = useState<"licensee" | "retailer">("licensee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [retailerId, setRetailerId] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("retailers").select("id, name, neighborhood").order("name").then(({ data }) => {
      setRetailers((data ?? []) as Retailer[]);
      if (data?.[0]) setRetailerId(data[0].id);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setInfo(""); setBusy(true);
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: redirectUrl, data: { business_name: businessName, display_name: businessName } },
    });
    if (error) { setBusy(false); return setErr(error.message); }
    // If session exists immediately, insert role
    if (data.session) {
      const { error: roleErr } = await supabase.from("user_roles").insert({
        user_id: data.session.user.id,
        role: accountType,
        retailer_id: accountType === "retailer" ? retailerId : null,
      });
      setBusy(false);
      if (roleErr) return setErr(roleErr.message);
      await refreshRoles();
      if (accountType === "retailer") {
        setInfo("Account created. Awaiting admin approval before you can manage products.");
        setTimeout(() => navigate({ to: "/retailer" }), 1500);
      } else {
        navigate({ to: "/" });
      }
    } else {
      setBusy(false);
      setInfo("Check your email to confirm, then sign in to finish setup.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-border bg-surface p-7 shadow-soft">
        <div className="mb-1 text-2xl font-black text-foreground">Create your account</div>
        <div className="mb-5 text-sm text-muted-foreground">Join ReStok as a licensee or retailer</div>

        <div className="mb-5 grid grid-cols-2 gap-2">
          {(["licensee", "retailer"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setAccountType(t)}
              className={`rounded-xl border-[1.5px] px-3 py-3 text-left transition ${accountType === t ? "border-primary bg-primary-light" : "border-border bg-background"}`}>
              <div className="text-sm font-bold text-foreground capitalize">{t}</div>
              <div className="text-[11px] text-muted-foreground">
                {t === "licensee" ? "I run a restaurant or bar" : "I run a liquor retail store"}
              </div>
            </button>
          ))}
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-semibold text-foreground">Business name</span>
          <input required value={businessName} onChange={(e) => setBusinessName(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        </label>

        {accountType === "retailer" && (
          <label className="mb-3 block">
            <span className="mb-1 block text-xs font-semibold text-foreground">Retailer store</span>
            <select required value={retailerId} onChange={(e) => setRetailerId(e.target.value)}
              className="w-full rounded-lg border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
              {retailers.map((r) => (
                <option key={r.id} value={r.id}>{r.name}{r.neighborhood ? ` — ${r.neighborhood}` : ""}</option>
              ))}
            </select>
            <span className="mt-1 block text-[11px] text-muted-foreground">An admin will verify and approve your store access.</span>
          </label>
        )}

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-semibold text-foreground">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-xs font-semibold text-foreground">Password</span>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        </label>

        {err && <div className="mb-3 rounded-md bg-destructive-soft px-3 py-2 text-xs text-destructive">{err}</div>}
        {info && <div className="mb-3 rounded-md bg-teal-soft px-3 py-2 text-xs text-teal">{info}</div>}

        <button type="submit" disabled={busy}
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60">
          {busy ? "Creating..." : "Create account"}
        </button>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Already have one? <Link to="/login" className="font-bold text-primary">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
