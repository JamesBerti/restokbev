import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SignupProcessFlow } from "@/components/restok/SignupProcessFlow";
import { CatalogConnect } from "@/components/restok/CatalogConnect";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

type Retailer = { id: string; name: string; neighborhood: string | null };

const POS_OPTIONS = [
  "Lightspeed",
  "KORONA",
  "BottlePOS",
  "mPower Beverage",
  "Square",
  "Other",
  "Not sure",
] as const;

function SignupPage() {
  const navigate = useNavigate();
  const { refreshRoles } = useAuth();
  const [accountType, setAccountType] = useState<"licensee" | "retailer">("licensee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [lcrbLicence, setLcrbLicence] = useState("");
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [retailerId, setRetailerId] = useState("");

  // Retailer-specific
  const [storeWebsite, setStoreWebsite] = useState("");
  const [posSystem, setPosSystem] = useState<string>("Not sure");
  const [notifyPhone, setNotifyPhone] = useState("");

  // Licensee-specific
  const [receivingHours, setReceivingHours] = useState("");
  const [approver, setApprover] = useState("");
  const [buyFrom, setBuyFrom] = useState<"BC Liquor Stores" | "Sales reps" | "Both">("Both");

  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);

  useEffect(() => {
    supabase.from("retailers").select("id, name, neighborhood").order("name").then(({ data }) => {
      setRetailers((data ?? []) as Retailer[]);
      if (data?.[0]) setRetailerId(data[0].id);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setInfo(""); setBusy(true);
    if (!/^[A-Za-z0-9-]{4,32}$/.test(lcrbLicence.trim())) {
      setBusy(false);
      return setErr("Enter a valid LCRB licence number (4–32 letters, digits, or dashes).");
    }
    const redirectUrl = `${window.location.origin}/`;
    const metadata: Record<string, unknown> = {
      business_name: businessName,
      display_name: businessName,
      lcrb_licence: lcrbLicence.trim(),
      account_type: accountType,
      pos_system: posSystem,
    };
    if (accountType === "retailer") {
      metadata.store_website = storeWebsite;
      metadata.notify_phone = notifyPhone;
    } else {
      metadata.receiving_hours = receivingHours;
      metadata.approver = approver;
      metadata.buy_from = buyFrom;
    }

    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: redirectUrl, data: metadata },
    });
    if (error) { setBusy(false); return setErr(error.message); }
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
        setShowCatalog(true);
      } else {
        navigate({ to: "/" });
      }
    } else {
      setBusy(false);
      if (accountType === "retailer") {
        setShowCatalog(true);
      } else {
        setInfo("Check your email to confirm, then sign in to finish setup.");
      }
    }
  };

  if (showCatalog) {
    return (
      <div className="flex min-h-screen items-start justify-center bg-background px-5 py-10">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-7 shadow-soft">
          <CatalogConnect
            onFinish={() => {
              setInfo("Account created. Awaiting admin approval before you can manage products.");
              setTimeout(() => navigate({ to: "/retailer" }), 800);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-md">
        <SignupProcessFlow kind={accountType} />
      <form onSubmit={submit} className="w-full rounded-2xl border border-border bg-surface p-7 shadow-soft">
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
          <span className="mb-1 block text-xs font-semibold text-foreground">
            {accountType === "retailer" ? "Store name" : "Venue name"}
          </span>
          <input required value={businessName} onChange={(e) => setBusinessName(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-semibold text-foreground">Licence number</span>
          <input required value={lcrbLicence} onChange={(e) => setLcrbLicence(e.target.value)}
            placeholder="e.g. 123456"
            className="w-full rounded-lg border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
          <span className="mt-1 block text-[11px] text-muted-foreground">
            {accountType === "licensee"
              ? "Your Liquor Primary, Food Primary, or Manufacturer licence number."
              : "Your Licensee Retail Store licence number."}
          </span>
        </label>

        {accountType === "retailer" && (
          <>
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

            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-semibold text-foreground">Store website URL</span>
              <input type="url" required value={storeWebsite} onChange={(e) => setStoreWebsite(e.target.value)}
                placeholder="https://"
                className="w-full rounded-lg border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>

            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-semibold text-foreground">Point-of-sale system</span>
              <select required value={posSystem} onChange={(e) => setPosSystem(e.target.value)}
                className="w-full rounded-lg border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                {POS_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>

            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-semibold text-foreground">Order-notification phone number</span>
              <input type="tel" required value={notifyPhone} onChange={(e) => setNotifyPhone(e.target.value)}
                placeholder="604-555-0100"
                className="w-full rounded-lg border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>
          </>
        )}

        {accountType === "licensee" && (
          <>
            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-semibold text-foreground">Receiving hours</span>
              <input required value={receivingHours} onChange={(e) => setReceivingHours(e.target.value)}
                placeholder="e.g. Mon–Fri, 10am–4pm"
                className="w-full rounded-lg border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>

            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-semibold text-foreground">Who is authorised to approve orders?</span>
              <input required value={approver} onChange={(e) => setApprover(e.target.value)}
                placeholder="Name and role"
                className="w-full rounded-lg border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>

            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-semibold text-foreground">Point-of-sale system</span>
              <select required value={posSystem} onChange={(e) => setPosSystem(e.target.value)}
                className="w-full rounded-lg border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                {POS_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>

            <div className="mb-3">
              <div className="mb-1 text-xs font-semibold text-foreground">Where do you buy today?</div>
              <div className="grid grid-cols-3 gap-2">
                {(["BC Liquor Stores", "Sales reps", "Both"] as const).map((v) => (
                  <button key={v} type="button" onClick={() => setBuyFrom(v)}
                    className={`rounded-lg border-[1.5px] px-2 py-2 text-[11px] font-semibold transition ${buyFrom === v ? "border-primary bg-primary-light text-foreground" : "border-border bg-background text-muted-foreground"}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </>
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
    </div>
  );
}
