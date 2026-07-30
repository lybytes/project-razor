import fallacies from "@/data/fallacies.json";
import badFaith from "@/data/bad-faith.json";

export interface ConceptExample {
  text: string;
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
  hook: string;
  oneLiner: string;
  deepDive: string;
  howToSpot: string[];
  examples: ConceptExample[];
  refutation: ConceptRefutation[];
  avoidance?: string[];
}

export const allConcepts: Concept[] = [
  ...(fallacies as Concept[]),
  ...(badFaith as Concept[]),
];

const bySlug = new Map(allConcepts.map(c => [c.slug, c]));

export const getConcept = (slug: string): Concept | undefined => bySlug.get(slug);
