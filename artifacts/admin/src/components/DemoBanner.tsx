import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";

const API_BASE = "/api";

export default function DemoBanner() {
  const [isDemoLoaded, setIsDemoLoaded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const idToken = await user.getIdToken();
        const res = await fetch(`${API_BASE}/admin/ops/seed-demo`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setIsDemoLoaded(data.isDemoLoaded);
        }
      } catch {}
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isDemoLoaded || dismissed) return null;

  return (
    <div style={{
      background: "linear-gradient(90deg, #f59e0b, #d97706)",
      color: "white",
      padding: "8px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      fontSize: 13,
      fontWeight: 600,
      position: "relative",
      zIndex: 100,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        DEMO MODE — This dashboard contains simulated data for demonstration purposes only. Not real user data.
      </span>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: "rgba(255,255,255,0.2)",
          border: "none",
          color: "white",
          borderRadius: 4,
          padding: "2px 8px",
          cursor: "pointer",
          fontSize: 12,
          marginLeft: 8,
        }}
      >
        Dismiss
      </button>
    </div>
  );
}
