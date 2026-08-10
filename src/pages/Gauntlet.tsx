import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { PageShell } from "@/components/PageShell";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import { getGauntletQuestions, modules, getNextLessonId, type WarzonePost } from "@/data/courseData";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, ChevronRight, Trophy, Shield, RotateCcw, Target } from "lucide-react";

const Gauntlet = () => {
  const { moduleId: moduleIdParam } = useParams<{ moduleId: string }>();
  const moduleId = moduleIdParam || "1";
  const moduleNum = parseInt(moduleId, 10) || 1;
  const navigate = useNavigate();
  const { progress, completeGauntlet, isModuleUnlocked } = useCourseProgress();
  const questions = getGauntletQuestions(moduleNum);

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [missedConcepts, setMissedConcepts] = useState<string[]>([]);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    contentRef.current.scrollIntoView({ block: "start", behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [currentIndex, started, finished]);

  const moduleData = modules.find(m => m.id === moduleNum);
  const moduleLessonsComplete = moduleData?.lessons.every(l => progress.lessonComplete[l.id]) ?? false;
  const nextLessonId = moduleData ? getNextLessonId(moduleData.lessons[moduleData.lessons.length - 1]?.id) : null;

  if (questions.length === 0) {
    return (
      <PageShell>
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Gauntlet Unavailable</h1>
          <p className="text-muted-foreground mb-6">There is no gauntlet for this module yet.</p>
          <Button asChild><Link to="/train">Back to Course</Link></Button>
        </main>
      </PageShell>
    );
  }

  if (!moduleLessonsComplete) {
    return (
      <PageShell>
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Gauntlet Locked</h1>
          <p className="text-muted-foreground mb-6">
            Complete all {moduleData?.lessons.length ?? 0} lessons in Module {moduleNum} to unlock this Gauntlet.
          </p>
          <Button asChild><Link to="/train">Back to Course</Link></Button>
        </main>
      </PageShell>
    );
  }

  const handleRestart = () => {
    setStarted(true);
    setFinished(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setCorrectCount(0);
    setMissedConcepts([]);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    const post = questions[currentIndex];
    setSubmitted(true);
    const isCorrect = selectedOption === post.correctIndex;
    if (isCorrect) setCorrectCount(prev => prev + 1);
    else {
      const correctAnswer = post.options[post.correctIndex];
      setMissedConcepts(prev => [...new Set([...prev, correctAnswer])]);
    }
  };

  const post = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      completeGauntlet(moduleId, correctCount);
      setFinished(true);
    }
  };

  const passed = correctCount >= 6;
  const totalQuestions = questions.length;
  const nextModule = modules.find(m => m.id === moduleNum + 1);
  const nextModuleUnlocked = nextModule ? isModuleUnlocked(nextModule.id) : false;

  return (
    <PageShell>
      <Navigation />

      <main ref={contentRef} className="container mx-auto px-4 py-8 max-w-2xl flex-1 flex flex-col scroll-mt-24">
        {!started && !finished && (
          <div className="text-center py-16 animate-fade-up">
            <Trophy className="w-16 h-16 text-warning mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-3">Module {moduleNum} Gauntlet</h1>
            <p className="text-lg text-muted-foreground mb-2">{questions.length} questions. All Module {moduleNum} concepts. Your hardest challenge yet.</p>
            <p className="text-sm text-warning/80 mb-8">These examples are more ambiguous than the lessons. Think carefully.</p>
            <Button size="lg" onClick={() => setStarted(true)}>
              Begin Gauntlet <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {started && !finished && (
          <div>
            <p className="text-sm text-muted-foreground mb-6">Question {currentIndex + 1} of {questions.length}</p>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="rounded-lg bg-muted border border-border/50 p-5 mb-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">Context</p>
              <p className="text-foreground/90 text-sm leading-relaxed">{post.context}</p>
            </div>

            <div className="rounded-lg bg-card border border-border p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{post.username[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{post.username}</p>
                  <p className="text-xs text-muted-foreground">{post.platform}</p>
                </div>
              </div>
              <p className="text-foreground text-sm leading-relaxed italic">"{post.comment}"</p>
            </div>

            <p className="text-foreground font-semibold mb-4">What BFBA is being used here?</p>

            <div className="space-y-3 mb-6">
              {post.options.map((opt, i) => {
                let classes = "w-full text-left p-4 rounded-lg border transition-all duration-200 text-sm font-medium ";
                if (submitted) {
                  if (i === post.correctIndex) classes += "border-success bg-success/10 text-success";
                  else if (i === selectedOption && i !== post.correctIndex) classes += "border-destructive bg-destructive/10 text-destructive";
                  else classes += "border-border/50 bg-card/50 text-muted-foreground";
                } else if (i === selectedOption) classes += "border-primary bg-primary/10 text-primary";
                else classes += "border-border bg-card text-foreground hover:border-primary/50";
                return (
                  <button key={i} onClick={() => !submitted && setSelectedOption(i)} disabled={submitted} className={classes}>
                    {opt}
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div className="space-y-4 mb-6 animate-fade-up">
                <div className={`rounded-lg p-4 ${selectedOption === post.correctIndex ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedOption === post.correctIndex ? <Check className="w-4 h-4 text-success" /> : <X className="w-4 h-4 text-destructive" />}
                    <span className={`font-semibold text-sm ${selectedOption === post.correctIndex ? "text-success" : "text-destructive"}`}>
                      {selectedOption === post.correctIndex ? "Correct!" : "Incorrect"} — {post.options[post.correctIndex]}
                    </span>
                  </div>
                  <p className="text-foreground text-sm">{post.explanation}</p>
                </div>

                {post.counter && (
                  <div className="border-l-2 border-primary/50 pl-4 py-2">
                    <p className="text-xs text-primary/70 font-medium uppercase tracking-wider mb-1">Counter:</p>
                    <p className="text-foreground/80 italic text-sm">"{post.counter}"</p>
                  </div>
                )}

                <Button onClick={handleNext} className="w-full">
                  {currentIndex + 1 < questions.length ? "Next" : "See Results"} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {!submitted && (
              <Button onClick={handleSubmit} disabled={selectedOption === null} className="w-full">
                Submit Answer
              </Button>
            )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {finished && (
          <motion.div
            className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-12 text-center"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            {passed ? (
              <div className="max-w-xl w-full">
                <motion.div
                  className="relative w-24 h-24 mx-auto mb-8"
                  initial={{ scale: 0.8, rotate: -8, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
                >
                  <div className="absolute inset-0 rounded-full bg-warning/10 blur-xl" />
                  <div className="relative w-24 h-24 rounded-full bg-warning/10 border border-warning/30 flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-warning" />
                  </div>
                </motion.div>

                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                  Module {moduleNum} complete
                </p>
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                  {moduleData?.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                  You passed the gauntlet — {correctCount}/{totalQuestions} correct — and earned <span className="text-foreground font-medium">+500 XP</span>.
                </p>

                {missedConcepts.length > 0 && (
                  <div className="mb-8 max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground mb-3">Still worth reviewing:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {missedConcepts.map(c => (
                        <span key={c} className="text-xs px-3 py-1 rounded-full bg-muted border border-border text-foreground">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {nextModuleUnlocked && nextModule ? (
                    <Button size="lg" onClick={() => navigate(`/train/lesson/${nextModule.lessons[0]?.id}`)} className="rounded-full h-12 px-8">
                      Start {nextModule.title} <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : nextLessonId ? (
                    <Button size="lg" onClick={() => navigate(`/train/lesson/${nextLessonId}`)} className="rounded-full h-12 px-8">
                      Continue Training <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : null}
                  <Button size="lg" variant="outline" onClick={() => navigate("/train")} className="rounded-full h-12 px-8">
                    Back to Course
                  </Button>
                </div>

                <Button variant="ghost" onClick={handleRestart} className="mt-6 text-muted-foreground hover:text-foreground">
                  <RotateCcw className="w-4 h-4 mr-2" /> Replay Gauntlet
                </Button>
              </div>
            ) : (
              <div className="max-w-xl w-full">
                <div className="w-20 h-20 rounded-full bg-muted/50 border border-border flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">Keep going</h2>
                <p className="text-lg text-muted-foreground mb-2">
                  You scored {correctCount}/{totalQuestions}.
                </p>
                <p className="text-muted-foreground mb-8">
                  You need 6/{totalQuestions} to pass. Review the missed concepts and try again.
                </p>

                {missedConcepts.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-5 mb-8 max-w-md mx-auto text-left">
                    <p className="text-sm text-muted-foreground mb-3">Concepts to review:</p>
                    <ul className="space-y-2">
                      {missedConcepts.map(c => (
                        <li key={c} className="text-sm text-foreground flex items-center gap-2">
                          <X className="w-4 h-4 text-destructive" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button size="lg" onClick={handleRestart} className="rounded-full h-12 px-8">
                    Try Again <RotateCcw className="w-4 h-4 ml-2" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/train")} className="rounded-full h-12 px-8">
                    Back to Course
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </PageShell>
  );
};

export default Gauntlet;
