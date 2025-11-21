import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import badFaith from "@/data/bad-faith.json";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const LearnBadFaith = () => {
  const [search, setSearch] = useState("");

  const filtered = badFaith.filter(bf => 
    bf.name.toLowerCase().includes(search.toLowerCase()) ||
    bf.explanation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Link to="/learn" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Library
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Bad-Faith Arguments
            </h1>
            <p className="text-muted-foreground">
              {badFaith.length} tactics • Manipulative strategies used in dishonest debate
            </p>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tactics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-4">
            {filtered.map((tactic) => (
              <Link
                key={tactic.slug}
                to={`/learn/bad-faith-arguments/${tactic.slug}`}
                className="block bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
              >
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {tactic.name}
                </h3>
                <p className="text-muted-foreground line-clamp-2">
                  {tactic.explanation}
                </p>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              No tactics found matching "{search}"
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LearnBadFaith;
