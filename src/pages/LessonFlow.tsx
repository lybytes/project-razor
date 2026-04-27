import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import { getLessonData, getNextLessonId, type ConceptCard, type DrillQuestion, type WarzonePost } from "@/data/courseData";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronRight, BookOpen, Target, Swords, BarChart3, Trophy } from "lucide-react";

const STAGES = ["Learn", "Drill", "Warzone", "Summary"];
const STAGE_ICONS = [BookOpen, Target, Swords, BarChart3];

const LessonFlow = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { progress, completeLesson, setLessonStage, saveDrillScore, saveWarzoneScore } = useCourseProgress();

  const lesson = getLessonData(lessonId || "");
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

  return <LessonFlowInner lesson={lesson} navigate={navigate} progress={progress} completeLesson={completeLesson} setLessonStage={setLessonStage} saveDrillScore={saveDrillScore} saveWarzoneScore={saveWarzoneScore} />;
};

interface InnerProps {
  lesson: NonNullable<ReturnType<typeof getLessonData>>;
  navigate: ReturnType<typeof useNavigate>;
  progress: ReturnType<typeof useCourseProgress>["progress"];
  completeLesson: ReturnType<typeof useCourseProgress>["completeLesson"];
  setLessonStage: ReturnType<typeof useCourseProgress>["setLessonStage"];
  saveDrillScore: ReturnType<typeof useCourseProgress>["saveDrillScore"];
  saveWarzoneScore: ReturnType<typeof useCourseProgress>["saveWarzoneScore"];
}

const LessonFlowInner = ({ lesson, navigate, progress, completeLesson, setLessonStage: setStageProgress, saveDrillScore, saveWarzoneScore }: InnerProps) => {
  const [stage, setStage] = useState(0);
  const [learnCardIndex, setLearnCardIndex] = useState(0);
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillCorrect, setDrillCorrect] = useState(0);
  const [warzoneIndex, setWarzoneIndex] = useState(0);
  const [warzoneCorrect, setWarzoneCorrect] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Learn stage: 4 cards per concept, then transition
  const totalLearnCards = lesson.conceptCards.length * 4 + 1; // +1 for transition
  const currentConceptIndex = Math.floor(learnCardIndex / 4);
  const currentCardType = learnCardIndex % 4;
  const isTransitionCard = learnCardIndex >= lesson.conceptCards.length * 4;
  const currentConcept = !isTransitionCard ? lesson.conceptCards[currentConceptIndex] : null;

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

    setTimeout(() => {
      if (drillIndex + 1 < lesson.drillQuestions.length) {
        setDrillIndex(drillIndex + 1);
        setSelectedOption(null);
        setSubmitted(false);
      } else {
        const finalCorrect = isCorrect ? drillCorrect + 1 : drillCorrect;
        saveDrillScore(lesson.id, finalCorrect, lesson.drillQuestions.length);
        // show transition
        setDrillIndex(-1); // sentinel for transition screen
        setSelectedOption(null);
        setSubmitted(false);
      }
    }, 1500);
  };

  const handleWarzoneSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    const isCorrect = selectedOption === lesson.warzonePosts[warzoneIndex].correctIndex;
    if (isCorrect) setWarzoneCorrect(prev => prev + 1);
  };

  const handleWarzoneNext = () => {
    const isCorrect = selectedOption === lesson.warzonePosts[warzoneIndex].correctIndex;
    if (warzoneIndex + 1 < lesson.warzonePosts.length) {
      setWarzoneIndex(warzoneIndex + 1);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      const finalCorrect = isCorrect ? warzoneCorrect + 1 : warzoneCorrect;
      saveWarzoneScore(lesson.id, finalCorrect, lesson.warzonePosts.length);
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

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Stage Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STAGES.map((s, i) => {
            const Icon = STAGE_ICONS[i];
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  i === stage ? "bg-primary/20 text-primary" : i < stage ? "bg-green-500/20 text-green-400" : "bg-muted/30 text-muted-foreground"
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < STAGES.length - 1 && <div className={`w-6 h-px ${i < stage ? "bg-green-500/50" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        {/* STAGE 0: LEARN */}
        {stage === 0 && (
          <div className="animate-fade-up">
            {isTransitionCard ? (
              <div className="text-center py-16">
                <p className="text-2xl font-bold text-foreground mb-3">
                  You've learned {lesson.conceptCards.length} new concept{lesson.conceptCards.length > 1 ? "s" : ""}. Time to test yourself.
                </p>
                <Button size="lg" onClick={() => advanceStage(1)} className="mt-6">
                  Start Drill <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ) : currentConcept && (
              <div className="min-h-[400px] flex flex-col">
                {currentCardType === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <p className="text-xl md:text-2xl text-foreground font-medium italic leading-relaxed max-w-lg">
                      "{currentConcept.hook}"
                    </p>
                    <p className="text-muted-foreground mt-8 text-sm">What's wrong with this argument?</p>
                  </div>
                )}

                {currentCardType === 1 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary mb-4">
                      {currentConcept.category}
                    </span>
                    <h2 className="text-4xl font-bold text-foreground mb-4">{currentConcept.name}</h2>
                    <p className="text-lg text-muted-foreground max-w-md">{currentConcept.definition}</p>
                  </div>
                )}

                {currentCardType === 2 && (
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-6">How to spot it</h3>
                    <ul className="space-y-4">
                      {currentConcept.spotIt.map((point, i) => (
                        <li key={i} className="flex gap-3 text-foreground">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentCardType === 3 && (
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-6">How to counter it</h3>
                    <ul className="space-y-4 mb-8">
                      {currentConcept.counterIt.map((point, i) => (
                        <li key={i} className="flex gap-3 text-foreground">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-l-2 border-primary/50 pl-4 py-2">
                      <p className="text-foreground/80 italic">"{currentConcept.counterExample}"</p>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {currentConceptIndex + 1}/{lesson.conceptCards.length} concepts
                  </span>
                  <Button onClick={() => setLearnCardIndex(learnCardIndex + 1)}>
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STAGE 1: DRILL */}
        {stage === 1 && (
          <div className="animate-fade-up">
            {drillIndex === -1 ? (
              <div className="text-center py-16">
                <p className="text-2xl font-bold text-foreground mb-3">Drill complete. Now apply what you've learned in the real world.</p>
                <p className="text-lg text-muted-foreground mb-6">
                  {drillCorrect}/{lesson.drillQuestions.length} correct
                </p>
                <Button size="lg" onClick={() => advanceStage(2)}>
                  Enter the Warzone <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ) : (
              <DrillView
                question={lesson.drillQuestions[drillIndex]}
                index={drillIndex}
                total={lesson.drillQuestions.length}
                selectedOption={selectedOption}
                submitted={submitted}
                onSelect={setSelectedOption}
                onSubmit={handleDrillSubmit}
              />
            )}
          </div>
        )}

        {/* STAGE 2: WARZONE */}
        {stage === 2 && (
          <div className="animate-fade-up">
            {warzoneIndex === -1 ? (
              <div className="text-center py-16">
                <p className="text-2xl font-bold text-foreground mb-3">Warzone complete!</p>
                <p className="text-lg text-muted-foreground mb-2">
                  {warzoneCorrect}/{lesson.warzonePosts.length} correct
                </p>
                <p className="text-muted-foreground mb-6">You've proven you can apply these concepts to real-world scenarios.</p>
                <Button size="lg" onClick={finishLesson}>
                  See Lesson Summary <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {/* STAGE 3: SUMMARY */}
        {stage === 3 && (
          <SummaryView
            lesson={lesson}
            drillScore={progress.drillScores[lesson.id]}
            warzoneScore={progress.warzoneScores[lesson.id]}
            allLessonsComplete={["1-1", "1-2", "1-3"].every(id => progress.lessonComplete[id])}
            navigate={navigate}
          />
        )}
      </main>
    </div>
  );
};

// ===== DRILL COMPONENT =====

const DrillView = ({ question, index, total, selectedOption, submitted, onSelect, onSubmit }: {
  question: DrillQuestion;
  index: number;
  total: number;
  selectedOption: number | null;
  submitted: boolean;
  onSelect: (i: number) => void;
  onSubmit: () => void;
}) => (
  <div>
    <p className="text-sm text-muted-foreground mb-6">Question {index + 1} of {total}</p>

    <div className="rounded-lg bg-[hsl(240,6%,10%)] border border-border p-5 mb-6">
      <p className="text-foreground font-mono text-sm leading-relaxed italic">"{question.scenario}"</p>
    </div>

    <p className="text-foreground font-semibold mb-4">What's happening in this argument?</p>

    <div className="space-y-3 mb-6">
      {question.options.map((opt, i) => {
        let classes = "w-full text-left p-4 rounded-lg border transition-all duration-200 text-sm font-medium ";
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
          <button key={i} onClick={() => !submitted && onSelect(i)} disabled={submitted} className={classes}>
            {opt}
          </button>
        );
      })}
    </div>

    {submitted && (
      <div className="rounded-lg bg-muted/20 border border-border p-4 mb-4 animate-fade-up">
        <p className="text-foreground text-sm">{question.feedback}</p>
      </div>
    )}

    {!submitted && (
      <Button onClick={onSubmit} disabled={selectedOption === null} className="w-full">
        Submit Answer
      </Button>
    )}
  </div>
);

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
}) => (
  <div>
    <p className="text-sm text-muted-foreground mb-6">Post {index + 1} of {total}</p>

    <p className="text-xs text-muted-foreground italic mb-4">Source: {post.source}</p>

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
          <button key={i} onClick={() => !submitted && onSelect(i)} disabled={submitted} className={classes}>
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

// ===== SUMMARY =====

const SummaryView = ({ lesson, drillScore, warzoneScore, allLessonsComplete, navigate }: {
  lesson: NonNullable<ReturnType<typeof getLessonData>>;
  drillScore?: { correct: number; total: number };
  warzoneScore?: { correct: number; total: number };
  allLessonsComplete: boolean;
  navigate: ReturnType<typeof useNavigate>;
}) => {
  const nextLessonId = getNextLessonId(lesson.id);

  return (
    <div className="animate-fade-up text-center py-8">
      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-green-400" />
      </div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Lesson Complete!</h2>

      <div className="bg-card border border-border rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
        <p className="text-sm text-muted-foreground mb-3 font-medium">Concepts learned:</p>
        <ul className="space-y-2">
          {lesson.concepts.map(c => (
            <li key={c} className="flex items-center gap-2 text-foreground">
              <Check className="w-4 h-4 text-green-400" /> {c}
            </li>
          ))}
        </ul>

        <div className="border-t border-border mt-4 pt-4 space-y-2">
          {drillScore && (
            <p className="text-sm text-muted-foreground">Drill: <span className="text-foreground font-medium">{drillScore.correct}/{drillScore.total}</span></p>
          )}
          {warzoneScore && (
            <p className="text-sm text-muted-foreground">Warzone: <span className="text-foreground font-medium">{warzoneScore.correct}/{warzoneScore.total}</span></p>
          )}
          <p className="text-sm text-primary font-medium">+50 XP earned</p>
        </div>
      </div>

      {allLessonsComplete && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-amber-400 font-semibold">🏆 Module 1 Gauntlet Unlocked!</p>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        {nextLessonId && (
          <Button onClick={() => navigate(`/train/lesson/${nextLessonId}`)}>
            Next Lesson <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
        <Button variant="outline" onClick={() => navigate("/train")}>
          Back to Course
        </Button>
      </div>
    </div>
  );
};

export default LessonFlow;
