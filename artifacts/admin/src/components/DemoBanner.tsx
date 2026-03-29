import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";

const API_BASE = "/api";

export default function DemoBanner() {
  const [isDemoLoaded, setIsDemoLoaded] = useState(false);

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

  if (!isDemoLoaded) return null;

  return (
    <div style={{
      background: "linear-gradient(90deg, #f59e0b, #d97706)",
      color: "white",
      padding: "10px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      fontSize: 13,
      fontWeight: 600,
      position: "sticky",
      top: 0,
      zIndex: 1000,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <span>
        DEMO DATA ACTIVE — This dashboard is displaying simulated data for demonstration purposes. No real user data is shown.
      </span>
    </div>
  );
}
