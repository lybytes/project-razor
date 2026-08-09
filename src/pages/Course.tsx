import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import { modules } from "@/data/courseData";
import { Progress } from "@/components/ui/progress";
import { Lock, ChevronDown, Check, Trophy, MessageSquare, Zap, Play, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";

const easeOut = [0.23, 1, 0.32, 1] as const;

const Course = () => {
  const { progress, getLessonsComplete, isLessonUnlocked } = useCourseProgress();
  const { hasSession } = useAuth();
  const [expandedModule, setExpandedModule] = useState<number | null>(1);

  const totalConcepts = progress.conceptsUnlocked.length;
  const progressPercent = Math.min((totalConcepts / 25) * 100, 100);

  const getModuleStatus = (mod: typeof modules[0]) => {
    if (mod.locked) return "locked";
    const complete = getLessonsComplete(mod.id);
    if (complete === 0) return "not-started";
    if (complete >= mod.lessons.length && (mod.id !== 1 || progress.gauntletComplete["1"])) return "complete";
    return "in-progress";
  };

  const getLessonStatus = (lessonId: string) => {
    if (progress.lessonComplete[lessonId]) return "complete";
    const stage = progress.lessonStage[lessonId];
    if (stage !== undefined && stage > 0) return "in-progress";
    return "not-started";
  };

  const allModule1LessonsComplete = ["1-1", "1-2", "1-3"].every(id => progress.lessonComplete[id]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
        {/* Header */}
        <motion.div
          className="mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Course</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">Your Course</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-xl">
            Master critical thinking, one lesson at a time.
          </p>
          <div className="p-4 sm:p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Overall progress</span>
              <span className="text-sm font-medium text-muted-foreground">{totalConcepts}/25 concepts</span>
            </div>
            <Progress value={progressPercent} className="h-2.5" />
          </div>
        </motion.div>

        {/* Module Map */}
        <div className="space-y-4 mb-12">
          {modules.map((mod, i) => {
            const status = getModuleStatus(mod);
            const isExpanded = expandedModule === mod.id;
            const lessonsComplete = getLessonsComplete(mod.id);

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOut, delay: i * 0.06 }}
              >
                {mod.locked ? (
                  <div className="rounded-xl border border-border/50 bg-card/50 p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted/40 flex items-center justify-center shrink-0">
                        <Lock className="w-4 h-4 text-muted-foreground/60" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-muted-foreground/70">
                          Module {mod.id} — {mod.title}
                        </h3>
                        <p className="text-sm text-muted-foreground/50 mt-0.5">{mod.description}</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60 bg-muted/40 px-2 py-1 rounded-full shrink-0">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-card hover:border-primary/40 transition-colors duration-300 overflow-hidden">
                    {/* Module Header */}
                    <button
                      onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                      className="w-full p-4 sm:p-5 flex items-center gap-4 text-left"
                    >
                      {status === "complete" ? (
                        <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center shrink-0">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-primary font-bold">{mod.id}</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-foreground">
                          Module {mod.id} — {mod.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{mod.description}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {mod.lessons.length > 0 && (
                          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                            {lessonsComplete}/{mod.lessons.length} lessons
                          </span>
                        )}
                        <motion.span
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2, ease: easeOut }}
                        >
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        </motion.span>
                      </div>
                    </button>

                    {/* Expanded Lesson List */}
                    <AnimatePresence initial={false}>
                      {isExpanded && !mod.locked && (
                        <motion.div
                          key={`module-${mod.id}-content`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: easeOut }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t border-border/50">
                            <div className="mt-4 space-y-3">
                              {mod.lessons.map((lesson, li) => {
                                const lStatus = getLessonStatus(lesson.id);
                                const unlocked = isLessonUnlocked(lesson.id, hasSession);
                                const isComplete = lStatus === "complete";

                                if (!unlocked) {
                                  return (
                                    <motion.div
                                      key={lesson.id}
                                      initial={{ opacity: 0, x: -8 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.3, ease: easeOut, delay: li * 0.04 }}
                                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-background/40 border border-border/40 opacity-60"
                                    >
                                      <div className="w-8 h-8 rounded-full bg-muted/40 flex items-center justify-center shrink-0">
                                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm sm:text-base font-semibold text-foreground">{lesson.title}</p>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                          {lesson.concepts.map(c => (
                                            <span key={c} className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 font-medium">
                                              {c}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <span className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border border-border bg-card text-muted-foreground">
                                        <Lock className="w-3 h-3" /> Locked
                                      </span>
                                    </motion.div>
                                  );
                                }

                                return (
                                  <motion.div
                                    key={lesson.id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, ease: easeOut, delay: li * 0.04 }}
                                  >
                                    <Link
                                      to={`/train/lesson/${lesson.id}`}
                                      className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-background/60 border border-border/60 hover:border-primary/50 hover:bg-background transition-all duration-200"
                                    >
                                      {isComplete ? (
                                        <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                                          <Check className="w-4 h-4 text-green-500" />
                                        </div>
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                          <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">{mod.id}.{li + 1}</span>
                                        </div>
                                      )}
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                          <p className={`text-sm sm:text-base font-semibold ${isComplete ? "text-muted-foreground" : "text-foreground"}`}>
                                            {lesson.title}
                                          </p>
                                          {isComplete && (
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                                              Complete
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                          {lesson.concepts.map(c => (
                                            <span key={c} className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 font-medium">
                                              {c}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <div className={`shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium transition-colors ${isComplete ? "border border-border bg-background text-foreground" : "bg-primary text-primary-foreground"}`}>
                                        {isComplete ? "Review" : lStatus === "in-progress" ? "Continue" : "Start"}
                                        {isComplete ? <ChevronRight className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                                      </div>
                                    </Link>
                                  </motion.div>
                                );
                              })}

                              {/* Gauntlet */}
                              <motion.div
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, ease: easeOut, delay: mod.lessons.length * 0.04 }}
                                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border ${allModule1LessonsComplete ? "bg-amber-500/5 border-amber-500/20" : "bg-background/60 border-border/60"}`}
                              >
                                <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                                  <Trophy className="w-4 h-4 text-amber-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm sm:text-base font-semibold text-foreground">Module 1 Gauntlet</p>
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    {allModule1LessonsComplete ? "10 mixed questions — your hardest challenge" : "Complete all 3 lessons to unlock"}
                                  </p>
                                </div>
                                {allModule1LessonsComplete ? (
                                  <Link
                                    to="/train/gauntlet/1"
                                    className={`shrink-0 inline-flex items-center h-8 px-3 rounded-md text-xs font-medium transition-colors ${progress.gauntletComplete["1"] ? "border border-border bg-background text-foreground" : "bg-amber-500 text-amber-950"}`}
                                  >
                                    {progress.gauntletComplete["1"] ? `Score: ${progress.gauntletScore["1"]}/10` : "Start"}
                                  </Link>
                                ) : (
                                  <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                                )}
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Free Play */}
        <motion.div
          className=""
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-2">Free Play</h2>
          <p className="text-sm text-muted-foreground mb-4">Practice with concepts you've already learned.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/train/social-warzone"
              className={`flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 ${totalConcepts === 0 ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Social Warzone</h3>
                <p className="text-sm text-muted-foreground mt-1">Apply skills to realistic posts</p>
              </div>
            </Link>
            <Link
              to="/train/rapid-reasoning"
              className={`flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 ${totalConcepts === 0 ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Rapid Reasoning</h3>
                <p className="text-sm text-muted-foreground mt-1">Quick-fire identification drills</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Course;
