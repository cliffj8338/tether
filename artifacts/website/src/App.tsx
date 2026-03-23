import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import ForSchools from "./pages/ForSchools";
import ForChurches from "./pages/ForChurches";
import FaithMode from "./pages/FaithMode";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Waitlist from "./pages/Waitlist";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/not-found";

import { PageLayout } from "./components/layout/PageLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <PageLayout>
            <Router />
          </PageLayout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
