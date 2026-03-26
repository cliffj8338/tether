import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Overview from "@/pages/Overview";
import ConversationIntelligence from "@/pages/ConversationIntelligence";
import SafetyCenter from "@/pages/SafetyCenter";
import Demographics from "@/pages/Demographics";
import Engagement from "@/pages/Engagement";
import ContentResearch from "@/pages/ContentResearch";
import WebsiteAnalytics from "@/pages/WebsiteAnalytics";
import BehavioralIntelligence from "@/pages/BehavioralIntelligence";
import NetworkAnalysis from "@/pages/NetworkAnalysis";
import PredictiveAnalytics from "@/pages/PredictiveAnalytics";
import AiResearchAssistant from "@/pages/AiResearchAssistant";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

const NAV_ITEMS = [
  { path: "/", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  { path: "/conversations", label: "Conversations", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { path: "/safety", label: "Safety Center", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { path: "/demographics", label: "Demographics", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { path: "/engagement", label: "Engagement", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { path: "/content", label: "Content Research", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { path: "/website", label: "Website", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" },
  { path: "/behavioral", label: "Behavioral Intel", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { path: "/network", label: "Network Analysis", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
  { path: "/predictions", label: "Predictions", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  { path: "/ai-research", label: "AI Research", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const [location] = useLocation();

  return (
    <aside className={`fixed top-0 left-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-200 z-50 flex flex-col ${collapsed ? "w-16" : "w-56"}`}>
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="5" fill="white" />
            <line x1="26" y1="8" x2="26" y2="19.5" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="26" y1="32.5" x2="26" y2="44" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="8" y1="26" x2="19.5" y2="26" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="32.5" y1="26" x2="44" y2="26" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <h2 className="text-sm font-bold tracking-tight">Tether Admin</h2>
            <p className="text-[10px] text-sidebar-accent-foreground/60">Intelligence Dashboard</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
          return (
            <Link key={item.path} href={item.path}>
              <span className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}>
                <NavIcon d={item.icon} />
                {!collapsed && item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button onClick={onToggle} className="flex items-center justify-center w-full p-2 rounded-lg text-sidebar-foreground/50 hover:bg-sidebar-accent/50 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {collapsed ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
          </svg>
        </button>
      </div>
    </aside>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Overview} />
      <Route path="/conversations" component={ConversationIntelligence} />
      <Route path="/safety" component={SafetyCenter} />
      <Route path="/demographics" component={Demographics} />
      <Route path="/engagement" component={Engagement} />
      <Route path="/content" component={ContentResearch} />
      <Route path="/website" component={WebsiteAnalytics} />
      <Route path="/behavioral" component={BehavioralIntelligence} />
      <Route path="/network" component={NetworkAnalysis} />
      <Route path="/predictions" component={PredictiveAnalytics} />
      <Route path="/ai-research" component={AiResearchAssistant} />
      <Route>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <Link href="/" className="text-primary mt-2 inline-block">Back to Dashboard</Link>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <div className="min-h-screen bg-background">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
          <main className={`transition-all duration-200 ${collapsed ? "ml-16" : "ml-56"}`}>
            <div className="p-6 max-w-[1400px] mx-auto">
              <AppRouter />
            </div>
          </main>
        </div>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
