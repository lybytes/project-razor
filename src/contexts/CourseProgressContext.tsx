import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getProgress, completeLesson as apiCompleteLesson, type ProgressEntry } from "@/lib/api";
import { getToken } from "@/lib/api";
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
  getLessonsComplete: (moduleNum: number) => number;
  resetProgress: () => void;
  loadFromServer: () => Promise<void>;
}

const CourseProgressContext = createContext<CourseProgressContextType | null>(null);

const STORAGE_KEY = "project-razor-course-progress";

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
    const token = getToken();
    if (!token) return;

    try {
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
  }, [loadFromServer]);

  const completeLesson = useCallback((lessonId: string, concepts: string[]) => {
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

    const token = getToken();
    if (token) {
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

  const getLessonsComplete = useCallback((moduleNum: number) => {
    const lessonIds = [`${moduleNum}-1`, `${moduleNum}-2`, `${moduleNum}-3`];
    return lessonIds.filter(id => progress.lessonComplete[id]).length;
  }, [progress.lessonComplete]);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
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
