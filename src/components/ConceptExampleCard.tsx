import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { InlineMarkdown } from "@/components/InlineMarkdown";
import type { ConceptExample } from "@/data/concepts";

interface ConceptExampleCardProps {
  example: ConceptExample;
  index: number;
  /** Hide the explanation behind an "Explanation" toggle (course Learn cards). */
  collapsible?: boolean;
  /** Controlled open state, so a list can keep only one explanation open. */
  open?: boolean;
  onToggle?: () => void;
}

const speakerInitial = (speaker: string) => speaker.trim().split(/\s+/).pop()?.charAt(0).toUpperCase() ?? "?";

const ExampleBody = ({ example }: { example: ConceptExample }) =>
  example.dialogue?.length ? (
    <div className="space-y-2.5">
      {example.dialogue.map((d, i) => {
        // The last speaker is the one making the move, so they get the accent.
        const isMover = i === example.dialogue!.length - 1;
        return (
          <div key={i} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={`mt-0.5 w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold ${
                isMover ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {speakerInitial(d.speaker)}
            </span>
            <p className="text-base text-foreground leading-relaxed">
              <span className="sr-only">{d.speaker}: </span>
              <InlineMarkdown text={d.line} />
            </p>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-base text-foreground leading-relaxed"><InlineMarkdown text={example.text} /></p>
  );

/* One example: the exchange, then its explanation. Shared between the library
   detail pages and the course Learn cards; the parent supplies the frame
   (a divided list), so examples don't nest box inside box. */
export const ConceptExampleCard = ({ example, index, collapsible = false, open, onToggle }: ConceptExampleCardProps) => {
  const [localOpen, setLocalOpen] = useState(!collapsible);
  const isOpen = open ?? localOpen;
  const toggle = onToggle ?? (() => setLocalOpen(o => !o));
  const explanationId = useId();

  return (
    <div className="py-4 sm:py-5 first:pt-0 last:pb-0">
      <div className="flex gap-3">
        <span className="text-sm font-bold text-primary w-5 shrink-0 pt-0.5">{index + 1}</span>
        <div className="flex-1 min-w-0">
          <ExampleBody example={example} />

          {collapsible ? (
            <>
              <button
                type="button"
                onClick={toggle}
                aria-expanded={isOpen}
                aria-controls={explanationId}
                className="mt-2 inline-flex items-center gap-1 min-h-11 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {isOpen ? "Hide explanation" : "Explanation"}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <p id={explanationId} className="rounded-lg bg-muted/40 px-4 py-3 text-base text-foreground/90 leading-relaxed animate-fade-up">
                  <InlineMarkdown text={example.explanation} />
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 rounded-lg bg-muted/40 px-4 py-3 text-base text-foreground/90 leading-relaxed">
              <InlineMarkdown text={example.explanation} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
