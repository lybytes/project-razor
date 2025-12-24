import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Brain, AlertTriangle, Shield } from "lucide-react";

const Learn = () => {
  const libraries = [
    {
      title: "Logical Fallacies",
      description: "Errors in reasoning that undermine the logic of an argument. Learn to identify invalid logical structures.",
      icon: Brain,
      color: "from-purple-600 to-purple-800",
      link: "/learn/logical-fallacies",
      count: 20
    },
    {
      title: "Cognitive Biases",
      description: "Systematic patterns of deviation from rationality. Understand how your brain can trick you.",
      icon: AlertTriangle,
      color: "from-violet-600 to-violet-800",
      link: "/learn/cognitive-biases",
      count: 20
    },
    {
      title: "Bad-Faith Arguments",
      description: "Manipulative tactics used to win arguments dishonestly. Recognize and counter disingenuous debate.",
      icon: Shield,
      color: "from-indigo-600 to-indigo-800",
      link: "/learn/bad-faith-arguments",
      count: 15
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 opacity-0 animate-fade-up" style={{ animationDelay: "0ms" }}>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Knowledge Library
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore comprehensive guides on logical fallacies, cognitive biases, and bad-faith arguments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {libraries.map((library, index) => (
            <Link
              key={library.title}
              to={library.link}
              className="group relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary transition-all duration-300 opacity-0 animate-fade-up hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
              style={{ animationDelay: `${150 + index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${library.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Animated border glow on hover */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20" />
              </div>
              
              <div className="relative p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <library.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <h3 className="text-2xl font-bold text-foreground">
                    {library.title}
                  </h3>
                  <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                    {library.count}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {library.description}
                </p>
                
                <div className="mt-6 flex items-center text-primary font-semibold">
                  Explore Library
                  <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Learn;