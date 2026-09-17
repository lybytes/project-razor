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

async function ensureUserProfile() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Not authenticated");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  if (profile) return { user, profile };

  const { data: createdProfile, error: createError } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      email: user.email || "",
      display_name: typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name : null,
    })
    .select("*")
    .single();

  if (createError) throw createError;

  return { user, profile: createdProfile };
}

export async function completeLesson(
  lesson_id: string,
  module_id: number,
  score: number
): Promise<CompleteResponse> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("No session");

  const { user } = await ensureUserProfile();

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

  const { profile } = await ensureUserProfile();

  // Streak logic
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  let newStreak = profile.current_streak ?? 0;
  let newLongest = profile.longest_streak ?? 0;

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
        newStreak = (profile.current_streak ?? 0) + 1;
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
      total_xp: (profile.total_xp ?? 0) + xpGain,
      current_streak: newStreak,
      longest_streak: newLongest,
      last_activity_date: todayStr,
    })
    .eq("user_id", user.id);

  if (updateError) throw updateError;

  return {
    current_streak: newStreak,
    longest_streak: newLongest,
    total_xp: (profile.total_xp ?? 0) + xpGain,
    xp_gained: xpGain,
  };
}

export interface GuestProgressEntry {
  lesson_id: string;
  module_id: number;
  score: number;
}

export interface MigrationResult {
  migratedCount: number;
}

/* Moves progress earned while signed out into the freshly authenticated
   account in one batched upsert. RLS restricts rows to auth.uid().

   Idempotent by construction: the upsert uses ignoreDuplicates so replaying
   the same entries (reload mid-flow, retry after a dropped connection,
   signing in again later) never touches a lesson_id that's already recorded
   for this user. `.select()` on the upsert returns only the rows Postgres
   actually inserted (ON CONFLICT DO NOTHING rows are never returned), so we
   can tell a genuine first migration from a no-op retry and only award the
   guest XP once — on the attempt that really persists something. */
export async function migrateGuestProgress(entries: GuestProgressEntry[], guestXp: number): Promise<MigrationResult> {
  if (entries.length === 0) return { migratedCount: 0 };

  const { user, profile } = await ensureUserProfile();
  const completedAt = new Date().toISOString();

  const { data: insertedRows, error: progressError } = await supabase
    .from("progress")
    .upsert(
      entries.map(entry => ({
        user_id: user.id,
        lesson_id: entry.lesson_id,
        module_id: entry.module_id,
        score: entry.score,
        completed_at: completedAt,
      })),
      { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
    )
    .select("lesson_id");

  if (progressError) throw progressError;

  const migratedCount = insertedRows?.length ?? 0;

  // Nothing new was actually persisted (every lesson here was already
  // migrated in a previous attempt) — skip the XP award so a retry can't
  // double it.
  if (migratedCount === 0) return { migratedCount: 0 };

  if (guestXp > 0) {
    const { error: xpError } = await supabase
      .from("profiles")
      .update({ total_xp: (profile.total_xp ?? 0) + guestXp })
      .eq("user_id", user.id);

    if (xpError) throw xpError;
  }

  return { migratedCount };
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
  last_activity_date: string | null;
}

export async function getUserStats(): Promise<UserStats> {
  const { user, profile } = await ensureUserProfile();

  const { count, error: countError } = await supabase
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) throw countError;

  return {
    current_streak: profile.current_streak ?? 0,
    longest_streak: profile.longest_streak ?? 0,
    total_xp: profile.total_xp ?? 0,
    lessons_completed: count || 0,
    display_name: profile.display_name,
    email: profile.email || user.email || "",
    last_activity_date: profile.last_activity_date ?? null,
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
