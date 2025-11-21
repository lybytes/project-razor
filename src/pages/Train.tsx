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
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Train Your Mind
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your training mode and sharpen your critical thinking skills through interactive challenges.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {modes.map((mode) => (
            <Link
              key={mode.title}
              to={mode.link}
              className="group relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative p-8">
                <mode.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {mode.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {mode.description}
                </p>
                
                <div className="mt-6 flex items-center text-primary font-semibold">
                  Start Training
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

export default Train;
