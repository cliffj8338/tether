import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import Login from "@/pages/Login";
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
import DataCatalog from "@/pages/DataCatalog";
import WaitlistManagement from "@/pages/WaitlistManagement";
import UserManagement from "@/pages/UserManagement";
import RoadmapPage from "@/pages/Roadmap";
import SystemArchitecture from "@/pages/SystemArchitecture";
import VersionConfig from "@/pages/VersionConfig";
import SystemStatus from "@/pages/SystemStatus";
import PlatformCosts from "@/pages/PlatformCosts";
import DemoData from "@/pages/DemoData";
import DemoBanner from "@/components/DemoBanner";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

const NAV_ITEMS = [
  { path: "/", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4", section: "Intelligence" },
  { path: "/conversations", label: "Conversations", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", section: "Intelligence" },
  { path: "/safety", label: "Safety Center", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", section: "Intelligence" },
  { path: "/demographics", label: "Demographics", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", section: "Intelligence" },
  { path: "/engagement", label: "Engagement", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", section: "Intelligence" },
  { path: "/content", label: "Content Research", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", section: "Intelligence" },
  { path: "/website", label: "Website", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9", section: "Intelligence" },
  { path: "/behavioral", label: "Behavioral Intel", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", section: "Intelligence" },
  { path: "/network", label: "Network Analysis", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1", section: "Intelligence" },
  { path: "/predictions", label: "Predictions", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", section: "Intelligence" },
  { path: "/ai-research", label: "AI Research", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5", section: "Intelligence" },
  { path: "/data-catalog", label: "Data Catalog", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4", section: "Intelligence" },
  { path: "/waitlist", label: "Waitlist", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", section: "Operations" },
  { path: "/users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", section: "Operations" },
  { path: "/roadmap", label: "Roadmap", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7", section: "Operations" },
  { path: "/architecture", label: "Architecture", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", section: "Operations" },
  { path: "/version", label: "Version & Config", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", section: "Operations" },
  { path: "/status", label: "System Status", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", section: "Operations" },
  { path: "/costs", label: "Platform Costs", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", section: "Operations" },
  { path: "/demo-data", label: "Demo Data", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4", section: "Operations" },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function ShowcaseBanner() {
  const { isShowcase } = useAuth();
  if (!isShowcase) return null;

  return (
    <div style={{
      background: "linear-gradient(90deg, #6366f1, #4f46e5)",
      color: "white",
      padding: "8px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontSize: 13,
      fontWeight: 600,
      position: "sticky",
      top: 0,
      zIndex: 1001,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>SHOWCASE MODE — View-only access. Data modifications are disabled.</span>
    </div>
  );
}

function UserMenu() {
  const { adminUser, firebaseUser, logout, isShowcase } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors w-full"
      >
        {!isShowcase && firebaseUser?.photoURL ? (
          <img src={firebaseUser.photoURL} alt="" className="w-7 h-7 rounded-full" />
        ) : (
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${isShowcase ? "bg-indigo-500" : "bg-sidebar-primary"}`}>
            {isShowcase ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              (adminUser?.displayName || "A")[0].toUpperCase()
            )}
          </div>
        )}
        <div className="flex-1 text-left min-w-0">
          <div className="text-xs font-medium text-sidebar-foreground truncate">{isShowcase ? "Showcase Viewer" : adminUser?.displayName || "Admin"}</div>
          <div className="text-[10px] text-sidebar-foreground/50 truncate">{isShowcase ? "View-only access" : adminUser?.email}</div>
        </div>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-1 w-full bg-popover border border-border rounded-lg shadow-lg z-50 py-1">
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-accent transition-colors"
            >
              {isShowcase ? "Exit Showcase" : "Sign out"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const SHOWCASE_HIDDEN_PATHS = ["/demo-data", "/users"];

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const [location] = useLocation();
  const { isShowcase } = useAuth();
  const filteredItems = isShowcase ? NAV_ITEMS.filter(item => !SHOWCASE_HIDDEN_PATHS.includes(item.path)) : NAV_ITEMS;

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
        {filteredItems.map((item, idx) => {
          const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
          const prevSection = idx > 0 ? filteredItems[idx - 1].section : null;
          const showSection = item.section !== prevSection;
          return (
            <div key={item.path}>
              {showSection && !collapsed && (
                <div className={`px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 ${idx > 0 ? "mt-2 border-t border-sidebar-border pt-3" : ""}`}>
                  {item.section}
                </div>
              )}
              {showSection && collapsed && idx > 0 && (
                <div className="my-2 border-t border-sidebar-border" />
              )}
              <Link href={item.path}>
                <span className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}>
                  <NavIcon d={item.icon} />
                  {!collapsed && item.label}
                </span>
              </Link>
            </div>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-2 border-t border-sidebar-border">
          <UserMenu />
        </div>
      )}

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
      <Route path="/data-catalog" component={DataCatalog} />
      <Route path="/waitlist" component={WaitlistManagement} />
      <Route path="/users" component={UserManagement} />
      <Route path="/roadmap" component={RoadmapPage} />
      <Route path="/architecture" component={SystemArchitecture} />
      <Route path="/version" component={VersionConfig} />
      <Route path="/status" component={SystemStatus} />
      <Route path="/costs" component={PlatformCosts} />
      <Route path="/demo-data" component={DemoData} />
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

function AuthenticatedApp() {
  const { adminUser, loading, error } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-background">
      <ShowcaseBanner />
      <DemoBanner />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className={`transition-all duration-200 ${collapsed ? "ml-16" : "ml-56"}`}>
        <div className="p-6 max-w-[1400px] mx-auto">
          <AppRouter />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthenticatedApp />
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
