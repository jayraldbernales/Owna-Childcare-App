import { createContext, useContext, useEffect, useState } from "react";
import { AuthStorage } from "../utils/authStorage";
import type { ReactNode } from "react";

export interface User {
  id: string;
  firstname: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const auth = AuthStorage.get();
    if (auth) {
      setUser(auth.user);
      setToken(auth.token);
    }
  }, []);

  const login = (userData: User, jwtToken: string) => {
    AuthStorage.set(userData, jwtToken);
    setUser(userData);
    setToken(jwtToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
