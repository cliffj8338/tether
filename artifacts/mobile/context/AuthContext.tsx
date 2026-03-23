import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserRole = "parent" | "child";

interface User {
  id: number;
  email: string | null;
  displayName: string;
  role: UserRole;
  parentId: number | null;
  avatarColor: string;
  trustLevel: number;
  faithModeEnabled: boolean;
  isPaused: boolean;
  phone: string | null;
  familyCode: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isOnboarded: boolean;
}

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  setOnboarded: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isOnboarded: false,
  });

  useEffect(() => {
    loadAuth();
  }, []);

  const loadAuth = async () => {
    try {
      const [userStr, token, onboarded] = await Promise.all([
        AsyncStorage.getItem("tether_user"),
        AsyncStorage.getItem("tether_token"),
        AsyncStorage.getItem("tether_onboarded"),
      ]);
      setState({
        user: userStr ? JSON.parse(userStr) : null,
        token,
        isLoading: false,
        isOnboarded: onboarded === "true",
      });
    } catch {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = useCallback(async (user: User, token: string) => {
    await AsyncStorage.setItem("tether_user", JSON.stringify(user));
    await AsyncStorage.setItem("tether_token", token);
    setState(prev => ({ ...prev, user, token }));
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove(["tether_user", "tether_token"]);
    setState(prev => ({ ...prev, user: null, token: null }));
  }, []);

  const setOnboarded = useCallback(async () => {
    await AsyncStorage.setItem("tether_onboarded", "true");
    setState(prev => ({ ...prev, isOnboarded: true }));
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updated = { ...prev.user, ...updates };
      AsyncStorage.setItem("tether_user", JSON.stringify(updated));
      return { ...prev, user: updated };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setOnboarded, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
