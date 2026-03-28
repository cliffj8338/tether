import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useRef, lazy, Suspense } from "react";
import { analytics } from "./lib/analytics";

import Home from "./pages/Home";
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const ForSchools = lazy(() => import("./pages/ForSchools"));
const ForChurches = lazy(() => import("./pages/ForChurches"));
const FaithMode = lazy(() => import("./pages/FaithMode"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Waitlist = lazy(() => import("./pages/Waitlist"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/not-found"));

import { PageLayout } from "./components/layout/PageLayout";
import { WelcomeModal } from "./components/WelcomeModal";

function AnalyticsTracker() {
  const [location] = useLocation();
  const prev = useRef("");
  useEffect(() => {
    if (location !== prev.current) {
      prev.current = location;
      analytics.pageView(location);
    }
  }, [location]);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/for-schools" component={ForSchools} />
        <Route path="/for-churches" component={ForChurches} />
        <Route path="/faith-mode" component={FaithMode} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/about" component={About} />
        <Route path="/waitlist" component={Waitlist} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={TermsOfService} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AnalyticsTracker />
          <PageLayout>
            <Router />
          </PageLayout>
        </WouterRouter>
        <WelcomeModal />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
