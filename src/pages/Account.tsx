import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Flame, Calendar, Trophy, User, LogOut } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  name: string;
  age: number | null;
  role: string | null;
}

interface Streak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

interface ActivityLog {
  activity_date: string;
  game_type: string;
}

const Account = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    setLoading(true);

    const [profileResult, streakResult, activityResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", userId).single(),
      supabase.from("streaks").select("*").eq("user_id", userId).single(),
      supabase.from("activity_log").select("*").eq("user_id", userId).order("activity_date", { ascending: false }),
    ]);

    if (profileResult.data) {
      setProfile(profileResult.data);
    }

    if (streakResult.data) {
      setStreak(streakResult.data);
    }

    if (activityResult.data) {
      setActivities(activityResult.data);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  // Generate heatmap data for the last 365 days
  const generateHeatmapData = () => {
    const today = new Date();
    const data: { date: string; count: number }[] = [];
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = activities.filter(a => a.activity_date === dateStr).length;
      data.push({ date: dateStr, count });
    }
    
    return data;
  };

  const heatmapData = generateHeatmapData();
  const weeks: { date: string; count: number }[][] = [];
  
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  const getHeatmapColor = (count: number) => {
    if (count === 0) return "bg-muted/30";
    if (count === 1) return "bg-primary/30";
    if (count === 2) return "bg-primary/50";
    return "bg-primary/80";
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if (loading) {
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
                <h1 className="text-3xl font-bold text-foreground">{profile?.name || "User"}</h1>
                <p className="text-muted-foreground">
                  {profile?.role && <span>{profile.role}</span>}
                  {profile?.role && profile?.age && <span> • </span>}
                  {profile?.age && <span>{profile.age} years old</span>}
                </p>
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
                {streak?.current_streak || 0}
                <span className="text-lg font-normal text-muted-foreground ml-2">days</span>
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 opacity-0 animate-fade-up" style={{ animationDelay: "150ms" }}>
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-muted-foreground">Longest Streak</span>
              </div>
              <p className="text-4xl font-bold text-foreground">
                {streak?.longest_streak || 0}
                <span className="text-lg font-normal text-muted-foreground ml-2">days</span>
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-primary" />
                <span className="text-muted-foreground">Total Sessions</span>
              </div>
              <p className="text-4xl font-bold text-foreground">
                {activities.length}
                <span className="text-lg font-normal text-muted-foreground ml-2">games</span>
              </p>
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="bg-card border border-border rounded-lg p-6 opacity-0 animate-fade-up" style={{ animationDelay: "250ms" }}>
            <h2 className="text-xl font-bold text-foreground mb-4">Activity History</h2>
            
            <div className="overflow-x-auto">
              <div className="min-w-max">
                {/* Month labels */}
                <div className="flex gap-1 mb-2 ml-6">
                  {months.map((month, i) => (
                    <div key={month} className="text-xs text-muted-foreground" style={{ width: `${(365/12) * 12}px` }}>
                      {month}
                    </div>
                  ))}
                </div>

                <div className="flex gap-0.5">
                  {/* Day labels */}
                  <div className="flex flex-col gap-0.5 mr-1">
                    <div className="h-3 text-xs text-muted-foreground flex items-center">Mon</div>
                    <div className="h-3"></div>
                    <div className="h-3 text-xs text-muted-foreground flex items-center">Wed</div>
                    <div className="h-3"></div>
                    <div className="h-3 text-xs text-muted-foreground flex items-center">Fri</div>
                    <div className="h-3"></div>
                    <div className="h-3"></div>
                  </div>

                  {/* Heatmap grid */}
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-0.5">
                      {week.map((day, dayIndex) => (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`w-3 h-3 rounded-sm ${getHeatmapColor(day.count)} transition-colors`}
                          title={`${day.date}: ${day.count} session${day.count !== 1 ? "s" : ""}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <span>Less</span>
                  <div className="w-3 h-3 rounded-sm bg-muted/30" />
                  <div className="w-3 h-3 rounded-sm bg-primary/30" />
                  <div className="w-3 h-3 rounded-sm bg-primary/50" />
                  <div className="w-3 h-3 rounded-sm bg-primary/80" />
                  <span>More</span>
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
