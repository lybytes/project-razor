import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Search, Brain, AlertTriangle, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import fallacies from "@/data/fallacies.json";
import biases from "@/data/biases.json";
import badFaith from "@/data/bad-faith.json";

interface SearchResult {
  name: string;
  slug: string;
  explanation: string;
  category: string;
  type: "fallacy" | "bias" | "bad-faith";
}

const LearnSearch = () => {
  const [search, setSearch] = useState("");

  // Combine all data into searchable results
  const allItems: SearchResult[] = [
    ...fallacies.map(f => ({ ...f, type: "fallacy" as const })),
    ...biases.map(b => ({ ...b, type: "bias" as const })),
    ...badFaith.map(bf => ({ ...bf, type: "bad-faith" as const })),
  ];

  const filtered = search.trim() 
    ? allItems.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.explanation.toLowerCase().includes(search.toLowerCase())
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
      case "bad-faith": return "Bad-Faith Argument";
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 opacity-0 animate-fade-up">
            <Link to="/learn" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Library
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Search Knowledge Base
            </h1>
            <p className="text-muted-foreground">
              Search across {allItems.length} fallacies, biases, and bad-faith arguments
            </p>
          </div>

          <div className="relative mb-8 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for ad hominem, confirmation bias, gaslighting..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 text-lg"
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
                    className="block bg-card border border-border rounded-lg p-6 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 opacity-0 animate-fade-up"
                    style={{ animationDelay: `${200 + index * 50}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(item.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-foreground">
                            {item.name}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(item.type)}`}>
                            {getTypeLabel(item.type)}
                          </span>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  No results found for "{search}"
                </div>
              )}
            </div>
          )}

          {!search.trim() && (
            <div className="text-center py-16 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Start typing to search the knowledge base
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LearnSearch;
