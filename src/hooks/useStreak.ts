import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useStreak = () => {
  const recordActivity = async (gameType: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: "Not authenticated" };
    }

    const today = new Date().toISOString().split("T")[0];

    // Try to insert activity (will fail if already exists for today + game type)
    const { error: activityError } = await supabase
      .from("activity_log")
      .insert({
        user_id: user.id,
        activity_date: today,
        game_type: gameType,
      });

    // Get current streak data
    const { data: streakData, error: streakFetchError } = await supabase
      .from("streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (streakFetchError && streakFetchError.code !== "PGRST116") {
      return { success: false, message: "Error fetching streak" };
    }

    // Calculate new streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = 1;
    let longestStreak = 1;

    if (streakData) {
      const lastActivity = streakData.last_activity_date;
      
      if (lastActivity === today) {
        // Already recorded today, no update needed
        return { success: true, message: "Already recorded today" };
      } else if (lastActivity === yesterdayStr) {
        // Consecutive day - increment streak
        newStreak = streakData.current_streak + 1;
      } else {
        // Streak broken - reset to 1
        newStreak = 1;
      }
      
      longestStreak = Math.max(newStreak, streakData.longest_streak);
    }

    // Update or insert streak
    if (streakData) {
      const { error: updateError } = await supabase
        .from("streaks")
        .update({
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_activity_date: today,
        })
        .eq("user_id", user.id);

      if (updateError) {
        return { success: false, message: "Error updating streak" };
      }
    } else {
      const { error: insertError } = await supabase
        .from("streaks")
        .insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_activity_date: today,
        });

      if (insertError) {
        return { success: false, message: "Error creating streak" };
      }
    }

    if (newStreak > 1 && !activityError) {
      toast.success(`🔥 ${newStreak} day streak!`);
    } else if (newStreak === 1 && streakData?.current_streak && streakData.current_streak > 1) {
      toast.info("Streak reset. Keep training to build it back up!");
    }

    return { success: true, streak: newStreak };
  };

  return { recordActivity };
};
