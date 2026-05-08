import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../api/axiosInstance";

interface User {
  _id: string;
  username: string;
  email: string;
  bookmarks: string[];
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setAccessToken(token);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    const { user: u, accessToken: token } = data.data;
    setUser(u);
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const register = async (username: string, email: string, password: string) => {
    await api.post("/auth/register", { username, email, password });
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
