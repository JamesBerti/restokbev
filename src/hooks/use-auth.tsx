import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Role = "admin" | "retailer" | "licensee";

export type RoleRow = {
  id: string;
  role: Role;
  retailer_id: string | null;
  status: "pending" | "approved" | "rejected";
};

type AuthCtx = {
  user: User | null;
  session: Session | null;
  roles: RoleRow[];
  loading: boolean;
  refreshRoles: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoles = async (uid: string | null) => {
    if (!uid) {
      setRoles([]);
      return;
    }
    const { data } = await supabase
      .from("user_roles")
      .select("id, role, retailer_id, status")
      .eq("user_id", uid);
    setRoles((data ?? []) as RoleRow[]);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setTimeout(() => { void loadRoles(s?.user?.id ?? null); }, 0);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      void loadRoles(data.session?.user?.id ?? null).finally(() => setLoading(false));
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        session,
        roles,
        loading,
        refreshRoles: () => loadRoles(user?.id ?? null),
        signOut: async () => { await supabase.auth.signOut(); },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
