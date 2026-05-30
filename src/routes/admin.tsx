import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type PendingRow = {
  id: string;
  user_id: string;
  role: "admin" | "retailer" | "licensee";
  retailer_id: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  retailers: { name: string } | null;
};

function AdminPage() {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();
  const isAdmin = roles.some((r) => r.role === "admin" && r.status === "approved");
  const [rows, setRows] = useState<PendingRow[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => { if (!loading && !user) navigate({ to: "/login" }); }, [loading, user, navigate]);

  const load = async () => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("id, user_id, role, retailer_id, status, created_at, retailers(name)")
      .order("created_at", { ascending: false });
    if (error) setMsg(error.message);
    setRows((data ?? []) as unknown as PendingRow[]);
  };

  useEffect(() => { if (isAdmin) void load(); }, [isAdmin]);

  const setStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("user_roles").update({ status }).eq("id", id);
    if (error) setMsg(error.message);
    void load();
  };

  if (loading) return <Centered>Loading…</Centered>;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-[700px] px-5 py-16 text-center">
          <div className="text-xl font-bold text-foreground">Admin access only</div>
          <div className="mt-2 text-sm text-muted-foreground">
            You're signed in as {user?.email}. Ask the platform admin to grant you access.
          </div>
        </div>
      </div>
    );
  }

  const pending = rows.filter((r) => r.status === "pending");
  const other = rows.filter((r) => r.status !== "pending");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1000px] px-5 py-8">
        <h1 className="mb-1 text-2xl font-black text-foreground">Platform admin</h1>
        <div className="mb-6 text-sm text-muted-foreground">Approve retailer signups and manage roles.</div>
        {msg && <div className="mb-4 rounded-md bg-destructive-soft px-3 py-2 text-xs text-destructive">{msg}</div>}

        <Section title={`Pending approvals (${pending.length})`}>
          {!pending.length ? <Empty>Nothing waiting.</Empty> : pending.map((r) => (
            <RoleRow key={r.id} r={r}>
              <button onClick={() => setStatus(r.id, "approved")} className="rounded-lg bg-teal px-3 py-1.5 text-xs font-bold text-white">Approve</button>
              <button onClick={() => setStatus(r.id, "rejected")} className="rounded-lg border border-destructive px-3 py-1.5 text-xs font-bold text-destructive">Reject</button>
            </RoleRow>
          ))}
        </Section>

        <Section title="All role assignments">
          {!other.length ? <Empty>None yet.</Empty> : other.map((r) => (
            <RoleRow key={r.id} r={r}>
              <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${r.status === "approved" ? "bg-teal-soft text-teal" : "bg-destructive-soft text-destructive"}`}>
                {r.status}
              </span>
            </RoleRow>
          ))}
        </Section>
      </main>
    </div>
  );
}

function RoleRow({ r, children }: { r: PendingRow; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3 first:border-t-0">
      <div>
        <div className="text-sm font-bold text-foreground capitalize">{r.role}{r.retailers?.name ? ` · ${r.retailers.name}` : ""}</div>
        <div className="text-[11px] text-muted-foreground">user_id: {r.user_id.slice(0, 8)}… · {new Date(r.created_at).toLocaleString()}</div>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-2xl border border-border bg-surface shadow-soft">
      <div className="border-b border-border px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div>{children}</div>
    </div>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-6 text-center text-sm text-muted-foreground">{children}</div>;
}
function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">{children}</div>;
}
function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-5">
        <Link to="/" className="bg-brand-gradient rounded-lg px-3 py-1 text-[15px] font-black tracking-tight text-white">ReStok</Link>
        <nav className="flex items-center gap-4 text-xs font-bold">
          <Link to="/" className="text-muted-foreground hover:text-foreground">Marketplace</Link>
          <Link to="/retailer" className="text-muted-foreground hover:text-foreground">Retailer</Link>
          <Link to="/admin" className="text-foreground">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
