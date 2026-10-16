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

/* Plays a card's steps in order: name the move, then (if the card has a
   verdict) judge it, then (for "check"/"fair" with whatToCheck) say what to
   check. A wrong answer never ends the card early. Remount per card (key). */
export const CardSteps = ({ card, moveResult, after, nextLabel = "Next", onResult, onNext }: CardStepsProps) => {
  const [answered, setAnswered] = useState<Partial<Record<StepKind, boolean>>>({});

  const hasVerdict = !!card.verdict;
  const hasCheck = hasVerdict && card.verdict !== "dodge" && !!card.whatToCheck;
  const lastStep: StepKind = hasCheck ? "check" : hasVerdict ? "verdict" : "move";
  const done = answered[lastStep] !== undefined;

  const answer = (step: StepKind) => (correct: boolean) => {
    setAnswered(prev => ({ ...prev, [step]: correct }));
    onResult(step, correct);
  };

  return (
    <div className="space-y-6">
      <StepQuestion
        prompt="What's the move here?"
        options={card.options}
        correctIndex={card.correctIndex}
        result={moveResult}
        onAnswered={answer("move")}
      />

      {hasVerdict && answered.move !== undefined && (
        <StepQuestion
          prompt="Does it hold up?"
          options={VERDICT_OPTIONS.map(v => v.label)}
          correctIndex={VERDICT_OPTIONS.findIndex(v => v.value === card.verdict)}
          result={card.verdictWhy ? <p><InlineMarkdown text={card.verdictWhy} /></p> : null}
          onAnswered={answer("verdict")}
          scrollOnMount
        />
      )}

      {hasCheck && card.whatToCheck && answered.verdict !== undefined && (
        <StepQuestion
          prompt="So what would you actually check?"
          options={card.whatToCheck.options}
          correctIndex={card.whatToCheck.correctIndex}
          result={<p><InlineMarkdown text={card.whatToCheck.feedback} /></p>}
          onAnswered={answer("check")}
          scrollOnMount
        />
      )}

      {done && (
        <div className="space-y-4 animate-fade-up">
          {after}
          <Button onClick={onNext} className="w-full">
            {nextLabel} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};
