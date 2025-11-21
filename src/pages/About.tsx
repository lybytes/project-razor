import { Navigation } from "@/components/Navigation";
import { Shield, Target, Users, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            About Project Razor
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Project Razor is a comprehensive platform designed to sharpen your critical thinking skills and build resilience against disinformation, logical fallacies, and bad-faith argumentation.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-card border border-border rounded-lg p-6">
                <Target className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-3">Our Mission</h3>
                <p className="text-muted-foreground">
                  To empower individuals with the tools and knowledge needed to identify and counter biases, fallacies, and bad-faith arguments in everyday discourse.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <Shield className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-3">Our Approach</h3>
                <p className="text-muted-foreground">
                  Combining education with interactive training, we help users develop practical skills through real-world scenarios and historical case studies.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-3">What We Teach</h3>
                <p className="text-muted-foreground">
                  Logical fallacies, cognitive biases, and bad-faith argumentation tactics through comprehensive libraries and interactive training modes.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-3">Who It's For</h3>
                <p className="text-muted-foreground">
                  Students, educators, debaters, journalists, and anyone who wants to think more critically and communicate more effectively.
                </p>
              </div>
            </div>

            <section className="bg-card border border-border rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why "Razor"?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The name is inspired by <strong>Occam's Razor</strong> - the principle that simpler explanations are generally better than complex ones. In critical thinking, a "razor" is a tool that cuts through complexity to reveal truth.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Project Razor gives you multiple "razors" - sharp mental tools to cut through faulty logic, identify cognitive traps, and recognize manipulative tactics.
              </p>
            </section>

            <section className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">The BFBA Framework</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">B - Biases</h3>
                  <p className="text-muted-foreground">
                    Systematic patterns of deviation from rationality in judgment. These are unconscious mental shortcuts that can lead us astray.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">F - Fallacies</h3>
                  <p className="text-muted-foreground">
                    Errors in reasoning that undermine the logic of an argument. These are flaws in the structure of arguments themselves.
                  </p>
                </div>
                <div>
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
