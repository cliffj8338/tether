import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { auth, googleProvider, firebaseConfigured } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";

interface AdminUser {
  id: number;
  email: string | null;
  displayName: string;
  role: string;
  isAdmin: boolean;
  avatarColor: string | null;
}

interface AuthState {
  firebaseUser: FirebaseUser | null;
  adminUser: AdminUser | null;
  loading: boolean;
  error: string | null;
  idToken: string | null;
  configured: boolean;
}

interface AuthContextValue extends AuthState {
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const API_BASE = "/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    adminUser: null,
    loading: firebaseConfigured,
    error: null,
    idToken: null,
    configured: firebaseConfigured,
  });

  const verifyWithBackend = useCallback(async (user: FirebaseUser) => {
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${API_BASE}/admin/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Authentication failed" }));
        throw new Error(data.error || "Authentication failed");
      }

      const data = await res.json();
      setState({
        firebaseUser: user,
        adminUser: data.user,
        loading: false,
        error: null,
        idToken,
        configured: true,
      });
    } catch (err: any) {
      setState({
        firebaseUser: user,
        adminUser: null,
        loading: false,
        error: err.message || "Authentication failed",
        idToken: null,
        configured: true,
      });
    }
  }, []);

  useEffect(() => {
    if (!firebaseConfigured) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await verifyWithBackend(user);
      } else {
        setState({ firebaseUser: null, adminUser: null, loading: false, error: null, idToken: null, configured: true });
      }
    });
    return unsubscribe;
  }, [verifyWithBackend]);

  const signInWithGoogle = useCallback(async () => {
    if (!firebaseConfigured) {
      setState(prev => ({ ...prev, error: "Firebase is not configured. Please add your Firebase config to continue." }));
      return;
    }
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message || "Sign-in failed" }));
    }
  }, []);

  const logout = useCallback(async () => {
    if (firebaseConfigured) {
      await signOut(auth);
    }
    setState({ firebaseUser: null, adminUser: null, loading: false, error: null, idToken: null, configured: firebaseConfigured });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
