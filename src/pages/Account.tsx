import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getUserStats, getProgress, type UserStats, type ProgressEntry } from "@/lib/api";
import { motion } from "motion/react";
import { PageShell } from "@/components/PageShell";
import { Pencil, Check, X } from "lucide-react";

const easeOut = [0.23, 1, 0.32, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: easeOut },
} as const;

const Account = () => {
  const { user, hasSession, loading: authLoading, logout, updateDisplayName } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [completedLessons, setCompletedLessons] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.display_name || "");
  const [savingName, setSavingName] = useState(false);
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

  useEffect(() => {
    if (user?.display_name) {
      setNameInput(user.display_name);
    }
  }, [user?.display_name]);

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

  const handleSaveName = async () => {
    setSavingName(true);
    try {
      await updateDisplayName(nameInput);
      toast.success("Display name updated");
      setEditingName(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update display name";
      toast.error(message);
    } finally {
      setSavingName(false);
    }
  };

  if (authLoading || (hasSession && loading)) {
    return (
      <PageShell>
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </PageShell>
    );
  }

  if (!hasSession) return null;

  if (error || !stats) {
    return (
      <PageShell>
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-xl mx-auto border border-border bg-card rounded-xl p-6 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Account unavailable</h1>
            <p className="text-muted-foreground mb-4">{error || "We couldn't load your account data."}</p>
            <Button onClick={fetchData} className="rounded-full px-6">Try Again</Button>
          </Card>
        </main>
      </PageShell>
    );
  }

  const displayName = user?.display_name || stats.display_name || "User";
  const module1Lessons = completedLessons.filter((p) => p.module_id === 1).length;
  const module1Progress = (module1Lessons / 3) * 100;

  return (
    <PageShell>
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

              {editingName ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <Input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Display name"
                    className="text-lg h-11 max-w-xs rounded-full px-4"
                    disabled={savingName}
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleSaveName} disabled={savingName || !nameInput.trim()} className="rounded-full h-9 px-4">
                      <Check className="w-4 h-4 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setEditingName(false); setNameInput(displayName); }} disabled={savingName} className="rounded-full h-9 px-4">
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tighter leading-[1.05]">
                    {displayName}
                  </h1>
                  <Button variant="ghost" size="sm" onClick={() => setEditingName(true)} className="rounded-full h-9 px-3 text-muted-foreground hover:text-foreground">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              )}

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

          <motion.section className="mb-12" {...reveal}>
            <Card className="p-6 border border-border bg-card rounded-xl">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Active days</h2>
                <p className="text-sm text-muted-foreground">Last 12 months</p>
              </div>
              <ActivityHeatmap completedLessons={completedLessons} lastActivityDate={stats.last_activity_date ?? null} />
            </Card>
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
    </PageShell>
  );
};

function getDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function ActivityHeatmap({ completedLessons, lastActivityDate }: { completedLessons: ProgressEntry[]; lastActivityDate: string | null }) {
  const { weeks, maxCount } = useMemo(() => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const daysToShow = 371;
    const start = new Date(today);
    start.setUTCDate(start.getUTCDate() - (daysToShow - 1));

    const counts = new Map<string, number>();
    for (const lesson of completedLessons) {
      if (!lesson.completed_at) continue;
      const d = new Date(lesson.completed_at);
      d.setUTCHours(0, 0, 0, 0);
      const key = getDateKey(d);
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    if (lastActivityDate) {
      const [year, month, day] = lastActivityDate.split("-").map(Number);
      if (year && month && day) {
        const d = new Date(Date.UTC(year, month - 1, day));
        const key = getDateKey(d);
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }

    const allDays: { date: Date; count: number }[] = [];
    for (let i = 0; i < daysToShow; i++) {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);
      allDays.push({ date: d, count: counts.get(getDateKey(d)) || 0 });
    }

    const cols: { date: Date; count: number }[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      cols.push(allDays.slice(i, i + 7));
    }

    const max = Math.max(1, ...counts.values());
    return { weeks: cols, maxCount: max };
  }, [completedLessons, lastActivityDate]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; colIndex: number }[] = [];
    weeks.forEach((col, i) => {
      const firstDayOfWeek = col[0]?.date;
      if (!firstDayOfWeek) return;
      if (firstDayOfWeek.getUTCDate() <= 7) {
        const label = firstDayOfWeek.toLocaleString("default", { month: "short", timeZone: "UTC" });
        if (!labels.length || labels[labels.length - 1].label !== label) {
          labels.push({ label, colIndex: i });
        }
      }
    });
    return labels;
  }, [weeks]);

  const level = (count: number) => {
    if (count === 0) return "bg-muted/40";
    if (count / maxCount > 0.75) return "bg-primary";
    if (count / maxCount > 0.5) return "bg-primary/70";
    if (count / maxCount > 0.25) return "bg-primary/45";
    return "bg-primary/25";
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px] pl-6 pb-1 select-none">
        <svg width={0} height={0} />
        <div className="relative">
          <div className="absolute left-0 top-4 flex flex-col gap-3.5 text-[10px] text-muted-foreground/60 text-right w-5">
            <span className="h-2.5 leading-none">Mon</span>
            <span className="h-2.5 leading-none">Wed</span>
            <span className="h-2.5 leading-none">Fri</span>
          </div>

          <div className="relative ml-6">
            <div className="flex gap-0.5">
              {weeks.map((col, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-0.5">
                  {monthLabels.find((m) => m.colIndex === colIndex) && (
                    <div className="absolute -top-5 left-0 -translate-x-1/2 text-[10px] text-muted-foreground/60">
                      {monthLabels.find((m) => m.colIndex === colIndex)?.label}
                    </div>
                  )}
                  {col.map((day) => {
                    const key = getDateKey(day.date);
                    const title = `${day.date.toLocaleDateString("default", { month: "short", day: "numeric", timeZone: "UTC" })} — ${day.count} active ${day.count === 1 ? "day" : "days"}`;
                    return (
                      <div
                        key={key}
                        title={title}
                        className={`w-2.5 h-2.5 rounded-sm ${level(day.count)}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5 text-[10px] text-muted-foreground/60">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-muted/40" />
            <div className="w-2.5 h-2.5 rounded-sm bg-primary/25" />
            <div className="w-2.5 h-2.5 rounded-sm bg-primary/45" />
            <div className="w-2.5 h-2.5 rounded-sm bg-primary/70" />
            <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default Account;
