const LAYERS = [
  {
    name: "Client Layer",
    color: "bg-blue-50 border-blue-200",
    headerColor: "bg-blue-100 text-blue-800",
    components: [
      { name: "Expo React Native App", desc: "iOS & Android mobile client", tech: "React Native, Expo SDK 53, TypeScript" },
      { name: "Marketing Website", desc: "tetherapp.app — public site", tech: "React, Vite, Tailwind CSS, Framer Motion" },
      { name: "Admin Dashboard", desc: "Intelligence & operations portal", tech: "React, Vite, Tailwind CSS, Recharts" },
    ],
  },
  {
    name: "API Layer",
    color: "bg-green-50 border-green-200",
    headerColor: "bg-green-100 text-green-800",
    components: [
      { name: "Express API Server", desc: "RESTful API with auth middleware", tech: "Express.js, TypeScript, Node.js" },
      { name: "Firebase Auth", desc: "Google sign-in, token verification", tech: "Firebase Admin SDK, OIDC" },
      { name: "Admin Auth Middleware", desc: "requireAdmin gate + role checks", tech: "Firebase token verification" },
    ],
  },
  {
    name: "Intelligence Layer",
    color: "bg-purple-50 border-purple-200",
    headerColor: "bg-purple-100 text-purple-800",
    components: [
      { name: "NLP Analysis Engine", desc: "Sentiment, topics, emotional tone", tech: "Custom algorithms, keyword extraction" },
      { name: "Behavioral Metrics", desc: "Volatility, anxiety, fatigue scoring", tech: "Statistical analysis, sliding windows" },
      { name: "Network Analysis", desc: "Social graph, influence scores", tech: "Graph algorithms, reciprocity metrics" },
      { name: "Churn Prediction", desc: "Risk scoring & anomaly detection", tech: "Gradient analysis, pattern matching" },
      { name: "AI Research Assistant", desc: "Natural language data querying", tech: "Claude (Anthropic), SQL generation" },
    ],
  },
  {
    name: "Data Layer",
    color: "bg-amber-50 border-amber-200",
    headerColor: "bg-amber-100 text-amber-800",
    components: [
      { name: "PostgreSQL Database", desc: "18 tables, relational data store", tech: "Drizzle ORM, Zod validation" },
      { name: "PII Protection Layer", desc: "Dual-layer encryption architecture", tech: "End-to-end encryption, key isolation" },
      { name: "Analytics Pipeline", desc: "Event tracking & metric aggregation", tech: "Batch computation, time-series" },
    ],
  },
  {
    name: "Integration Layer",
    color: "bg-rose-50 border-rose-200",
    headerColor: "bg-rose-100 text-rose-800",
    components: [
      { name: "Twilio", desc: "SMS verification & notifications", tech: "REST API, phone verification" },
      { name: "RevenueCat", desc: "Subscription billing & entitlements", tech: "In-app purchases, receipts" },
      { name: "Expo Notifications", desc: "Push notifications for mobile", tech: "Expo Push API, FCM/APNs" },
    ],
  },
];

export default function SystemArchitecture() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Architecture</h1>
        <p className="text-muted-foreground text-sm mt-1">Tether platform component overview</p>
      </div>

      <div className="bg-card border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Platform Stack</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-200" /> Client</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-200" /> API</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-purple-200" /> Intelligence</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-200" /> Data</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-rose-200" /> Integrations</span>
          </div>
        </div>

        <div className="space-y-4">
          {LAYERS.map((layer) => (
            <div key={layer.name} className={`border rounded-xl overflow-hidden ${layer.color}`}>
              <div className={`px-4 py-2.5 font-semibold text-sm ${layer.headerColor}`}>
                {layer.name}
              </div>
              <div className="p-3 grid grid-cols-3 gap-3">
                {layer.components.map((comp) => (
                  <div key={comp.name} className="bg-white/80 rounded-lg p-3 border border-white/50">
                    <div className="font-medium text-sm">{comp.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{comp.desc}</div>
                    <div className="text-[10px] text-muted-foreground/70 mt-1.5 font-mono">{comp.tech}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-semibold mb-3">Data Flow</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</div>
              <span>Mobile app sends messages via REST API</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">2</div>
              <span>API validates auth, stores in PostgreSQL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">3</div>
              <span>NLP engine analyzes content in real-time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">4</div>
              <span>Safety alerts generated for flagged content</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">5</div>
              <span>Parents notified via push / dashboard</span>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-semibold mb-3">Security Architecture</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 text-green-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <span>Firebase Auth with Google OIDC + PKCE</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 text-green-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <span>Dual-layer PII encryption (data + keys separated)</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 text-green-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <span>Role-based access control (parent, child, admin)</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 text-green-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <span>COPPA-compliant data handling</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 text-green-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <span>No PII sold — not even Tether can see child data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
