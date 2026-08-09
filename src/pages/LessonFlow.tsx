import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import { getLessonData, getLessonConcepts, getNextLessonId, getModuleIdFromLesson, getGauntletQuestions, modules, type DrillQuestion, type WarzonePost } from "@/data/courseData";
import { Button } from "@/components/ui/button";
import { ConceptExampleCard } from "@/components/ConceptExampleCard";
import { Check, X, ChevronRight, ChevronLeft, BookOpen, Target, Swords, BarChart3, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const easeOut = [0.23, 1, 0.32, 1] as const;

const STAGES = ["Learn", "Drill", "Warzone", "Summary"];
const STAGE_ICONS = [BookOpen, Target, Swords, BarChart3];

const LessonFlow = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { progress, completeLesson, setLessonStage, saveDrillScore, saveWarzoneScore, isLessonUnlocked, getFurthestUnlockedLesson } = useCourseProgress();
  const { hasSession } = useAuth();

  const lesson = getLessonData(lessonId || "");

  if (lesson && !isLessonUnlocked(lesson.id, hasSession)) {
    return <Navigate to={`/train/lesson/${getFurthestUnlockedLesson(hasSession)}`} replace />;
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground text-lg">Lesson not found.</p>
          <Button asChild className="mt-4"><Link to="/train">Back to Course</Link></Button>
        </div>
      </div>
    );
  }

  return <LessonFlowInner lesson={lesson} navigate={navigate} hasSession={hasSession} progress={progress} completeLesson={completeLesson} setLessonStage={setLessonStage} saveDrillScore={saveDrillScore} saveWarzoneScore={saveWarzoneScore} />;
};

interface InnerProps {
  lesson: NonNullable<ReturnType<typeof getLessonData>>;
  navigate: ReturnType<typeof useNavigate>;
  hasSession: boolean;
  progress: ReturnType<typeof useCourseProgress>["progress"];
  completeLesson: ReturnType<typeof useCourseProgress>["completeLesson"];
  setLessonStage: ReturnType<typeof useCourseProgress>["setLessonStage"];
  saveDrillScore: ReturnType<typeof useCourseProgress>["saveDrillScore"];
  saveWarzoneScore: ReturnType<typeof useCourseProgress>["saveWarzoneScore"];
}

const LessonFlowInner = ({ lesson, navigate, hasSession, progress, completeLesson, setLessonStage: setStageProgress, saveDrillScore, saveWarzoneScore }: InnerProps) => {
  const [stage, setStage] = useState(0);
  const [wasAlreadyComplete] = useState(() => !!progress.lessonComplete[lesson.id]);
  const [learnCardIndex, setLearnCardIndex] = useState(0);
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillCorrect, setDrillCorrect] = useState(0);
  const [warzoneIndex, setWarzoneIndex] = useState(0);
  const [warzoneCorrect, setWarzoneCorrect] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [stage, learnCardIndex, drillIndex, warzoneIndex]);

  // Learn stage: 5 cards per concept, then transition
  const CARDS_PER_CONCEPT = 5;
  const concepts = getLessonConcepts(lesson);
  const currentConceptIndex = Math.floor(learnCardIndex / CARDS_PER_CONCEPT);
  const currentCardType = learnCardIndex % CARDS_PER_CONCEPT;
  const isTransitionCard = learnCardIndex >= concepts.length * CARDS_PER_CONCEPT;
  const currentConcept = !isTransitionCard ? concepts[currentConceptIndex] : null;

  const advanceStage = useCallback((newStage: number) => {
    setStage(newStage);
    setStageProgress(lesson.id, newStage);
    setSelectedOption(null);
    setSubmitted(false);
  }, [lesson.id, setStageProgress]);

  const handleDrillSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    const isCorrect = selectedOption === lesson.drillQuestions[drillIndex].correctIndex;
    if (isCorrect) setDrillCorrect(prev => prev + 1);
  };

  const handleDrillNext = () => {
    if (drillIndex + 1 < lesson.drillQuestions.length) {
      setDrillIndex(drillIndex + 1);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      saveDrillScore(lesson.id, drillCorrect, lesson.drillQuestions.length);
      setDrillIndex(-1);
      setSelectedOption(null);
      setSubmitted(false);
    }
  };

  const handleWarzoneSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    const isCorrect = selectedOption === lesson.warzonePosts[warzoneIndex].correctIndex;
    if (isCorrect) setWarzoneCorrect(prev => prev + 1);
  };

  const handleWarzoneNext = () => {
    if (warzoneIndex + 1 < lesson.warzonePosts.length) {
      setWarzoneIndex(warzoneIndex + 1);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      saveWarzoneScore(lesson.id, warzoneCorrect, lesson.warzonePosts.length);
      setWarzoneIndex(-1); // transition
      setSelectedOption(null);
      setSubmitted(false);
    }
  };

  const finishLesson = () => {
    completeLesson(lesson.id, lesson.concepts);
    advanceStage(3);
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6 sm:py-10 max-w-2xl">
        {/* Stage Indicator */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-6 sm:mb-10">
          {STAGES.map((s, i) => {
            const Icon = STAGE_ICONS[i];
            const isActive = i === stage;
            const isCompleted = i < stage;
            return (
              <div key={s} className="flex items-center gap-2">
                <div className="relative flex items-center gap-1.5 h-8 px-3 sm:px-4 rounded-full text-xs font-semibold border border-transparent">
                  {isActive && (
                    <motion.div
                      layoutId="stage-pill"
                      className="absolute inset-0 rounded-full bg-primary/15 border border-primary/20"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? "text-primary" : isCompleted ? "text-green-400" : "text-muted-foreground"}`} />
                  <span className={`hidden sm:inline relative z-10 ${isActive ? "text-primary" : isCompleted ? "text-green-400" : "text-muted-foreground"}`}>
                    {s}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <motion.div
                    className="h-px"
                    initial={false}
                    animate={{
                      width: i < stage ? 24 : 16,
                      backgroundColor: i < stage ? "rgba(74,222,128,0.5)" : "hsl(240 6% 20%)",
                    }}
                    transition={{ duration: 0.3, ease: easeOut }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
        {/* STAGE 0: LEARN */}
        {stage === 0 && (
          <motion.div
            key="learn"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            <AnimatePresence mode="wait">
              {isTransitionCard ? (
                <motion.div
                  key="transition"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                  className="text-center py-10 sm:py-16 rounded-xl border border-border bg-card p-6 sm:p-10"
                >
                  <p className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                    You&apos;ve learned {concepts.length} new concept{concepts.length > 1 ? "s" : ""}. Time to test yourself.
                  </p>
                  <Button size="lg" onClick={() => advanceStage(1)} className="mt-4 sm:mt-6">
                    Start Drill <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              ) : currentConcept && (
                <motion.div
                  key={learnCardIndex}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                  className="min-h-[360px] sm:min-h-[420px] flex flex-col rounded-xl border border-border bg-card p-5 sm:p-8"
                >
                  {currentCardType === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-2 sm:px-4">
                      <p className="text-xl sm:text-2xl md:text-3xl text-foreground font-medium italic leading-relaxed max-w-lg">
                        &ldquo;{currentConcept.hook}&rdquo;
                      </p>
                      <p className="text-muted-foreground mt-8 text-base">What&apos;s wrong with this argument?</p>
                    </div>
                  )}

                  {currentCardType === 1 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-2 sm:px-4">
                      <span className="inline-flex h-7 items-center px-4 rounded-full text-xs font-semibold bg-primary/15 text-primary mb-4 sm:mb-5">
                        {currentConcept.category}
                      </span>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-5 tracking-tight">{currentConcept.name}</h2>
                      <p className="text-base sm:text-lg md:text-xl text-foreground/80 max-w-md leading-relaxed">{currentConcept.oneLiner}</p>
                    </div>
                  )}

                  {currentCardType === 2 && (
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">How to spot it</h3>
                      <p className="text-base text-foreground/80 leading-relaxed mb-6">{currentConcept.deepDive}</p>
                      <ul className="space-y-3 sm:space-y-5">
                        {currentConcept.howToSpot.map((point, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="text-primary mt-0.5 text-lg">•</span>
                            <span className="text-base text-foreground/90 leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentCardType === 3 && (
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Real-world examples</h3>
                      <div className="space-y-4">
                        {currentConcept.examples.map((example, i) => (
                          <ConceptExampleCard key={i} example={example} index={i} conceptName={currentConcept.name} />
                        ))}
                      </div>
                    </div>
                  )}

                  {currentCardType === 4 && (
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">How to Refute</h3>
                      <ul className="space-y-5 sm:space-y-6">
                        {currentConcept.refutation.map((strategy, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="text-green-400 mt-0.5 text-base font-bold">{i + 1}.</span>
                            <div className="flex-1">
                              <p className="text-base text-foreground/90 leading-relaxed">
                                <span className="font-bold text-foreground">{strategy.title}: </span>
                                {strategy.text}
                              </p>
                              <div className="border-l-2 border-primary/50 bg-primary/5 rounded-r px-4 py-2 mt-2">
                                <p className="text-base text-foreground/80 italic leading-relaxed">&ldquo;{strategy.comeback}&rdquo;</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 sm:mt-8 flex justify-between items-center pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3">
                      {learnCardIndex > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => setLearnCardIndex(learnCardIndex - 1)}>
                          <ChevronLeft className="w-4 h-4 mr-1" /> Back
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {currentConceptIndex + 1}/{concepts.length} concepts
                      </span>
                    </div>
                    <Button onClick={() => setLearnCardIndex(learnCardIndex + 1)}>
                      Continue <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* STAGE 1: DRILL */}
        {stage === 1 && (
          <motion.div
            key="drill"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            <AnimatePresence mode="wait">
              {drillIndex === -1 ? (
                <motion.div
                  key="drill-done"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                  className="text-center py-10 sm:py-16 rounded-xl border border-border bg-card p-6 sm:p-10"
                >
                  <p className="text-xl sm:text-2xl font-bold text-foreground mb-3">Drill complete. Now apply what you&apos;ve learned in the real world.</p>
                  <p className="text-lg text-muted-foreground mb-6">
                    {drillCorrect}/{lesson.drillQuestions.length} correct
                  </p>
                  <Button size="lg" onClick={() => advanceStage(2)}>
                    Enter the Warzone <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key={drillIndex}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                >
                  <DrillView
                    question={lesson.drillQuestions[drillIndex]}
                    index={drillIndex}
                    total={lesson.drillQuestions.length}
                    selectedOption={selectedOption}
                    submitted={submitted}
                    onSelect={setSelectedOption}
                    onSubmit={handleDrillSubmit}
                    onNext={handleDrillNext}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* STAGE 2: WARZONE */}
        {stage === 2 && (
          <motion.div
            key="warzone"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            <AnimatePresence mode="wait">
              {warzoneIndex === -1 ? (
                <motion.div
                  key="warzone-done"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                  className="text-center py-10 sm:py-16 rounded-xl border border-border bg-card p-6 sm:p-10"
                >
                  <p className="text-xl sm:text-2xl font-bold text-foreground mb-3">Warzone complete!</p>
                  <p className="text-lg text-muted-foreground mb-2">
                    {warzoneCorrect}/{lesson.warzonePosts.length} correct
                  </p>
                  <p className="text-muted-foreground mb-6">You&apos;ve proven you can apply these concepts to real-world scenarios.</p>
                  <Button size="lg" onClick={finishLesson}>
                    See Lesson Summary <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key={warzoneIndex}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                >
                  <WarzoneView
                    post={lesson.warzonePosts[warzoneIndex]}
                    index={warzoneIndex}
                    total={lesson.warzonePosts.length}
                    selectedOption={selectedOption}
                    submitted={submitted}
                    onSelect={setSelectedOption}
                    onSubmit={handleWarzoneSubmit}
                    onNext={handleWarzoneNext}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* STAGE 3: SUMMARY */}
        {stage === 3 && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            <SummaryView
              lesson={lesson}
              hasSession={hasSession}
              drillScore={progress.drillScores[lesson.id]}
              warzoneScore={progress.warzoneScores[lesson.id]}
              wasAlreadyComplete={wasAlreadyComplete}
              navigate={navigate}
            />
          </motion.div>
        )}
        </AnimatePresence>
      </main>
    </div>
  );
};

// ===== DRILL COMPONENT =====

const DrillView = ({ question, index, total, selectedOption, submitted, onSelect, onSubmit, onNext }: {
  question: DrillQuestion;
  index: number;
  total: number;
  selectedOption: number | null;
  submitted: boolean;
  onSelect: (i: number) => void;
  onSubmit: () => void;
  onNext: () => void;
}) => {
  const scenarioId = `drill-scenario-${index}`;
  const questionId = `drill-question-${index}`;
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
      <p id={questionId} className="text-sm text-muted-foreground mb-6">Question {index + 1} of {total}</p>

      <div
        role="region"
        aria-labelledby={scenarioId}
        className="rounded-xl bg-muted/30 border border-border p-4 sm:p-6 mb-4 sm:mb-6"
      >
        <p id={scenarioId} className="text-foreground font-medium text-sm sm:text-base leading-relaxed italic">&ldquo;{question.scenario}&rdquo;</p>
      </div>

      <p className="text-foreground text-base sm:text-lg font-semibold mb-3 sm:mb-4">What&apos;s happening in this argument?</p>

      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6" role="radiogroup" aria-labelledby={questionId}>
        {question.options.map((opt, i) => {
          let classes = "w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 text-sm font-medium ";
          if (submitted) {
            if (i === question.correctIndex) {
              classes += "border-green-500 bg-green-500/10 text-green-400";
            } else if (i === selectedOption && i !== question.correctIndex) {
              classes += "border-red-500 bg-red-500/10 text-red-400";
            } else {
              classes += "border-border/50 bg-card/50 text-muted-foreground";
            }
          } else if (i === selectedOption) {
            classes += "border-primary bg-primary/10 text-primary";
          } else {
            classes += "border-border bg-card text-foreground hover:border-primary/50";
          }
          return (
            <button key={i} onClick={() => !submitted && onSelect(i)} disabled={submitted} className={classes} role="radio" aria-checked={selectedOption === i}>
              {opt}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className="space-y-4 mb-4 animate-fade-up">
          <div className="rounded-xl bg-muted/20 border border-border p-4">
            <p className="text-foreground text-base leading-relaxed">{question.feedback}</p>
          </div>
          <Button onClick={onNext} className="w-full">
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {!submitted && (
        <Button onClick={onSubmit} disabled={selectedOption === null} className="w-full">
          Submit Answer
        </Button>
      )}
    </div>
  );
};

// ===== WARZONE COMPONENT =====

const WarzoneView = ({ post, index, total, selectedOption, submitted, onSelect, onSubmit, onNext }: {
  post: WarzonePost;
  index: number;
  total: number;
  selectedOption: number | null;
  submitted: boolean;
  onSelect: (i: number) => void;
  onSubmit: () => void;
  onNext: () => void;
}) => {
  const postQuestionId = `warzone-question-${index}`;
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
      <p className="text-sm text-muted-foreground mb-6">Post {index + 1} of {total}</p>

      <p className="text-xs text-muted-foreground italic mb-3 sm:mb-4">Source: {post.source}</p>

      <div className="rounded-xl bg-muted/30 border border-border p-4 sm:p-6 mb-3 sm:mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">Context</p>
        <p className="text-foreground/90 text-sm sm:text-base leading-relaxed">{post.context}</p>
      </div>

      <div className="rounded-xl bg-card border border-border p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{post.username[0]}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{post.username}</p>
            <p className="text-xs text-muted-foreground">{post.platform}</p>
          </div>
        </div>
        <p className="text-foreground text-sm sm:text-base leading-relaxed italic">&ldquo;{post.comment}&rdquo;</p>
      </div>

      <p id={postQuestionId} className="text-foreground text-base sm:text-lg font-semibold mb-3 sm:mb-4">What BFBA is being used here?</p>

      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6" role="radiogroup" aria-labelledby={postQuestionId}>
        {post.options.map((opt, i) => {
          let classes = "w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 text-sm font-medium ";
          if (submitted) {
            if (i === post.correctIndex) {
              classes += "border-green-500 bg-green-500/10 text-green-400";
            } else if (i === selectedOption && i !== post.correctIndex) {
              classes += "border-red-500 bg-red-500/10 text-red-400";
            } else {
              classes += "border-border/50 bg-card/50 text-muted-foreground";
            }
          } else if (i === selectedOption) {
            classes += "border-primary bg-primary/10 text-primary";
          } else {
            classes += "border-border bg-card text-foreground hover:border-primary/50";
          }
          return (
            <button key={i} onClick={() => !submitted && onSelect(i)} disabled={submitted} className={classes} role="radio" aria-checked={selectedOption === i}>
              {opt}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className="space-y-4 mb-6 animate-fade-up">
          <div className={`rounded-xl p-4 ${selectedOption === post.correctIndex ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
            <div className="flex items-center gap-2 mb-2">
              {selectedOption === post.correctIndex ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
              <span className={`font-semibold text-sm ${selectedOption === post.correctIndex ? "text-green-400" : "text-red-400"}`}>
                {selectedOption === post.correctIndex ? "Correct!" : "Incorrect"} — {post.options[post.correctIndex]}
              </span>
            </div>
            <p className="text-foreground text-base leading-relaxed">{post.explanation}</p>
          </div>

          {post.counter && (
            <div className="border-l-2 border-primary/50 bg-primary/5 rounded-r px-4 py-3">
              <p className="text-xs text-primary/70 font-medium uppercase tracking-wider mb-1">Counter:</p>
              <p className="text-foreground/80 italic text-base leading-relaxed">&ldquo;{post.counter}&rdquo;</p>
            </div>
          )}

          <Button onClick={onNext} className="w-full">
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {!submitted && (
        <Button onClick={onSubmit} disabled={selectedOption === null} className="w-full">
          Submit Answer
        </Button>
      )}
    </div>
  );
};

// ===== SUMMARY =====

const SummaryView = ({ lesson, hasSession, drillScore, warzoneScore, wasAlreadyComplete, navigate }: {
  lesson: NonNullable<ReturnType<typeof getLessonData>>;
  hasSession: boolean;
  drillScore?: { correct: number; total: number };
  warzoneScore?: { correct: number; total: number };
  wasAlreadyComplete: boolean;
  navigate: ReturnType<typeof useNavigate>;
}) => {
  const { progress } = useCourseProgress();
  const moduleId = getModuleIdFromLesson(lesson.id);
  const moduleData = modules.find(m => m.id === moduleId);
  const moduleLessonsComplete = moduleData?.lessons.every(l => progress.lessonComplete[l.id]) ?? false;
  const moduleGauntlet = getGauntletQuestions(moduleId);
  const hasGauntlet = moduleGauntlet.length > 0;
  const gauntletComplete = !!progress.gauntletComplete[String(moduleId)];
  const nextLessonId = getNextLessonId(lesson.id);
  const gauntletPending = moduleLessonsComplete && hasGauntlet && !gauntletComplete;
  const goToNextLesson = nextLessonId && hasSession && !gauntletPending;

  const totalCorrect = (drillScore?.correct || 0) + (warzoneScore?.correct || 0);
  const totalQuestions = (drillScore?.total || 0) + (warzoneScore?.total || 0);
  const scorePercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const xpEarned = wasAlreadyComplete ? 0 : 50 + (scorePercent >= 80 ? 10 : 0);

  return (
    <div className="animate-fade-up text-center py-6 sm:py-10 rounded-xl border border-border bg-card p-5 sm:p-8">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <Check className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight">Lesson Complete!</h2>

      <div className="bg-card/60 border border-border/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-left max-w-md mx-auto">
        <p className="text-sm text-muted-foreground mb-3 font-medium">Concepts learned:</p>
        <ul className="space-y-2">
          {lesson.concepts.map(c => (
            <li key={c} className="flex items-center gap-2 text-foreground text-sm">
              <Check className="w-4 h-4 text-green-500" /> {c}
            </li>
          ))}
        </ul>

        <div className="border-t border-border/50 mt-4 pt-4 space-y-2">
          {drillScore && (
            <p className="text-sm text-muted-foreground">Drill: <span className="text-foreground font-medium">{drillScore.correct}/{drillScore.total}</span></p>
          )}
          {warzoneScore && (
            <p className="text-sm text-muted-foreground">Warzone: <span className="text-foreground font-medium">{warzoneScore.correct}/{warzoneScore.total}</span></p>
          )}
          {xpEarned > 0 && (
            <p className="text-sm text-primary font-medium">+{xpEarned} XP earned</p>
          )}
        </div>
      </div>

      {!hasSession && nextLessonId && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 sm:p-6 mb-4 sm:mb-6 max-w-md mx-auto text-left">
          <p className="text-foreground font-semibold mb-1">
            You just spotted {lesson.concepts.length} manipulation technique{lesson.concepts.length > 1 ? "s" : ""} in the wild.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Create a free account to unlock the rest of the course — your progress and XP from this lesson carry over.
          </p>
          <Button className="w-full" onClick={() => navigate("/auth")}>
            Create free account <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {gauntletPending && hasSession && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 max-w-md mx-auto">
          <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-amber-500 font-semibold">Module {moduleId} Gauntlet Unlocked!</p>
          <p className="text-sm text-muted-foreground mt-1">Pass or fail, completing it unlocks the next module.</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {goToNextLesson && (
          <Button onClick={() => navigate(`/train/lesson/${nextLessonId}`)}>
            Next Lesson <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
        {gauntletPending && hasSession && (
          <Button onClick={() => navigate(`/train/gauntlet/${moduleId}`)} className="bg-amber-500 text-amber-950 hover:bg-amber-400">
            Start Module {moduleId} Gauntlet <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
        {!goToNextLesson && !gauntletPending && hasSession && (
          <Button onClick={() => navigate("/train")}>
            Back to Course
          </Button>
        )}
        {!hasSession && (
          <Button variant="outline" onClick={() => navigate("/train")}>
            Back to Course
          </Button>
        )}
      </div>
    </div>
  );
};

export default LessonFlow;
