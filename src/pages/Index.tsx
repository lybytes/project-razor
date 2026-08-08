import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, MessageSquare, Zap, BookOpen, Smartphone, Puzzle, GraduationCap, AlertTriangle, Shield, Quote } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero */}
        <section className="container mx-auto px-4 pt-12 pb-16 sm:pt-24 sm:pb-24 text-center">
          <div
            className="inline-flex items-center gap-2 h-8 px-4 rounded-full border border-border bg-card text-sm text-muted-foreground mb-6 opacity-0 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <Brain className="w-4 h-4 text-primary" />
            <span>Critical Thinking Training</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight tracking-tight opacity-0 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            The internet is full of manipulation.{" "}
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Learn to see through it.
            </span>
          </h1>

          <p
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            Project Razor is a structured training platform that teaches you to spot logical fallacies, flawed arguments, and manipulation tactics through real-world examples and daily practice.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <Button size="lg" asChild className="rounded-full px-8 h-12 text-base">
              <Link to="/train">
                Start the Course <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8 h-12 text-base">
              <Link to="/learn">Explore the Library</Link>
            </Button>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="container mx-auto px-4 py-12 sm:py-20">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center tracking-tight opacity-0 animate-fade-up"
            style={{ animationDelay: "400ms" }}
          >
            Why this matters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: Smartphone,
                stat: "3.2 billion",
                desc: "social media users are exposed daily to misleading arguments, emotionally manipulative content, and outright false reasoning.",
              },
              {
                icon: Puzzle,
                stat: "~50 known",
                desc: "logical fallacies and cognitive biases are reliably exploited by politicians, advertisers, and bad-faith actors — most people can't name five.",
              },
              {
                icon: GraduationCap,
                stat: "0 schools",
                desc: "teach applied critical thinking as a practical, trainable skill. Most people graduate without ever learning how arguments actually work.",
              },
            ].map((card, i) => (
              <Card
                key={i}
                className="p-6 border border-border bg-card rounded-xl opacity-0 animate-fade-up"
                style={{ animationDelay: `${500 + i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{card.stat}</p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{card.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-12 sm:py-20">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-10 sm:mb-14 text-center tracking-tight opacity-0 animate-fade-up"
            style={{ animationDelay: "800ms" }}
          >
            How Project Razor works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: BookOpen,
                num: "01",
                title: "Learn the tactics",
                desc: "Each lesson introduces 2–3 real manipulation techniques — from strawmanning to slippery slopes — with clear explanations and real-world examples.",
              },
              {
                icon: MessageSquare,
                num: "02",
                title: "Train on real content",
                desc: "Practice spotting fallacies in actual social media posts, news comments, and political discourse. Not textbook abstractions — the real thing.",
              },
              {
                icon: Zap,
                num: "03",
                title: "Build a lasting skill",
                desc: "Spaced repetition, daily streaks, and progressive difficulty mean the skill sticks. You'll start seeing manipulation everywhere — and know how to respond.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="relative text-center sm:text-left opacity-0 animate-fade-up"
                style={{ animationDelay: `${900 + i * 100}ms` }}
              >
                <div className="absolute -top-2 left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 text-6xl font-bold text-muted/30 select-none">
                  {step.num}
                </div>
                <div className="relative pt-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="container mx-auto px-4 py-12 sm:py-20">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center tracking-tight opacity-0 animate-fade-up"
            style={{ animationDelay: "1200ms" }}
          >
            What you'll learn to detect
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: AlertTriangle,
                title: "Logical Fallacies",
                desc: "Flawed arguments disguised as sound reasoning. Ad hominem attacks, strawmen, false dilemmas, slippery slopes — the tricks used to win arguments dishonestly.",
                link: "/learn/logical-fallacies",
                linkText: "Explore Fallacies",
              },
              {
                icon: Brain,
                title: "Cognitive Biases",
                desc: "The mental shortcuts your brain takes that make you vulnerable to manipulation. Confirmation bias, availability heuristic, anchoring — and how others exploit them.",
                link: "/learn/cognitive-biases",
                linkText: "Explore Biases",
              },
              {
                icon: Shield,
                title: "Bad-Faith Tactics",
                desc: "Deliberate manipulation techniques used in arguments and debate. Gaslighting, moving the goalposts, whataboutism — used every day in politics and online discourse.",
                link: "/learn/bad-faith-arguments",
                linkText: "Explore Tactics",
              },
            ].map((card, i) => (
              <Card
                key={i}
                className="p-6 border border-border bg-card rounded-xl hover:border-primary/50 hover:bg-primary/[0.02] hover:-translate-y-0.5 transition-all duration-300 opacity-0 animate-fade-up"
                style={{ animationDelay: `${1300 + i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-5 leading-relaxed">{card.desc}</p>
                <Link
                  to={card.link}
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {card.linkText} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Motivational Banner */}
        <section
          className="py-12 sm:py-20 mt-6 sm:mt-10 border-y border-border/50 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 animate-fade-up"
          style={{ animationDelay: "1600ms" }}
        >
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <Quote className="w-8 h-8 text-primary/40 mx-auto mb-4" />
            <p className="text-xl sm:text-2xl md:text-3xl font-medium italic text-foreground leading-snug mb-6">
              The most dangerous arguments aren&apos;t the ones that are obviously wrong. They&apos;re the ones that sound{" "}
              <span className="text-primary not-italic">almost right</span>.
            </p>
            <p className="text-base text-muted-foreground mb-8">
              Project Razor trains you to tell the difference.
            </p>
            <Button size="lg" asChild className="rounded-full px-8 h-12 text-base">
              <Link to="/train">Start Training — It&apos;s Free</Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Project Razor · Built to make the world think more clearly
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
