import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Brain, AlertTriangle, Shield, Search, ArrowRight } from "lucide-react";
import fallacies from "@/data/fallacies.json";
import biases from "@/data/biases.json";
import badFaith from "@/data/bad-faith.json";

const Learn = () => {
  const libraries = [
    {
      title: "Logical Fallacies",
      description: "Errors in reasoning that undermine the logic of an argument. Learn to identify invalid logical structures.",
      icon: Brain,
      link: "/learn/logical-fallacies",
      count: fallacies.length
    },
    {
      title: "Cognitive Biases",
      description: "Systematic patterns of deviation from rationality. Understand how your brain can trick you.",
      icon: AlertTriangle,
      link: "/learn/cognitive-biases",
      count: biases.length
    },
    {
      title: "Bad-Faith Arguments",
      description: "Manipulative tactics used to win arguments dishonestly. Recognize and counter disingenuous debate.",
      icon: Shield,
      link: "/learn/bad-faith-arguments",
      count: badFaith.length
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-12 opacity-0 animate-fade-up">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
              Knowledge Library
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
              Explore logical fallacies, cognitive biases, and bad-faith arguments.
            </p>
          </div>

          {/* Search Bar Link */}
          <Link
            to="/learn/search"
            className="block max-w-xl mb-8 sm:mb-12 group opacity-0 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:bg-primary/[0.02] transition-all duration-300">
              <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-muted-foreground group-hover:text-foreground transition-colors text-sm">
                Search for ad hominem, confirmation bias, gaslighting...
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
            </div>
          </Link>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {libraries.map((library, index) => (
              <Link
                key={library.title}
                to={library.link}
                className="group flex flex-col rounded-xl border border-border bg-card p-5 sm:p-6 hover:border-primary/50 hover:bg-primary/[0.03] hover:-translate-y-0.5 transition-all duration-300 opacity-0 animate-fade-up"
                style={{ animationDelay: `${150 + index * 100}ms` }}
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-primary/15 transition-all duration-300">
                  <library.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {library.title}
                  </h3>
                  <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                    {library.count}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {library.description}
                </p>
                
                <div className="mt-5 inline-flex items-center text-sm font-medium text-primary">
                  Explore
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;
