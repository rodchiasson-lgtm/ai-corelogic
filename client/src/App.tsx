/*
 * AI-CoreLogic App
 * Theme: Deep Intelligence — dark theme by default
 */

import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";

import WhatsAppWidget from "./components/WhatsAppWidget";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import CategoryLanding from "./pages/CategoryLanding";

const IntelligenceDesk = lazy(() => import("./pages/IntelligenceDesk"));

function IntelligenceDeskRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050B18] flex items-center justify-center text-cyan-400 font-mono text-xs tracking-[0.18em]">
          INITIALIZING FINANCIAL STOCK ANALYSIS
        </div>
      }
    >
      <IntelligenceDesk />
    </Suspense>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/intelligence" component={IntelligenceDeskRoute} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/category/:slug" component={CategoryLanding} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "#0D1B2E",
                border: "1px solid rgba(0,212,200,0.2)",
                color: "#F8FAFC",
              },
            }}
          />
          <Router />
      <WhatsAppWidget />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
