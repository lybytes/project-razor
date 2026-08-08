import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getProgress, completeLesson as apiCompleteLesson, migrateGuestProgress, type ProgressEntry } from "@/lib/api";
import { LESSON_ORDER } from "@/data/courseData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CourseProgress {
  lessonComplete: Record<string, boolean>;
  lessonStage: Record<string, number>;
  gauntletComplete: Record<string, boolean>;
  gauntletScore: Record<string, number>;
  xpTotal: number;
  conceptsUnlocked: string[];
  drillScores: Record<string, { correct: number; total: number }>;
  warzoneScores: Record<string, { correct: number; total: number }>;
}

const DEFAULT_PROGRESS: CourseProgress = {
  lessonComplete: {},
  lessonStage: {},
  gauntletComplete: {},
  gauntletScore: {},
  xpTotal: 0,
  conceptsUnlocked: [],
  drillScores: {},
  warzoneScores: {},
};

interface CourseProgressContextType {
  progress: CourseProgress;
  completeLesson: (lessonId: string, concepts: string[]) => void;
  setLessonStage: (lessonId: string, stage: number) => void;
  completeGauntlet: (moduleId: string, score: number) => void;
  saveDrillScore: (lessonId: string, correct: number, total: number) => void;
  saveWarzoneScore: (lessonId: string, correct: number, total: number) => void;
  addXP: (amount: number) => void;
  isConceptUnlocked: (concept: string) => boolean;
  isLessonUnlocked: (lessonId: string, hasSession: boolean) => boolean;
  getFurthestUnlockedLesson: (hasSession: boolean) => string;
  getLessonsComplete: (moduleNum: number) => number;
  resetProgress: () => void;
  loadFromServer: () => Promise<void>;
}

const CourseProgressContext = createContext<CourseProgressContextType | null>(null);

const STORAGE_KEY = "project-razor-course-progress";
const GUEST_MIGRATED_KEY = "project-razor-guest-progress-migrated";

function getModuleIdFromLesson(lessonId: string): number {
  const parts = lessonId.split("-");
  return parseInt(parts[0], 10) || 1;
}

export const CourseProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<CourseProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_PROGRESS, ...JSON.parse(stored) } : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const loadFromServer = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      // Carry anonymous progress into the account before reading it back, so a
      // guest who signs up after the free lesson never replays it.
      if (!localStorage.getItem(GUEST_MIGRATED_KEY)) {
        const guest = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Partial<CourseProgress>;
        const completed = Object.keys(guest.lessonComplete || {}).filter(id => guest.lessonComplete?.[id]);
        if (completed.length > 0) {
          await migrateGuestProgress(
            completed.map(lessonId => {
              const drill = guest.drillScores?.[lessonId];
              const warzone = guest.warzoneScores?.[lessonId];
              const correct = (drill?.correct || 0) + (warzone?.correct || 0);
              const total = (drill?.total || 0) + (warzone?.total || 0);
              return {
                lesson_id: lessonId,
                module_id: getModuleIdFromLesson(lessonId),
                score: total > 0 ? Math.round((correct / total) * 100) : 0,
              };
            }),
            guest.xpTotal || 0,
          );
        }
        localStorage.setItem(GUEST_MIGRATED_KEY, "true");
      }

      const serverProgress = await getProgress();
      const lessonComplete: Record<string, boolean> = {};
      serverProgress.forEach((p: ProgressEntry) => {
        lessonComplete[p.lesson_id] = true;
      });

      setProgress((prev) => ({
        ...prev,
        lessonComplete: { ...prev.lessonComplete, ...lessonComplete },
      }));
    } catch {
      // Silently fail — offline or not logged in
    }
  }, []);

  useEffect(() => {
    loadFromServer();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        loadFromServer();
      } else if (event === "SIGNED_OUT") {
        localStorage.removeItem(GUEST_MIGRATED_KEY);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadFromServer]);

  const completeLesson = useCallback(async (lessonId: string, concepts: string[]) => {
    const isFirstCompletion = !progress.lessonComplete[lessonId];

    setProgress(prev => ({
      ...prev,
      lessonComplete: { ...prev.lessonComplete, [lessonId]: true },
      conceptsUnlocked: [...new Set([...prev.conceptsUnlocked, ...concepts])],
    }));

    const drillScore = progress.drillScores[lessonId];
    const warzoneScore = progress.warzoneScores[lessonId];
    const totalCorrect = (drillScore?.correct || 0) + (warzoneScore?.correct || 0);
    const totalQuestions = (drillScore?.total || 0) + (warzoneScore?.total || 0);
    const score = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const moduleId = getModuleIdFromLesson(lessonId);

      apiCompleteLesson(lessonId, moduleId, score)
        .then((result) => {
          setProgress(prev => ({ ...prev, xpTotal: prev.xpTotal + result.xp_gained }));
          if (result.current_streak > 1) {
            toast.success(`${result.current_streak} day streak!`);
          }
        })
        .catch(() => {
          // Silently fail — progress saved locally
        });
    } else if (isFirstCompletion) {
      const offlineXp = 50 + (score >= 80 ? 10 : 0);
      setProgress(prev => ({ ...prev, xpTotal: prev.xpTotal + offlineXp }));
    }
  }, [progress.lessonComplete, progress.drillScores, progress.warzoneScores]);

  const setLessonStage = useCallback((lessonId: string, stage: number) => {
    setProgress(prev => ({
      ...prev,
      lessonStage: { ...prev.lessonStage, [lessonId]: stage },
    }));
  }, []);

  const completeGauntlet = useCallback((moduleId: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      gauntletComplete: { ...prev.gauntletComplete, [moduleId]: true },
      gauntletScore: { ...prev.gauntletScore, [moduleId]: score },
      xpTotal: prev.xpTotal + 500,
    }));
  }, []);

  const saveDrillScore = useCallback((lessonId: string, correct: number, total: number) => {
    setProgress(prev => ({
      ...prev,
      drillScores: { ...prev.drillScores, [lessonId]: { correct, total } },
    }));
  }, []);

  const saveWarzoneScore = useCallback((lessonId: string, correct: number, total: number) => {
    setProgress(prev => ({
      ...prev,
      warzoneScores: { ...prev.warzoneScores, [lessonId]: { correct, total } },
    }));
  }, []);

  const addXP = useCallback((amount: number) => {
    setProgress(prev => ({ ...prev, xpTotal: prev.xpTotal + amount }));
  }, []);

  const isConceptUnlocked = useCallback((concept: string) => {
    return progress.conceptsUnlocked.includes(concept);
  }, [progress.conceptsUnlocked]);

  // Lessons unlock in order; the free lesson is always the entry point and
  // everything after it also needs an account.
  const isLessonUnlocked = useCallback((lessonId: string, hasSession: boolean) => {
    const index = LESSON_ORDER.indexOf(lessonId);
    if (index === -1) return true;
    if (index === 0) return true;
    if (!hasSession) return false;
    return !!progress.lessonComplete[LESSON_ORDER[index - 1]];
  }, [progress.lessonComplete]);

  const getFurthestUnlockedLesson = useCallback((hasSession: boolean) => {
    let furthest = LESSON_ORDER[0];
    for (const lessonId of LESSON_ORDER) {
      if (isLessonUnlocked(lessonId, hasSession)) furthest = lessonId;
    }
    return furthest;
  }, [isLessonUnlocked]);

  const getLessonsComplete = useCallback((moduleNum: number) => {
    const lessonIds = [`${moduleNum}-1`, `${moduleNum}-2`, `${moduleNum}-3`];
    return lessonIds.filter(id => progress.lessonComplete[id]).length;
  }, [progress.lessonComplete]);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(GUEST_MIGRATED_KEY);
  }, []);

  return (
    <CourseProgressContext.Provider value={{
      progress,
      completeLesson,
      setLessonStage,
      completeGauntlet,
      saveDrillScore,
      saveWarzoneScore,
      addXP,
      isConceptUnlocked,
      isLessonUnlocked,
      getFurthestUnlockedLesson,
      getLessonsComplete,
      resetProgress,
      loadFromServer,
    }}>
      {children}
    </CourseProgressContext.Provider>
  );
};

export const useCourseProgress = () => {
  const ctx = useContext(CourseProgressContext);
  if (!ctx) throw new Error("useCourseProgress must be used within CourseProgressProvider");
  return ctx;
};
