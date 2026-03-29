import { useState, useEffect, useCallback } from "react";
import { auth } from "../lib/firebase";

const API_BASE = "/api";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (user) {
    const idToken = await user.getIdToken();
    return { Authorization: `Bearer ${idToken}` };
  }
  return {};
}

interface Stats {
  users: number;
  messages: number;
  alerts: number;
  conversations: number;
  contacts: number;
  waitlist: number;
  messageAnalytics: number;
  behavioralMetrics: number;
  networkGraph: number;
  churnPredictions: number;
  anomalies: number;
  interestGraph: number;
  keywordTrends: number;
  sessions: number;
  events: number;
}

export default function DemoData() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seedProgress, setSeedProgress] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/ops/stats`, { headers });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleSeed = async () => {
    if (!confirm("This will generate ~1,500 demo users with full analytics data. Takes about 30 seconds. Continue?")) return;
    setSeeding(true);
    setError(null);
    setMessage(null);
    setSeedProgress("Starting demo data generation...");
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/ops/seed-demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to seed");
        setSeeding(false);
        setSeedProgress(null);
        return;
      }
      setMessage(data.message || "Seeding started!");
      setSeedProgress("Generating users, conversations, messages, analytics... This takes about 30 seconds.");

      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        await fetchStats();
        const statusRes = await fetch(`${API_BASE}/admin/ops/seed-demo`, { headers: await getAuthHeaders() });
        const statusData = await statusRes.json();
        if (!statusData.isRunning || attempts >= 20) {
          clearInterval(poll);
          setSeeding(false);
          setSeedProgress(null);
          setMessage("Demo data generation complete! Refresh analytics pages to see the data.");
        }
      }, 5000);

    } catch (err: any) {
      setError(err.message);
      setSeeding(false);
      setSeedProgress(null);
    }
  };

  const handleClear = async () => {
    if (!confirm("This will DELETE all demo data. Your real accounts (if any) won't be affected. Continue?")) return;
    setClearing(true);
    setError(null);
    setMessage(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/ops/seed-demo`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message || "Demo data cleared!");
      await fetchStats();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setClearing(false);
    }
  };

  const statItems = stats ? [
    { label: "Users", value: stats.users, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "Messages", value: stats.messages, icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
    { label: "Alerts", value: stats.alerts, icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" },
    { label: "Conversations", value: stats.conversations, icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" },
    { label: "Contacts", value: stats.contacts, icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
    { label: "Waitlist", value: stats.waitlist, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { label: "Message Analytics", value: stats.messageAnalytics, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { label: "Behavioral Metrics", value: stats.behavioralMetrics, icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
    { label: "Network Graph", value: stats.networkGraph, icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
    { label: "Churn Predictions", value: stats.churnPredictions, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
    { label: "Anomalies", value: stats.anomalies, icon: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Interest Graph", value: stats.interestGraph, icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
    { label: "Sessions", value: stats.sessions, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Events", value: stats.events, icon: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" },
  ] : [];

  const hasData = stats && stats.users > 50;

  return (
    <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1a1a2e" }}>
          Demo Data Manager
        </h1>
        <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6 }}>
          Load realistic demo data to showcase all analytics, intelligence, and reporting features.
          Generates ~1,500 users (500 parents + ~1,000 children), conversations, messages with full
          NLP analytics, behavioral metrics, network graphs, churn predictions, and more.
        </p>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#991b1b", marginBottom: 20, fontSize: 14 }}>
          {error}
        </div>
      )}
      {message && (
        <div style={{ padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, color: "#166534", marginBottom: 20, fontSize: 14 }}>
          {message}
        </div>
      )}

      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
        <button
          onClick={handleSeed}
          disabled={seeding || clearing}
          style={{
            padding: "14px 28px",
            background: seeding ? "#9ca3af" : "#6B9E8A",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 600,
            cursor: seeding ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {seeding ? (
            <>
              <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Generating...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
              Load Demo Data
            </>
          )}
        </button>

        {hasData && (
          <button
            onClick={handleClear}
            disabled={seeding || clearing}
            style={{
              padding: "14px 28px",
              background: clearing ? "#9ca3af" : "#ef4444",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: clearing ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {clearing ? "Clearing..." : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Clear Demo Data
              </>
            )}
          </button>
        )}
      </div>

      {seedProgress && (
        <div style={{ padding: "16px 20px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, marginBottom: 24, fontSize: 14, color: "#1e40af" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #3b82f6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            {seedProgress}
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#999" }}>Loading stats...</div>
      ) : stats ? (
        <>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#374151" }}>
            Current Data Counts
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {statItems.map(item => (
              <div key={item.label} style={{
                padding: "16px",
                background: "white",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: item.value > 0 ? "#ecfdf5" : "#f9fafb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.value > 0 ? "#6B9E8A" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: item.value > 0 ? "#1a1a2e" : "#9ca3af" }}>
                    {item.value.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: "20px 24px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 12 }}>What gets generated</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8, fontSize: 13, color: "#4b5563" }}>
              <div>~500 parent accounts across diverse families</div>
              <div>~1,000 children (ages 6-16, grades K-8th)</div>
              <div>Schools, churches, faith-based & secular communities</div>
              <div>Conversations with realistic messages (~5K)</div>
              <div>Full NLP analytics (sentiment, topics, vocabulary)</div>
              <div>Behavioral metrics with weekly trends</div>
              <div>Network graph with roles & clusters</div>
              <div>Churn predictions with risk scores</div>
              <div>Temporal anomalies (volume spikes, shifts)</div>
              <div>Interest graphs by age group</div>
              <div>Keyword trends across demographics</div>
              <div>Web + app session tracking & events</div>
              <div>200 waitlist signups (parents, schools, churches)</div>
              <div>Faith Mode adoption data (~40% of users)</div>
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
          Could not load stats. Make sure the API server is running.
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
