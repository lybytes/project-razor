import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import biases from "@/data/biases.json";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const LearnBiases = () => {
  const [search, setSearch] = useState("");

  const filtered = biases.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.explanation.toLowerCase().includes(search.toLowerCase())
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
              Cognitive Biases
            </h1>
            <p className="text-muted-foreground">
              {biases.length} biases • Systematic patterns of deviation from rationality
            </p>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search biases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-4">
            {filtered.map((bias) => (
              <Link
                key={bias.slug}
                to={`/learn/cognitive-biases/${bias.slug}`}
                className="block bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
              >
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {bias.name}
                </h3>
                <p className="text-muted-foreground line-clamp-2">
                  {bias.explanation}
                </p>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              No biases found matching "{search}"
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LearnBiases;
