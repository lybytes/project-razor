import { Navigation } from "@/components/Navigation";
import { Shield, Target, Users, Zap } from "lucide-react";

const About = () => {
  const cards = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To empower individuals with the tools and knowledge needed to identify and counter biases, fallacies, and bad-faith arguments in everyday discourse."
    },
    {
      icon: Shield,
      title: "Our Approach",
      description: "Combining education with interactive training, we help users develop practical skills through real-world scenarios and historical case studies."
    },
    {
      icon: Zap,
      title: "What We Teach",
      description: "Logical fallacies, cognitive biases, and bad-faith argumentation tactics through comprehensive libraries and interactive training modes."
    },
    {
      icon: Users,
      title: "Who It's For",
      description: "Students, educators, debaters, journalists, and anyone who wants to think more critically and communicate more effectively."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-5xl font-bold text-foreground mb-6 opacity-0 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            About Project Razor
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p 
              className="text-xl text-muted-foreground leading-relaxed mb-12 opacity-0 animate-fade-up"
              style={{ animationDelay: "100ms" }}
            >
              Project Razor is a comprehensive platform designed to sharpen your critical thinking skills and build resilience against disinformation, logical fallacies, and bad-faith argumentation.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {cards.map((card, index) => (
                <div 
                  key={card.title}
                  className="bg-card border border-border rounded-lg p-6 opacity-0 animate-fade-up hover:border-primary/50 hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <card.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{card.title}</h3>
                  <p className="text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>

            <section 
              className="bg-card border border-border rounded-lg p-8 mb-8 opacity-0 animate-fade-up"
              style={{ animationDelay: "600ms" }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">Why "Razor"?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The name is inspired by <strong className="text-foreground">Occam's Razor</strong> - the principle that simpler explanations are generally better than complex ones. In critical thinking, a "razor" is a tool that cuts through complexity to reveal truth.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Project Razor gives you multiple "razors" - sharp mental tools to cut through faulty logic, identify cognitive traps, and recognize manipulative tactics.
              </p>
            </section>

            <section 
              className="bg-card border border-border rounded-lg p-8 opacity-0 animate-fade-up"
              style={{ animationDelay: "700ms" }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">The BFBA Framework</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <h3 className="text-xl font-bold text-primary mb-2">B - Biases</h3>
                  <p className="text-muted-foreground">
                    Systematic patterns of deviation from rationality in judgment. These are unconscious mental shortcuts that can lead us astray.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <h3 className="text-xl font-bold text-primary mb-2">F - Fallacies</h3>
                  <p className="text-muted-foreground">
                    Errors in reasoning that undermine the logic of an argument. These are flaws in the structure of arguments themselves.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <h3 className="text-xl font-bold text-primary mb-2">BA - Bad-Faith Arguments</h3>
                  <p className="text-muted-foreground">
                    Manipulative tactics used to win arguments dishonestly. These are deliberate strategies to avoid genuine discussion.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;