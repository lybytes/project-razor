import { Link } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Concept } from "@/data/concepts";

interface ConceptLibraryGridProps {
  title: string;
  subtitle: string;
  concepts: Concept[];
  basePath: string;
  searchPlaceholder: string;
  emptyMessage: string;
}

const ConceptLibraryGrid = ({
  title,
  subtitle,
  concepts,
  basePath,
  searchPlaceholder,
  emptyMessage,
}: ConceptLibraryGridProps) => {
  const [search, setSearch] = useState("");

  const filtered = concepts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.oneLiner.toLowerCase().includes(search.toLowerCase()) ||
    c.aka.some(a => a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <Link to="/learn" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 mb-3 transition-colors">
              ← Back to Library
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">
              {title}
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl">
              {concepts.length} {subtitle}
            </p>
          </div>

          <div className="relative mb-6 sm:mb-8 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-card border-border text-base placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((concept) => (
              <Link
                key={concept.slug}
                to={`${basePath}/${concept.slug}`}
                className="group relative flex flex-col gap-2 p-5 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/[0.03] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {concept.name}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0 mt-1" />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {concept.oneLiner}
                </p>
                {concept.aka.length > 0 && (
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Also known as: {concept.aka.slice(0, 3).join(", ")}
                  </p>
                )}
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 rounded-xl border border-dashed border-border bg-card/50">
              <p className="text-muted-foreground">{emptyMessage.replace("{search}", search)}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConceptLibraryGrid;
