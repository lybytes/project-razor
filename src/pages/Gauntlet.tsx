import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import { getGauntletQuestions, modules, getNextLessonId, type WarzonePost } from "@/data/courseData";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronRight, Trophy, Shield } from "lucide-react";

const Gauntlet = () => {
  const { moduleId: moduleIdParam } = useParams<{ moduleId: string }>();
  const moduleId = moduleIdParam || "1";
  const moduleNum = parseInt(moduleId, 10) || 1;
  const navigate = useNavigate();
  const { progress, completeGauntlet } = useCourseProgress();
  const questions = getGauntletQuestions(moduleNum);

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [missedConcepts, setMissedConcepts] = useState<string[]>([]);

  const moduleData = modules.find(m => m.id === moduleNum);
  const moduleLessonsComplete = moduleData?.lessons.every(l => progress.lessonComplete[l.id]) ?? false;
  const nextLessonId = moduleData ? getNextLessonId(moduleData.lessons[moduleData.lessons.length - 1]?.id) : null;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Gauntlet Unavailable</h1>
          <p className="text-muted-foreground mb-6">There is no gauntlet for this module yet.</p>
          <Button asChild><Link to="/train">Back to Course</Link></Button>
        </main>
      </div>
    );
  }

  if (!moduleLessonsComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Gauntlet Locked</h1>
          <p className="text-muted-foreground mb-6">
            Complete all {moduleData?.lessons.length ?? 0} lessons in Module {moduleNum} to unlock this Gauntlet.
          </p>
          <Button asChild><Link to="/train">Back to Course</Link></Button>
        </main>
      </div>
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {!started && !finished && (
          <div className="text-center py-16 animate-fade-up">
            <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-3">Module {moduleNum} Gauntlet</h1>
            <p className="text-lg text-muted-foreground mb-2">{questions.length} questions. All Module {moduleNum} concepts. Your hardest challenge yet.</p>
            <p className="text-sm text-amber-400/80 mb-8">These examples are more ambiguous than the lessons. Think carefully.</p>
            <Button size="lg" onClick={() => setStarted(true)}>
              Begin Gauntlet <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {started && !finished && (
          <div className="animate-fade-up">
            <p className="text-sm text-muted-foreground mb-6">Question {currentIndex + 1} of {questions.length}</p>

            <div className="rounded-lg bg-[hsl(240,6%,12%)] border border-border/50 p-5 mb-4">
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
                  if (i === post.correctIndex) classes += "border-green-500 bg-green-500/10 text-green-400";
                  else if (i === selectedOption && i !== post.correctIndex) classes += "border-red-500 bg-red-500/10 text-red-400";
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
                <div className={`rounded-lg p-4 ${selectedOption === post.correctIndex ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedOption === post.correctIndex ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                    <span className={`font-semibold text-sm ${selectedOption === post.correctIndex ? "text-green-400" : "text-red-400"}`}>
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
          </div>
        )}

        {finished && (
          <div className="text-center py-12 animate-fade-up">
            {passed ? (
              <>
                <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-2">Module {moduleNum} Complete!</h2>
                <p className="text-lg text-foreground mb-2">{correctCount}/10 correct</p>
                <p className="text-primary font-medium mb-6">+500 XP earned</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{correctCount}/10</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Keep going!</h2>
                <p className="text-muted-foreground mb-4">You need 6/10 to pass. Try again whenever you're ready.</p>
                {missedConcepts.length > 0 && (
                  <div className="bg-card border border-border rounded-lg p-4 mb-6 max-w-md mx-auto text-left">
                    <p className="text-sm text-muted-foreground mb-2">Concepts to review:</p>
                    <ul className="space-y-1">
                      {missedConcepts.map(c => (
                        <li key={c} className="text-sm text-foreground flex items-center gap-2">
                          <X className="w-3 h-3 text-red-400" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            <div className="flex gap-3 justify-center flex-wrap">
              {passed && nextLessonId && (
                <Button onClick={() => navigate(`/train/lesson/${nextLessonId}`)}>
                  Next Lesson <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
              <Button variant="outline" onClick={handleRestart}>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate("/train")}>
                Back to Course
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Gauntlet;
