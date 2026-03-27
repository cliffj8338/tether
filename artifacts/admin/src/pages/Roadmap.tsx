const ROADMAP = [
  {
    phase: "Phase 1 — Foundation",
    status: "in_progress" as const,
    quarter: "Q1 2026",
    items: [
      { title: "Core messaging platform", status: "complete" },
      { title: "Parent supervision dashboard", status: "complete" },
      { title: "Firebase authentication", status: "complete" },
      { title: "Admin intelligence dashboard", status: "complete" },
      { title: "Marketing website (tetherapp.app)", status: "complete" },
      { title: "Waitlist & early access pipeline", status: "complete" },
      { title: "Faith Mode content filtering", status: "complete" },
      { title: "Graduated trust system (5 levels)", status: "complete" },
      { title: "Safety alert system (5 levels)", status: "complete" },
      { title: "NLP conversation analysis engine", status: "in_progress" },
      { title: "Behavioral intelligence metrics", status: "in_progress" },
    ],
  },
  {
    phase: "Phase 2 — Intelligence",
    status: "upcoming" as const,
    quarter: "Q2 2026",
    items: [
      { title: "Network analysis & social graph", status: "planned" },
      { title: "Churn prediction models", status: "planned" },
      { title: "Anomaly detection system", status: "planned" },
      { title: "AI Research Assistant (Claude)", status: "in_progress" },
      { title: "Push notifications (Expo)", status: "planned" },
      { title: "Twilio SMS verification", status: "planned" },
      { title: "Dual-layer PII architecture", status: "planned" },
      { title: "Anti-addiction screen time controls", status: "planned" },
    ],
  },
  {
    phase: "Phase 3 — Growth",
    status: "upcoming" as const,
    quarter: "Q3 2026",
    items: [
      { title: "RevenueCat subscription billing", status: "planned" },
      { title: "School admin portal", status: "planned" },
      { title: "Church community features", status: "planned" },
      { title: "Group messaging", status: "planned" },
      { title: "Media sharing (images/voice)", status: "planned" },
      { title: "App Store & Google Play launch", status: "planned" },
      { title: "COPPA compliance certification", status: "planned" },
    ],
  },
  {
    phase: "Phase 4 — Scale",
    status: "upcoming" as const,
    quarter: "Q4 2026",
    items: [
      { title: "Enterprise school district licensing", status: "planned" },
      { title: "Advanced parental analytics app", status: "planned" },
      { title: "Multilingual support", status: "planned" },
      { title: "API partner integrations", status: "planned" },
      { title: "Research publication pipeline", status: "planned" },
      { title: "SOC 2 Type II certification", status: "planned" },
    ],
  },
];

const statusIcon = (status: string) => {
  if (status === "complete") return <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg></div>;
  if (status === "in_progress") return <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full animate-pulse" /></div>;
  return <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />;
};

const phaseStatusBadge = (status: string) => {
  if (status === "in_progress") return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">In Progress</span>;
  if (status === "complete") return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Complete</span>;
  return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Upcoming</span>;
};

export default function Roadmap() {
  const totalItems = ROADMAP.reduce((sum, p) => sum + p.items.length, 0);
  const completedItems = ROADMAP.reduce((sum, p) => sum + p.items.filter(i => i.status === "complete").length, 0);
  const inProgressItems = ROADMAP.reduce((sum, p) => sum + p.items.filter(i => i.status === "in_progress").length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Product Roadmap</h1>
        <p className="text-muted-foreground text-sm mt-1">Tether platform development timeline</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold text-green-600">{completedItems}</div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600">{inProgressItems}</div>
          <div className="text-xs text-muted-foreground">In Progress</div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold">{totalItems - completedItems - inProgressItems}</div>
          <div className="text-xs text-muted-foreground">Planned</div>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm text-muted-foreground">{Math.round((completedItems / totalItems) * 100)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all" style={{ width: `${(completedItems / totalItems) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-6">
        {ROADMAP.map((phase) => (
          <div key={phase.phase} className="bg-card border rounded-xl overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{phase.phase}</h3>
                <span className="text-xs text-muted-foreground">{phase.quarter}</span>
              </div>
              {phaseStatusBadge(phase.status)}
            </div>
            <div className="p-4 space-y-3">
              {phase.items.map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  {statusIcon(item.status)}
                  <span className={`text-sm ${item.status === "complete" ? "text-muted-foreground line-through" : ""}`}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
