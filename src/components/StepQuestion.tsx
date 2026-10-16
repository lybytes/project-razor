import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepQuestionProps {
  prompt: string;
  options: string[];
  correctIndex: number;
  /** Shown under the Correct / Not quite header once answered. */
  result: ReactNode;
  onAnswered: (correct: boolean) => void;
  /** Bring this step into view when it replaces the previous one (steps 2 and 3). */
  scrollOnMount?: boolean;
}

/* One select-then-submit question with its feedback panel. A card is made of
   one to three of these stacked: name the move, judge it, what to check. */
export const StepQuestion = ({ prompt, options, correctIndex, result, onAnswered, scrollOnMount = false }: StepQuestionProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const promptId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollOnMount || !rootRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rootRef.current.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
  }, [scrollOnMount]);

  const isCorrect = submitted && selected === correctIndex;

  const submit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    onAnswered(selected === correctIndex);
  };

  return (
    <div ref={rootRef} className="scroll-mt-24 animate-fade-up">
      <p id={promptId} className="text-foreground text-base sm:text-lg font-semibold mb-3 sm:mb-4">{prompt}</p>

      <div className="space-y-2 sm:space-y-3 mb-4" role="radiogroup" aria-labelledby={promptId}>
        {options.map((opt, i) => {
          let classes = "w-full min-h-11 text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 text-sm font-medium ";
          if (submitted) {
            if (i === correctIndex) classes += "border-success bg-success/10 text-success";
            else if (i === selected) classes += "border-destructive bg-destructive/10 text-destructive";
            else classes += "border-border/50 bg-card/50 text-muted-foreground";
          } else if (i === selected) {
            classes += "border-primary bg-primary/10 text-primary";
          } else {
            classes += "border-border bg-card text-foreground hover:border-primary/50";
          }
          return (
            <button key={i} onClick={() => !submitted && setSelected(i)} disabled={submitted} className={classes} role="radio" aria-checked={selected === i}>
              {opt}
            </button>
          );
        })}
      </div>

      {submitted ? (
        <div className={`rounded-xl p-4 mb-2 ${isCorrect ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? <Check className="w-4 h-4 text-success" /> : <X className="w-4 h-4 text-destructive" />}
            <span className={`font-semibold text-sm ${isCorrect ? "text-success" : "text-destructive"}`}>
              {isCorrect ? "Correct!" : "Not quite."}
            </span>
          </div>
          <div className="text-foreground text-base leading-relaxed">{result}</div>
        </div>
      ) : (
        <Button onClick={submit} disabled={selected === null} className="w-full">
          Submit Answer
        </Button>
      )}
    </div>
  );
};
