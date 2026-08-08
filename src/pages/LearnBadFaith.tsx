import { Navigation } from "@/components/Navigation";
import ConceptLibraryGrid from "@/components/ConceptLibraryGrid";
import badFaith from "@/data/bad-faith.json";
import type { Concept } from "@/data/concepts";

const LearnBadFaith = () => (
  <>
    <Navigation />
    <ConceptLibraryGrid
      title="Bad-Faith Tactics"
      subtitle="tactics • Manipulative strategies used in dishonest debate"
      concepts={badFaith as Concept[]}
      basePath="/learn/bad-faith-arguments"
      searchPlaceholder="Search tactics..."
      emptyMessage="No tactics found matching \"{search}\""
    />
  </>
);

export default LearnBadFaith;
