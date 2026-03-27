const VERSION_INFO = {
  platform: "Tether",
  version: "0.1.0-alpha",
  buildDate: "March 2026",
  environment: import.meta.env.MODE,
};

const PACKAGES = [
  { name: "React", version: "19.x", category: "Frontend" },
  { name: "React Native (Expo)", version: "SDK 53", category: "Mobile" },
  { name: "Vite", version: "7.x", category: "Build" },
  { name: "TypeScript", version: "5.x", category: "Language" },
  { name: "Express.js", version: "4.x", category: "Backend" },
  { name: "Drizzle ORM", version: "0.39.x", category: "Database" },
  { name: "PostgreSQL", version: "16", category: "Database" },
  { name: "Tailwind CSS", version: "4.x", category: "Styling" },
  { name: "TanStack Query", version: "5.x", category: "State" },
  { name: "Recharts", version: "2.x", category: "Charts" },
  { name: "Framer Motion", version: "11.x", category: "Animation" },
  { name: "Firebase Admin", version: "13.x", category: "Auth" },
  { name: "Zod", version: "4.x", category: "Validation" },
  { name: "Wouter", version: "3.x", category: "Routing" },
];

const FEATURE_FLAGS = [
  { name: "Firebase Authentication", key: "VITE_FIREBASE_PROJECT_ID", enabled: !!import.meta.env.VITE_FIREBASE_PROJECT_ID },
  { name: "Faith Mode", key: "faith_mode", enabled: true },
  { name: "Graduated Trust System", key: "trust_levels", enabled: true },
  { name: "Safety Alert Levels (5)", key: "alert_levels", enabled: true },
  { name: "NLP Analysis Engine", key: "nlp_engine", enabled: true },
  { name: "Behavioral Intelligence", key: "behavioral_intel", enabled: true },
  { name: "AI Research Assistant", key: "ai_research", enabled: true },
  { name: "Network Analysis", key: "network_analysis", enabled: true },
  { name: "Churn Predictions", key: "churn_predictions", enabled: true },
  { name: "Anti-Addiction Controls", key: "anti_addiction", enabled: false },
  { name: "Group Messaging", key: "group_messaging", enabled: false },
  { name: "Media Sharing", key: "media_sharing", enabled: false },
];

const DB_TABLES = [
  { name: "users", desc: "Parents, children, admins" },
  { name: "contacts", desc: "Approved messaging contacts" },
  { name: "conversations", desc: "Chat sessions" },
  { name: "messages", desc: "Individual messages with safety flags" },
  { name: "alerts", desc: "Safety notifications for parents" },
  { name: "waitlist", desc: "Pre-launch signups" },
  { name: "analytics_events", desc: "App/web/API events" },
  { name: "session_tracking", desc: "User sessions" },
  { name: "message_analytics", desc: "NLP-derived message metrics" },
  { name: "conversation_insights", desc: "Aggregated conversation data" },
  { name: "keyword_trends", desc: "Topic/keyword tracking" },
  { name: "safety_analytics", desc: "Safety metric aggregates" },
  { name: "demographic_snapshots", desc: "User base snapshots" },
  { name: "behavioral_metrics", desc: "Psychological indicators" },
  { name: "network_graph", desc: "Social network analysis" },
  { name: "churn_predictions", desc: "User retention predictions" },
  { name: "temporal_anomalies", desc: "Anomaly detection results" },
  { name: "interest_graph", desc: "Interest clustering" },
];

export default function VersionConfig() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Version & Configuration</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform versions, feature flags, and system configuration</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-4">
          <div className="text-lg font-bold font-mono">{VERSION_INFO.version}</div>
          <div className="text-xs text-muted-foreground">Version</div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="text-lg font-bold">{VERSION_INFO.buildDate}</div>
          <div className="text-xs text-muted-foreground">Build Date</div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="text-lg font-bold capitalize">{VERSION_INFO.environment}</div>
          <div className="text-xs text-muted-foreground">Environment</div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="text-lg font-bold">{DB_TABLES.length}</div>
          <div className="text-xs text-muted-foreground">Database Tables</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Feature Flags</h3>
          </div>
          <div className="p-3 space-y-1.5">
            {FEATURE_FLAGS.map(f => (
              <div key={f.key} className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-muted/30">
                <span className="text-sm">{f.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${f.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {f.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-xl">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Technology Stack</h3>
          </div>
          <div className="p-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="px-2 py-1.5 font-medium">Package</th>
                  <th className="px-2 py-1.5 font-medium">Version</th>
                  <th className="px-2 py-1.5 font-medium">Category</th>
                </tr>
              </thead>
              <tbody>
                {PACKAGES.map(p => (
                  <tr key={p.name} className="hover:bg-muted/30">
                    <td className="px-2 py-1.5 font-mono text-xs">{p.name}</td>
                    <td className="px-2 py-1.5 text-muted-foreground text-xs">{p.version}</td>
                    <td className="px-2 py-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">{p.category}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-xl">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Database Schema ({DB_TABLES.length} Tables)</h3>
        </div>
        <div className="p-3 grid grid-cols-3 gap-2">
          {DB_TABLES.map(t => (
            <div key={t.name} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-muted/30">
              <svg className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              <div>
                <div className="text-xs font-mono font-medium">{t.name}</div>
                <div className="text-[10px] text-muted-foreground">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
