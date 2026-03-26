import { useAuth } from "@/lib/auth-context";

export default function Login() {
  const { signInWithGoogle, loading, error, configured } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="5" fill="white" />
                <line x1="26" y1="8" x2="26" y2="19.5" stroke="white" strokeWidth="3.4" strokeLinecap="round" />
                <line x1="26" y1="32.5" x2="26" y2="44" stroke="white" strokeWidth="3.4" strokeLinecap="round" />
                <line x1="8" y1="26" x2="19.5" y2="26" stroke="white" strokeWidth="3.4" strokeLinecap="round" />
                <line x1="32.5" y1="26" x2="44" y2="26" stroke="white" strokeWidth="3.4" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Tether Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">Intelligence Dashboard</p>
          </div>

          {!configured && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600 mt-0.5 flex-shrink-0">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800">Firebase not configured</p>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Add your Firebase project credentials to enable Google sign-in.
                    Set the VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID environment variables.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={signInWithGoogle}
              disabled={loading || !configured}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-border rounded-xl text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              {loading ? "Signing in..." : "Sign in with Google"}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Access restricted to authorized Tether administrators.
              Contact your system administrator if you need access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
