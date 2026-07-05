import { supabase } from "@/integrations/supabase/client";

// Progress
export interface ProgressEntry {
  lesson_id: string;
  module_id: number;
  score: number | null;
  completed_at: string;
}

interface CompleteResponse {
  current_streak: number;
  longest_streak: number;
  total_xp: number;
  xp_gained: number;
}

const BASE_XP = 50;
const BONUS_XP_THRESHOLD = 80;
const BONUS_XP = 10;

export async function completeLesson(
  lesson_id: string,
  module_id: number,
  score: number
): Promise<CompleteResponse> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("No session");

  // Get current progress to check if first completion
  const { data: existingProgress } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("lesson_id", lesson_id)
    .single();

  const isFirstCompletion = !existingProgress;

  // Upsert progress
  const { error: progressError } = await supabase
    .from("progress")
    .upsert({
      user_id: user.id,
      lesson_id,
      module_id,
      score: score || 0,
      completed_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,lesson_id"
    });

  if (progressError) throw progressError;

  // Calculate XP gain
  const xpGain = isFirstCompletion
    ? BASE_XP + (score >= BONUS_XP_THRESHOLD ? BONUS_XP : 0)
    : 0;

  // Get current user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) throw new Error("Profile not found");

  // Streak logic
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  let newStreak = profile.current_streak;
  let newLongest = profile.longest_streak;

  if (profile.last_activity_date) {
    const lastDate = new Date(profile.last_activity_date);
    lastDate.setUTCHours(0, 0, 0, 0);
    const lastStr = lastDate.toISOString().split("T")[0];

    if (lastStr === todayStr) {
      // Already active today — no streak change
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastStr === yesterdayStr) {
        newStreak = profile.current_streak + 1;
        if (newStreak > newLongest) newLongest = newStreak;
      } else {
        newStreak = 1;
        if (newStreak > newLongest) newLongest = newStreak;
      }
    }
  } else {
    newStreak = 1;
    if (newStreak > newLongest) newLongest = newStreak;
  }

  // Update user stats
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      total_xp: profile.total_xp + xpGain,
      current_streak: newStreak,
      longest_streak: newLongest,
      last_activity_date: todayStr,
    })
    .eq("user_id", user.id);

  if (updateError) throw updateError;

  return {
    current_streak: newStreak,
    longest_streak: newLongest,
    total_xp: profile.total_xp + xpGain,
    xp_gained: xpGain,
  };
}

export async function getProgress(): Promise<ProgressEntry[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: true });

  if (error) throw error;

  return data || [];
}

// User stats
export interface UserStats {
  current_streak: number;
  longest_streak: number;
  total_xp: number;
  lessons_completed: number;
  display_name: string | null;
  email: string;
}

export async function getUserStats(): Promise<UserStats> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError) throw profileError;

  const { count, error: countError } = await supabase
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) throw countError;

  return {
    current_streak: profile.current_streak,
    longest_streak: profile.longest_streak,
    total_xp: profile.total_xp,
    lessons_completed: count || 0,
    display_name: profile.display_name,
    email: profile.email,
  };
}

// Export for backward compatibility (no-op functions)
export function getToken(): string | null {
  return null;
}

export function setToken(_token: string): void {
  // No-op - Supabase handles tokens
}

export function clearToken(): void {
  // No-op - Supabase handles tokens
}
