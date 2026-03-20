import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import { gauntletQuestions, type WarzonePost } from "@/data/courseData";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronRight, Trophy, Shield } from "lucide-react";

const Gauntlet = () => {
  const navigate = useNavigate();
  const { progress, completeGauntlet } = useCourseProgress();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [missedConcepts, setMissedConcepts] = useState<string[]>([]);

  const allLessonsComplete = ["1-1", "1-2", "1-3"].every(id => progress.lessonComplete[id]);

  if (!allLessonsComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Gauntlet Locked</h1>
          <p className="text-muted-foreground mb-6">Complete all 3 Module 1 lessons to unlock the Gauntlet.</p>
          <Button asChild><Link to="/train">Back to Course</Link></Button>
        </main>
      </div>
    );
  }

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    const isCorrect = selectedOption === gauntletQuestions[currentIndex].correctIndex;
    if (isCorrect) setCorrectCount(prev => prev + 1);
    else {
      const correctAnswer = gauntletQuestions[currentIndex].options[gauntletQuestions[currentIndex].correctIndex];
      setMissedConcepts(prev => [...new Set([...prev, correctAnswer])]);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < gauntletQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      const finalCorrect = selectedOption === gauntletQuestions[currentIndex].correctIndex ? correctCount : correctCount;
      completeGauntlet("1", finalCorrect);
      setFinished(true);
    }
  };

  const post = gauntletQuestions[currentIndex];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {!started && !finished && (
          <div className="text-center py-16 animate-fade-up">
            <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-3">Module 1 Gauntlet</h1>
            <p className="text-lg text-muted-foreground mb-2">10 questions. All Module 1 concepts. Your hardest challenge yet.</p>
            <p className="text-sm text-amber-400/80 mb-8">These examples are more ambiguous than the lessons. Think carefully.</p>
            <Button size="lg" onClick={() => setStarted(true)}>
              Begin Gauntlet <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {started && !finished && (
          <div className="animate-fade-up">
            <p className="text-sm text-muted-foreground mb-6">Question {currentIndex + 1} of {gauntletQuestions.length}</p>

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
                  {currentIndex + 1 < gauntletQuestions.length ? "Next" : "See Results"} <ChevronRight className="w-4 h-4 ml-1" />
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
            {correctCount >= 6 ? (
              <>
                <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-2">Module 1 Complete! 🏆</h2>
                <p className="text-lg text-foreground mb-2">{correctCount}/10 correct</p>
                <p className="text-primary font-medium mb-6">+500 XP earned</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{correctCount}/10</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Keep going!</h2>
                <p className="text-muted-foreground mb-4">Module 2 is unlocked.</p>
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

            <div className="flex gap-3 justify-center">
              <Button variant="outline" disabled className="opacity-50">
                Continue to Module 2 (Coming Soon)
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
