import { Navigation } from "@/components/Navigation";
import { PageShell } from "@/components/PageShell";
import { Link } from "react-router-dom";
import { Search, Brain, AlertTriangle, Shield, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import fallacies from "@/data/fallacies.json";
import biases from "@/data/biases.json";
import badFaith from "@/data/bad-faith.json";

interface SearchResult {
  name: string;
  slug: string;
  summary: string;
  aka: string[];
  category: string;
  type: "fallacy" | "bias" | "bad-faith";
}

const LearnSearch = () => {
  const [search, setSearch] = useState("");

  // Combine all data into searchable results
  const allItems: SearchResult[] = [
    ...fallacies.map(f => ({ ...f, summary: f.oneLiner, type: "fallacy" as const })),
    ...biases.map(b => ({ ...b, summary: b.explanation, aka: [], type: "bias" as const })),
    ...badFaith.map(bf => ({ ...bf, summary: bf.oneLiner, type: "bad-faith" as const })),
  ];

  const query = search.trim().toLowerCase();
  const filtered = query
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.aka.some(a => a.toLowerCase().includes(query))
      )
    : [];

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "fallacy": return Brain;
      case "bias": return AlertTriangle;
      case "bad-faith": return Shield;
    }
  };

  const getLink = (item: SearchResult) => {
    switch (item.type) {
      case "fallacy": return `/learn/logical-fallacies/${item.slug}`;
      case "bias": return `/learn/cognitive-biases/${item.slug}`;
      case "bad-faith": return `/learn/bad-faith-arguments/${item.slug}`;
    }
  };

  const getTypeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "fallacy": return "Logical Fallacy";
      case "bias": return "Cognitive Bias";
      case "bad-faith": return "Bad-Faith Tactic";
    }
  };

  const getTypeColor = (type: SearchResult["type"]) => {
    switch (type) {
      case "fallacy": return "text-purple-400 bg-purple-500/10";
      case "bias": return "text-violet-400 bg-violet-500/10";
      case "bad-faith": return "text-indigo-400 bg-indigo-500/10";
    }
  };

  return (
    <PageShell>
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 sm:mb-8 opacity-0 animate-fade-up">
            <Link to="/learn" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">
              Search Knowledge Base
            </h1>
            <p className="text-base text-muted-foreground">
              Search across {allItems.length} fallacies, biases, and bad-faith arguments
            </p>
          </div>

          <div className="relative mb-6 sm:mb-8 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for ad hominem, confirmation bias, gaslighting..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-card border-border text-base placeholder:text-muted-foreground/60 rounded-xl"
              autoFocus
            />
          </div>

          {search.trim() && (
            <div className="space-y-4 opacity-0 animate-fade-up" style={{ animationDelay: "150ms" }}>
              <p className="text-sm text-muted-foreground">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
              </p>

              {filtered.map((item, index) => {
                const Icon = getIcon(item.type);
                return (
                  <Link
                    key={`${item.type}-${item.slug}`}
                    to={getLink(item)}
                    className="group block bg-card border border-border rounded-xl p-4 sm:p-5 hover:border-primary/50 hover:bg-primary/[0.02] transition-all duration-300 hover:-translate-y-0.5 opacity-0 animate-fade-up"
                    style={{ animationDelay: `${200 + index * 50}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getTypeColor(item.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getTypeColor(item.type)}`}>
                            {getTypeLabel(item.type)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-12 sm:py-16 rounded-xl border border-dashed border-border bg-card/50">
                  <Search className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No results found for &ldquo;{search}&rdquo;</p>
                </div>
              )}
            </div>
          )}

          {!search.trim() && (
            <div className="text-center py-12 sm:py-16 rounded-xl border border-dashed border-border bg-card/50 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <Search className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Start typing to search the knowledge base
              </p>
            </div>
          )}
        </div>
      </main>
    </PageShell>
  );
};

export default LearnSearch;
