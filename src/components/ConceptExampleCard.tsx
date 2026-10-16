import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { InlineMarkdown } from "@/components/InlineMarkdown";
import type { ConceptExample } from "@/data/concepts";

interface ConceptExampleCardProps {
  example: ConceptExample;
  index: number;
  /** Hide the explanation behind a "Why?" toggle, collapsed by default (course Learn cards). */
  collapsible?: boolean;
}

/* Shared between the library detail pages and the course Learn cards so a
   concept's examples look identical in both places. */
export const ConceptExampleCard = ({ example, index, collapsible = false }: ConceptExampleCardProps) => {
  const [open, setOpen] = useState(!collapsible);
  const explanationId = useId();

  return (
    <div className="rounded-xl border border-border bg-card/50 p-4 sm:p-5">
      <div className="border-l-2 border-primary pl-4">
        <div className="flex gap-3">
          <span className="text-primary font-bold flex-shrink-0">{index + 1}.</span>
          <p className="text-base text-foreground leading-relaxed"><InlineMarkdown text={example.text} /></p>
        </div>
      </div>
      {collapsible ? (
        <div className="mt-3 pt-3 border-t border-border/60">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls={explanationId}
            className="inline-flex items-center gap-1.5 min-h-11 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Why?
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <p id={explanationId} className="text-base text-foreground leading-relaxed pb-1">
              <InlineMarkdown text={example.explanation} />
            </p>
          )}
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-border/60">
          <p className="text-sm font-bold text-primary mb-1.5">Why:</p>
          <p className="text-base text-foreground leading-relaxed"><InlineMarkdown text={example.explanation} /></p>
        </div>
      )}
    </div>
  );
};
