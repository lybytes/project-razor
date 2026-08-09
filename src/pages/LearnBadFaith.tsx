import { Navigation } from "@/components/Navigation";
import { PageShell } from "@/components/PageShell";
import ConceptLibraryGrid from "@/components/ConceptLibraryGrid";
import badFaith from "@/data/bad-faith.json";
import type { Concept } from "@/data/concepts";

const LearnBadFaith = () => (
  <PageShell>
    <Navigation />
    <ConceptLibraryGrid
      title="Bad-Faith Tactics"
      subtitle="tactics • Manipulative strategies used in dishonest debate"
      concepts={badFaith as Concept[]}
      basePath="/learn/bad-faith-arguments"
      searchPlaceholder="Search tactics..."
    />
  </PageShell>
);

export default LearnBadFaith;
