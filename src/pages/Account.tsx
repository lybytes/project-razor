import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getUserStats, getProgress, type UserStats, type ProgressEntry } from "@/lib/api";
import { motion } from "motion/react";

const easeOut = [0.23, 1, 0.32, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: easeOut },
} as const;

const Account = () => {
  const { user, hasSession, loading: authLoading, logout } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [completedLessons, setCompletedLessons] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !hasSession) {
      setLoading(false);
      navigate("/auth");
    }
  }, [hasSession, authLoading, navigate]);

  useEffect(() => {
    if (hasSession) {
      fetchData();
    }
  }, [hasSession]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const timeout = new Promise<never>((_, reject) => {
        window.setTimeout(() => reject(new Error("Account data request timed out")), 10000);
      });
      const [statsData, progressData] = await Promise.race([
        Promise.all([
          getUserStats(),
          getProgress(),
        ]),
        timeout,
      ]);
      setStats(statsData);
      setCompletedLessons(progressData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load account data";
      setError(message);
      toast.error("Failed to load account data");
    }
    setLoading(false);
  };

  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (authLoading || (hasSession && loading)) {
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

  if (!hasSession) return null;

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-xl mx-auto border border-border bg-card rounded-xl p-6 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Account unavailable</h1>
            <p className="text-muted-foreground mb-4">{error || "We couldn't load your account data."}</p>
            <Button onClick={fetchData} className="rounded-full px-6">Try Again</Button>
          </Card>
        </main>
      </div>
    );
  }

  const displayName = user?.display_name || stats.display_name || "User";
  const module1Lessons = completedLessons.filter((p) => p.module_id === 1).length;
  const module1Progress = (module1Lessons / 3) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.header
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <div>
              <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Account
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tighter leading-[1.05] mb-2">
                {displayName}
              </h1>
              <p className="text-lg text-muted-foreground">{stats.email}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="self-start sm:self-auto rounded-full px-6 h-11"
            >
              Sign Out
            </Button>
          </motion.header>

          {user && !user.email_confirmed && (
            <motion.div
              className="mb-8 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: easeOut, delay: 0.1 }}
            >
              <p className="font-medium mb-1">Please confirm your email</p>
              <p className="text-sm text-amber-200/80">
                Your course progress is not affected, but some account features may be limited until you confirm.
              </p>
            </motion.div>
          )}

          <motion.section className="mb-12" {...reveal}>
            <h2 className="text-2xl font-bold text-foreground mb-6 tracking-tight">Your stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-6 border border-border bg-card rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Current streak</p>
                <p className="text-4xl font-bold text-foreground">
                  {stats.current_streak}
                  <span className="text-lg font-normal text-muted-foreground ml-2">days</span>
                </p>
              </Card>

              <Card className="p-6 border border-border bg-card rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Longest streak</p>
                <p className="text-4xl font-bold text-foreground">
                  {stats.longest_streak}
                  <span className="text-lg font-normal text-muted-foreground ml-2">days</span>
                </p>
              </Card>

              <Card className="p-6 border border-border bg-card rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Lessons completed</p>
                <p className="text-4xl font-bold text-foreground">
                  {stats.lessons_completed}
                  <span className="text-lg font-normal text-muted-foreground ml-2">lessons</span>
                </p>
              </Card>
            </div>
          </motion.section>

          <motion.section {...reveal}>
            <Card className="p-6 border border-border bg-card rounded-xl">
              <h2 className="text-2xl font-bold text-foreground mb-6 tracking-tight">Course progress</h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Module 1 — The Classics</span>
                    <span className="text-foreground font-medium">{module1Lessons}/3 lessons</span>
                  </div>
                  <Progress value={module1Progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-border bg-background/50">
                    <p className="text-sm text-muted-foreground mb-1">Total XP</p>
                    <p className="text-3xl font-bold text-foreground">{stats.total_xp}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-background/50">
                    <p className="text-sm text-muted-foreground mb-1">Lessons</p>
                    <p className="text-3xl font-bold text-foreground">{stats.lessons_completed}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default Account;
