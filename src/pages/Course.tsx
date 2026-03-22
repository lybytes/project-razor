import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import { modules } from "@/data/courseData";
import { Progress } from "@/components/ui/progress";
import { Lock, ChevronDown, ChevronUp, Check, Trophy, Brain, MessageSquare, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Course = () => {
  const { progress, getLessonsComplete } = useCourseProgress();
  const [expandedModule, setExpandedModule] = useState<number | null>(1);

  const totalConcepts = progress.conceptsUnlocked.length;
  const progressPercent = (totalConcepts / 25) * 100;

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

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-12 opacity-0 animate-fade-up">
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Course</h1>
          <p className="text-muted-foreground text-lg mb-6">Master critical thinking, one lesson at a time.</p>
          <div className="flex items-center gap-4">
            <Progress value={progressPercent} className="h-3 flex-1" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">{totalConcepts}/25 concepts</span>
          </div>
        </div>

        {/* Module Map */}
        <div className="space-y-4 mb-16">
          {modules.map((mod, i) => {
            const status = getModuleStatus(mod);
            const isExpanded = expandedModule === mod.id;
            const lessonsComplete = getLessonsComplete(mod.id);

            return (
              <div
                key={mod.id}
                className="opacity-0 animate-fade-up"
                style={{ animationDelay: `${100 + i * 80}ms` }}
              >
                {mod.locked ? (
                  <div className="rounded-lg border border-border/30 bg-card/30 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
                    <div className="relative flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted/20 flex items-center justify-center shrink-0 border border-border/30">
                        <Lock className="w-4 h-4 text-muted-foreground/50" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold text-muted-foreground/60">
                            Module {mod.id} — {mod.title}
                          </h3>
                          <span className="text-[10px] uppercase tracking-widest font-medium text-primary/50 bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                            Coming Soon
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground/40 mt-0.5">{mod.description}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                <div className="rounded-lg border transition-all duration-300 border-border bg-card hover:border-primary/40">
                  {/* Module Header */}
                  <button
                    onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                    className="w-full p-6 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {status === "complete" ? (
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                          <span className="text-primary font-bold">{mod.id}</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-foreground">
                          Module {mod.id} — {mod.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{mod.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      {mod.lessons.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {lessonsComplete}/{mod.lessons.length} lessons
                        </span>
                      )}
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                    </div>
                  </button>

                  {/* Expanded Lesson List */}
                  {isExpanded && !mod.locked && (
                    <div className="px-6 pb-6 border-t border-border/50">
                      <div className="mt-4 space-y-3">
                        {mod.lessons.map((lesson, li) => {
                          const lStatus = getLessonStatus(lesson.id);
                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {lStatus === "complete" ? (
                                  <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                    <Check className="w-4 h-4 text-green-400" />
                                  </div>
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-muted/30 flex items-center justify-center shrink-0">
                                    <span className="text-xs text-muted-foreground font-medium">{mod.id}.{li + 1}</span>
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {lesson.concepts.map(c => (
                                      <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80">{c}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant={lStatus === "complete" ? "outline" : "default"}
                                asChild
                                className="shrink-0 ml-3"
                              >
                                <Link to={`/train/lesson/${lesson.id}`}>
                                  {lStatus === "complete" ? "Review" : lStatus === "in-progress" ? "Continue" : "Start"}
                                </Link>
                              </Button>
                            </div>
                          );
                        })}

                        {/* Gauntlet */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-amber-500/20">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                              <Trophy className="w-4 h-4 text-amber-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Module 1 Gauntlet</p>
                              <p className="text-xs text-muted-foreground">
                                {allModule1LessonsComplete ? "10 mixed questions — your hardest challenge" : "Complete all 3 lessons to unlock"}
                              </p>
                            </div>
                          </div>
                          {allModule1LessonsComplete ? (
                            <Button size="sm" variant={progress.gauntletComplete["1"] ? "outline" : "default"} asChild className="shrink-0 ml-3">
                              <Link to="/train/gauntlet/1">
                                {progress.gauntletComplete["1"] ? `Score: ${progress.gauntletScore["1"]}/10` : "Start"}
                              </Link>
                            </Button>
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground shrink-0 ml-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Free Play */}
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: "600ms" }}>
          <h2 className="text-xl font-semibold text-foreground mb-4">Free Play</h2>
          <p className="text-sm text-muted-foreground mb-4">Practice with concepts you've already learned.</p>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/train/social-warzone"
              className={`p-5 rounded-lg border border-border bg-card hover:border-primary/40 transition-all duration-300 ${totalConcepts === 0 ? "opacity-50 pointer-events-none" : ""}`}
            >
              <MessageSquare className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground text-sm">Social Warzone</h3>
              <p className="text-xs text-muted-foreground mt-1">Apply skills to realistic posts</p>
            </Link>
            <Link
              to="/train/rapid-reasoning"
              className={`p-5 rounded-lg border border-border bg-card hover:border-primary/40 transition-all duration-300 ${totalConcepts === 0 ? "opacity-50 pointer-events-none" : ""}`}
            >
              <Zap className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground text-sm">Rapid Reasoning</h3>
              <p className="text-xs text-muted-foreground mt-1">Quick-fire identification drills</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Course;
