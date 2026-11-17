import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineMarkdown } from "@/components/InlineMarkdown";
import { StepQuestion } from "@/components/StepQuestion";
import { VERDICT_OPTIONS, type Judgement } from "@/data/courseData";

export type StepKind = "move" | "verdict" | "check";

interface CardStepsProps {
  card: Judgement & { options: string[]; correctIndex: number };
  /** Feedback shown after step 1 (Practice feedback or In the Wild explanation). */
  moveResult: ReactNode;
  /** Shown once every step on the card is answered, above Next (e.g. a counter line). */
  after?: ReactNode;
  nextLabel?: string;
  onResult: (step: StepKind, correct: boolean) => void;
  onNext: () => void;
}

/* Plays a card's steps one at a time in the same spot: name the move, then
   (if the card has a verdict) judge it, then (for "check"/"fair" with
   whatToCheck) say what to check. After each answer the learner taps Continue
   and the next step replaces the last; the scenario above stays put. A wrong
   answer never ends the card early. Remount per card (key). */
export const CardSteps = ({ card, moveResult, after, nextLabel = "Next", onResult, onNext }: CardStepsProps) => {
  const hasVerdict = !!card.verdict;
  const hasCheck = hasVerdict && card.verdict !== "dodge" && !!card.whatToCheck;
  const steps: StepKind[] = ["move", ...(hasVerdict ? ["verdict" as const] : []), ...(hasCheck ? ["check" as const] : [])];

  const [stepIndex, setStepIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const handleAnswered = (correct: boolean) => {
    setAnswered(true);
    onResult(step, correct);
  };

  const goOn = () => {
    setStepIndex(i => i + 1);
    setAnswered(false);
  };

  return (
    <div className="space-y-4">
      {steps.length > 1 && (
        <p className="text-xs font-medium text-muted-foreground">Step {stepIndex + 1} of {steps.length}</p>
      )}

      {step === "move" && (
        <StepQuestion
          key="move"
          prompt="What's the move here?"
          options={card.options}
          correctIndex={card.correctIndex}
          result={moveResult}
          onAnswered={handleAnswered}
        />
      )}

      {step === "verdict" && (
        <StepQuestion
          key="verdict"
          prompt="Does it hold up?"
          options={VERDICT_OPTIONS.map(v => v.label)}
          correctIndex={VERDICT_OPTIONS.findIndex(v => v.value === card.verdict)}
          result={card.verdictWhy ? <p><InlineMarkdown text={card.verdictWhy} /></p> : null}
          onAnswered={handleAnswered}
          scrollOnMount
        />
      )}

      {step === "check" && card.whatToCheck && (
        <StepQuestion
          key="check"
          prompt="So what would you actually check?"
          options={card.whatToCheck.options}
          correctIndex={card.whatToCheck.correctIndex}
          result={<p><InlineMarkdown text={card.whatToCheck.feedback} /></p>}
          onAnswered={handleAnswered}
          scrollOnMount
        />
      )}

      {answered && (
        <div className="space-y-4 animate-fade-up">
          {isLast && after}
          {isLast ? (
            <Button onClick={onNext} className="w-full">
              {nextLabel} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={goOn} className="w-full">
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
