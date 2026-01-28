import React, { createContext, useContext, useMemo, useState } from "react";

type User = { name: string; role: "관리자" | "조회자" };

type AuthContextValue = {
  user: User | null;
  login: (id: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const LS_KEY = "sbom_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  });

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      login: (id: string, password: string) => {
        // 보완: 데모 로그인 규칙(원하면 서버 인증으로 교체)
        if (!id || !password) return false;

        const next: User = {
          name: id,
          role: id.toLowerCase().includes("admin") ? "관리자" : "조회자",
        };
        localStorage.setItem(LS_KEY, JSON.stringify(next));
        setUser(next);
        return true;
      },
      logout: () => {
        localStorage.removeItem(LS_KEY);
        setUser(null);
      },
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext not found");
  return ctx;
}
