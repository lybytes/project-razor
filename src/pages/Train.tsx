import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Brain, Search, MessageSquare } from "lucide-react";

const Train = () => {
  const modes = [
    {
      title: "Rapid Reasoning",
      description: "Quick-fire scenarios to sharpen your detection skills. Identify the BFBA in under 30 seconds.",
      icon: Brain,
      color: "from-purple-600 to-purple-800",
      link: "/train/rapid-reasoning"
    },
    {
      title: "Crack the Case",
      description: "Deep-dive into real-world historical cases. Analyze complex situations with multiple layers.",
      icon: Search,
      color: "from-violet-600 to-violet-800",
      link: "/train/crack-the-case"
    },
    {
      title: "Social Warzone",
      description: "Navigate the battlefield of social media. Identify BFBAs in tweets, posts, and comment threads.",
      icon: MessageSquare,
      color: "from-indigo-600 to-indigo-800",
      link: "/train/social-warzone"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 opacity-0 animate-fade-up" style={{ animationDelay: "0ms" }}>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Train Your Mind
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your training mode and sharpen your critical thinking skills through interactive challenges.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {modes.map((mode, index) => (
            <Link
              key={mode.title}
              to={mode.link}
              className="group relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary transition-all duration-300 opacity-0 animate-fade-up hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
              style={{ animationDelay: `${150 + index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Animated border glow on hover */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20" />
              </div>
              
              <div className="relative p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <mode.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {mode.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {mode.description}
                </p>
                
                <div className="mt-6 flex items-center text-primary font-semibold">
                  Start Training
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

export default Train;