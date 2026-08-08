import type { ConceptExample } from "@/data/concepts";

interface ConceptExampleCardProps {
  example: ConceptExample;
  index: number;
  conceptName: string;
}

/* Shared between the library detail pages and the course Learn cards so a
   concept's examples look identical in both places. */
export const ConceptExampleCard = ({ example, index, conceptName }: ConceptExampleCardProps) => (
  <div className="rounded-xl border border-border bg-card/50 p-4 sm:p-5">
    <div className="border-l-2 border-primary pl-4">
      <div className="flex gap-3">
        <span className="text-primary font-bold flex-shrink-0">{index + 1}.</span>
        <p className="text-base text-foreground leading-relaxed">{example.text}</p>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-border/60">
      <p className="text-sm font-bold text-primary mb-1.5">Why it&apos;s {conceptName}:</p>
      <p className="text-base text-foreground leading-relaxed">{example.explanation}</p>
    </div>
  </div>
);
