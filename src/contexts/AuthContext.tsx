import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserData {
  id: string;
  email: string;
  display_name: string | null;
  email_confirmed: boolean;
  current_streak: number;
  longest_streak: number;
  total_xp: number;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  hasSession: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<{ user: import("@supabase/supabase-js").User | null; session: import("@supabase/supabase-js").Session | null }>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  const getFallbackUser = useCallback((authUser: User): UserData => ({
    id: authUser.id,
    email: authUser.email || "",
    display_name: typeof authUser.user_metadata?.display_name === "string" ? authUser.user_metadata.display_name : null,
    email_confirmed: !!authUser.email_confirmed_at,
    current_streak: 0,
    longest_streak: 0,
    total_xp: 0,
  }), []);

  const fetchUserProfile = useCallback(async (authUser: User) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", authUser.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    const profile = data || (await supabase
      .from("profiles")
      .insert({
        user_id: authUser.id,
        email: authUser.email || "",
        display_name: typeof authUser.user_metadata?.display_name === "string" ? authUser.user_metadata.display_name : null,
      })
      .select("*")
      .single()).data;

    if (!profile) return null;

    return {
      id: authUser.id,
      email: profile.email || authUser.email || "",
      display_name: profile.display_name || (typeof authUser.user_metadata?.display_name === "string" ? authUser.user_metadata.display_name : null),
      email_confirmed: "email_confirmed" in profile ? (profile as { email_confirmed?: boolean }).email_confirmed ?? !!authUser.email_confirmed_at : !!authUser.email_confirmed_at,
      current_streak: profile.current_streak ?? 0,
      longest_streak: profile.longest_streak ?? 0,
      total_xp: profile.total_xp ?? 0,
    } as UserData;
  }, []);

  const refreshUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setHasSession(!!session?.user);
    if (session?.user) {
      setUser(getFallbackUser(session.user));
      const profile = await fetchUserProfile(session.user);
      if (profile) setUser(profile);
    } else {
      setUser(null);
    }
  }, [fetchUserProfile, getFallbackUser]);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session?.user);
      if (session?.user) {
        setUser(getFallbackUser(session.user));
        setLoading(false);
        fetchUserProfile(session.user).then((profile) => {
          if (profile) setUser(profile);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session?.user);
      if (session?.user) {
        setUser(getFallbackUser(session.user));
        setLoading(false);
        setTimeout(() => {
          fetchUserProfile(session.user).then((profile) => {
            if (profile) setUser(profile);
          });
        }, 0);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile, getFallbackUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }, []);

  const signup = useCallback(
    async (email: string, password: string, displayName: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });
      if (error) throw error;

      // Best-effort profile update in case the DB trigger hasn't run yet.
      if (data.user) {
        await supabase
          .from("profiles")
          .update({ display_name: displayName })
          .eq("user_id", data.user.id);
      }

      return { user: data.user ?? null, session: data.session ?? null };
    },
    []
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setHasSession(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, hasSession, login, signup, logout, requestPasswordReset, updatePassword, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
