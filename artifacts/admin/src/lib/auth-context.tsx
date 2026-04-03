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
  isShowcase: boolean;
  showcaseToken: string | null;
}

interface AuthContextValue extends AuthState {
  signInWithGoogle: () => Promise<void>;
  showcaseLogin: (accessCode: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const API_BASE = "/api";

const SHOWCASE_STORAGE_KEY = "tether_showcase_token";
const SHOWCASE_USER_KEY = "tether_showcase_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const savedToken = sessionStorage.getItem(SHOWCASE_STORAGE_KEY);
  const savedUser = sessionStorage.getItem(SHOWCASE_USER_KEY);

  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    adminUser: savedUser ? JSON.parse(savedUser) : null,
    loading: savedToken ? false : firebaseConfigured,
    error: null,
    idToken: null,
    configured: firebaseConfigured,
    isShowcase: !!savedToken,
    showcaseToken: savedToken,
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
        isShowcase: false,
        showcaseToken: null,
      });
    } catch (err: any) {
      setState({
        firebaseUser: user,
        adminUser: null,
        loading: false,
        error: err.message || "Authentication failed",
        idToken: null,
        configured: true,
        isShowcase: false,
        showcaseToken: null,
      });
    }
  }, []);

  useEffect(() => {
    if (!firebaseConfigured || state.isShowcase) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await verifyWithBackend(user);
      } else {
        setState(prev => {
          if (prev.isShowcase) return prev;
          return { firebaseUser: null, adminUser: null, loading: false, error: null, idToken: null, configured: true, isShowcase: false, showcaseToken: null };
        });
      }
    });
    return unsubscribe;
  }, [verifyWithBackend, state.isShowcase]);

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

  const showcaseLogin = useCallback(async (accessCode: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(`${API_BASE}/admin/auth/showcase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Invalid access code" }));
        throw new Error(data.error || "Invalid access code");
      }

      const data = await res.json();
      sessionStorage.setItem(SHOWCASE_STORAGE_KEY, data.token);
      sessionStorage.setItem(SHOWCASE_USER_KEY, JSON.stringify(data.user));

      setState({
        firebaseUser: null,
        adminUser: data.user,
        loading: false,
        error: null,
        idToken: null,
        configured: true,
        isShowcase: true,
        showcaseToken: data.token,
      });
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message || "Showcase login failed" }));
    }
  }, []);

  const logout = useCallback(async () => {
    sessionStorage.removeItem(SHOWCASE_STORAGE_KEY);
    sessionStorage.removeItem(SHOWCASE_USER_KEY);
    if (firebaseConfigured && !state.isShowcase) {
      await signOut(auth);
    }
    setState({ firebaseUser: null, adminUser: null, loading: false, error: null, idToken: null, configured: firebaseConfigured, isShowcase: false, showcaseToken: null });
  }, [state.isShowcase]);

  return (
    <AuthContext.Provider value={{ ...state, signInWithGoogle, showcaseLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
