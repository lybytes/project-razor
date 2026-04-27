import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Flame, Calendar, Trophy, User, LogOut, BookOpen, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { getUserStats, getProgress, type UserStats, type ProgressEntry } from "@/lib/api";

const Account = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [completedLessons, setCompletedLessons] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, progressData] = await Promise.all([
        getUserStats(),
        getProgress(),
      ]);
      setStats(statsData);
      setCompletedLessons(progressData);
    } catch {
      toast.error("Failed to load account data");
    }
    setLoading(false);
  };

  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!user || !stats) return null;

  const module1Lessons = completedLessons.filter((p) => p.module_id === 1).length;
  const module1Progress = (module1Lessons / 3) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-up">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{stats.display_name || "User"}</h1>
                <p className="text-muted-foreground">{stats.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-3 mb-2">
                <Flame className="w-6 h-6 text-orange-500" />
                <span className="text-muted-foreground">Current Streak</span>
              </div>
              <p className="text-4xl font-bold text-foreground">
                {stats.current_streak}
                <span className="text-lg font-normal text-muted-foreground ml-2">days</span>
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 opacity-0 animate-fade-up" style={{ animationDelay: "150ms" }}>
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-muted-foreground">Longest Streak</span>
              </div>
              <p className="text-4xl font-bold text-foreground">
                {stats.longest_streak}
                <span className="text-lg font-normal text-muted-foreground ml-2">days</span>
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-primary" />
                <span className="text-muted-foreground">Lessons Completed</span>
              </div>
              <p className="text-4xl font-bold text-foreground">
                {stats.lessons_completed}
                <span className="text-lg font-normal text-muted-foreground ml-2">lessons</span>
              </p>
            </div>
          </div>

          {/* Course Progress */}
          <div className="bg-card border border-border rounded-lg p-6 opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Course Progress
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Module 1 — The Classics</span>
                  <span className="text-foreground font-medium">{module1Lessons}/3 lessons</span>
                </div>
                <Progress value={module1Progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Total XP</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.total_xp}</p>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-muted-foreground">Lessons</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.lessons_completed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
