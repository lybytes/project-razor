import { Navigation } from "@/components/Navigation";
import ConceptLibraryGrid from "@/components/ConceptLibraryGrid";
import fallacies from "@/data/fallacies.json";
import type { Concept } from "@/data/concepts";

const LearnFallacies = () => (
  <>
    <Navigation />
    <ConceptLibraryGrid
      title="Logical Fallacies"
      subtitle="fallacies • Errors in reasoning that undermine logic"
      concepts={fallacies as Concept[]}
      basePath="/learn/logical-fallacies"
      searchPlaceholder="Search fallacies..."
      emptyMessage="No fallacies found matching \"{search}\""
    />
  </>
);

export default LearnFallacies;
