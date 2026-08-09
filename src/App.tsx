import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CourseProgressProvider } from "@/contexts/CourseProgressContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Course from "./pages/Course";
import LessonFlow from "./pages/LessonFlow";
import Gauntlet from "./pages/Gauntlet";
import RapidReasoning from "./pages/RapidReasoning";
import SocialWarzone from "./pages/SocialWarzone";
import Learn from "./pages/Learn";
import LearnFallacies from "./pages/LearnFallacies";
import LearnBiases from "./pages/LearnBiases";
import LearnBadFaith from "./pages/LearnBadFaith";
import LearnSearch from "./pages/LearnSearch";
import ItemDetail from "./pages/ItemDetail";
import About from "./pages/About";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Account from "./pages/Account";
import removedSlugRedirects from "./data/removed-slug-redirects.json";

const queryClient = new QueryClient();

const PageTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const base = "Project Razor";
    const pageTitle = (() => {
      if (pathname === "/") return base;
      if (pathname.startsWith("/train/lesson/")) return `Lesson | ${base}`;
      if (pathname.startsWith("/train/gauntlet/")) return `Gauntlet | ${base}`;
      if (pathname === "/train/rapid-reasoning") return `Rapid Reasoning | ${base}`;
      if (pathname === "/train/social-warzone") return `Social Warzone | ${base}`;
      if (pathname.startsWith("/train")) return `Course | ${base}`;
      if (pathname === "/learn") return `Library | ${base}`;
      if (pathname === "/learn/logical-fallacies") return `Logical Fallacies | ${base}`;
      if (pathname === "/learn/cognitive-biases") return `Cognitive Biases | ${base}`;
      if (pathname === "/learn/bad-faith-arguments") return `Bad-Faith Tactics | ${base}`;
      if (pathname === "/learn/search") return `Search | ${base}`;
      if (pathname.startsWith("/learn/")) return `Library | ${base}`;
      if (pathname === "/about") return `About | ${base}`;
      if (pathname === "/auth") return `Sign In | ${base}`;
      if (pathname === "/reset-password") return `Reset Password | ${base}`;
      if (pathname === "/account") return `Account | ${base}`;
      return base;
    })();
    document.title = pageTitle;
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CourseProgressProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageTitle />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/train" element={<Course />} />
              <Route path="/train/lesson/:lessonId" element={<LessonFlow />} />
              <Route path="/train/gauntlet/:moduleId" element={<Gauntlet />} />
              <Route path="/train/rapid-reasoning" element={<RapidReasoning />} />
              <Route path="/train/social-warzone" element={<SocialWarzone />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/logical-fallacies" element={<LearnFallacies />} />
              <Route path="/learn/cognitive-biases" element={<LearnBiases />} />
              <Route path="/learn/bad-faith-arguments" element={<LearnBadFaith />} />
              <Route path="/learn/search" element={<LearnSearch />} />
              {Object.entries(removedSlugRedirects).map(([from, to]) => (
                <Route key={from} path={from} element={<Navigate to={to} replace />} />
              ))}
              <Route path="/learn/:type/:slug" element={<ItemDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CourseProgressProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
