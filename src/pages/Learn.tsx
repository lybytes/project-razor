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
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Knowledge Library
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore comprehensive guides on logical fallacies, cognitive biases, and bad-faith arguments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {libraries.map((library) => (
            <Link
              key={library.title}
              to={library.link}
              className="group relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${library.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative p-8">
                <library.icon className="w-12 h-12 text-primary mb-4" />
                <div className="flex items-baseline gap-2 mb-3">
                  <h3 className="text-2xl font-bold text-foreground">
                    {library.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    ({library.count})
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {library.description}
                </p>
                
                <div className="mt-6 flex items-center text-primary font-semibold">
                  Explore Library
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
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
