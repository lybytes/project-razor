// Streak logic is now handled server-side via POST /progress/complete.
// This hook is kept for backward compatibility but is a no-op.
// Streak updates happen automatically when lessons are completed through
// the CourseProgressContext -> API layer.

export const useStreak = () => {
  const recordActivity = async (_gameType: string) => {
    return { success: true, message: "Streak tracked server-side" };
  };

  return { recordActivity };
};
