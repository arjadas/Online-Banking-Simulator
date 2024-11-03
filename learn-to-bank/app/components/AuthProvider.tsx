import { createContext, useContext, useState } from "react";

export const AuthContext = createContext<{ uid: string | null; setuid: (id: string | null) => void } | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  uid: string | null;
}

export function AuthProvider({ children, uid: initialuid }: AuthProviderProps) {
  const [uid, setuid] = useState<string | null>(initialuid);
  return <AuthContext.Provider value={{ uid, setuid }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}