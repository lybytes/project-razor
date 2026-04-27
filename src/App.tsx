import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Account from "./pages/Account";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <CourseProgressProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route path="/learn/:type/:slug" element={<ItemDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
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
