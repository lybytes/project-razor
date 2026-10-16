import fallacies from "@/data/fallacies.json";
import badFaith from "@/data/bad-faith.json";

export interface DialogueLine {
  speaker: string;
  line: string;
}

export interface ConceptExample {
  /** Flat form of the example; used for search and wherever `dialogue` is absent. */
  text: string;
  /** Optional structured exchange, rendered one speaker per line. */
  dialogue?: DialogueLine[];
  explanation: string;
}

export interface ConceptRefutation {
  title: string;
  text: string;
  comeback: string;
}

export interface Concept {
  name: string;
  slug: string;
  category: "Logical Fallacy" | "Bad-Faith Tactic";
  aka: string[];
  /** Formal (usually Latin) name, shown as a small "also known as" line under the plain name. */
  formalName?: string;
  hook: string;
  oneLiner: string;
  deepDive: string;
  howToSpot: string[];
  examples: ConceptExample[];
  validUses?: string[];
  refutation: ConceptRefutation[];
  avoidance?: string[];
}

export const allConcepts: Concept[] = [
  ...(fallacies as Concept[]),
  ...(badFaith as Concept[]),
];

const bySlug = new Map(allConcepts.map(c => [c.slug, c]));

export const getConcept = (slug: string): Concept | undefined => bySlug.get(slug);
