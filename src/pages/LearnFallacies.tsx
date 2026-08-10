import { Navigation } from "@/components/Navigation";
import { PageShell } from "@/components/PageShell";
import ConceptLibraryGrid from "@/components/ConceptLibraryGrid";
import fallacies from "@/data/fallacies.json";
import type { Concept } from "@/data/concepts";

const LearnFallacies = () => (
  <PageShell>
    <Navigation />
    <ConceptLibraryGrid
      title="Logical Fallacies"
      subtitle="fallacies • Errors in reasoning that undermine logic"
      concepts={fallacies as Concept[]}
      basePath="/learn/logical-fallacies"
      searchPlaceholder="Search fallacies..."
    />
  </PageShell>
);

export default LearnFallacies;
