import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* SECTION 1 — Hero */}
        <section className="container mx-auto px-4 pt-24 pb-20 text-center">
          <div
            className="inline-block mb-8 px-5 py-1.5 border border-border rounded-full text-sm text-muted-foreground opacity-0 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            🧠 Critical Thinking Training
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight opacity-0 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            The internet is full of manipulation.{" "}
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Learn to see through it.
            </span>
          </h1>

          <p
            className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            Project Razor is a structured training platform that teaches you to spot logical fallacies, flawed arguments, and manipulation tactics — through real-world examples and daily practice. Think of it as Duolingo, but for your mind.
          </p>

          <div
            className="flex gap-4 justify-center flex-wrap opacity-0 animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <Button size="lg" asChild className="rounded-full px-8">
              <Link to="/train">
                Start the Course <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8">
              <Link to="/learn">Explore the Library</Link>
            </Button>
          </div>
        </section>

        {/* SECTION 2 — Problem Statement */}
        <section className="container mx-auto px-4 py-20">
          <h2
            className="text-2xl md:text-3xl font-bold mb-10 text-center opacity-0 animate-fade-up"
            style={{ animationDelay: "400ms" }}
          >
            Why this matters
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📱",
                stat: "3.2 billion",
                desc: "social media users are exposed daily to misleading arguments, emotionally manipulative content, and outright false reasoning",
              },
              {
                icon: "🧩",
                stat: "~50 known",
                desc: "logical fallacies and cognitive biases reliably exploited by politicians, advertisers, and bad-faith actors — most people can't name five",
              },
              {
                icon: "🎓",
                stat: "0 schools",
                desc: "teach applied critical thinking as a practical, trainable skill. Most people graduate without ever learning how arguments actually work",
              },
            ].map((card, i) => (
              <Card
                key={i}
                className="p-6 border-border/50 opacity-0 animate-fade-up"
                style={{ animationDelay: `${500 + i * 100}ms` }}
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <p className="text-3xl font-bold text-primary mb-2">{card.stat}</p>
                <p className="text-muted-foreground leading-relaxed">{card.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* SECTION 3 — How It Works */}
        <section className="container mx-auto px-4 py-20">
          <h2
            className="text-2xl md:text-3xl font-bold mb-14 text-center opacity-0 animate-fade-up"
            style={{ animationDelay: "800ms" }}
          >
            How Project Razor works
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              {
                num: "01",
                title: "Learn the tactics",
                desc: "Each lesson introduces 2–3 real manipulation techniques — from strawmanning to slippery slopes — with clear explanations and real-world examples.",
              },
              {
                num: "02",
                title: "Train on real content",
                desc: "Practice spotting fallacies in actual social media posts, news comments, and political discourse. Not textbook abstractions — the real thing.",
              },
              {
                num: "03",
                title: "Build a lasting skill",
                desc: "Spaced repetition, daily streaks, and progressive difficulty mean the skill sticks. You'll start seeing manipulation everywhere — and knowing exactly how to respond.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="text-center md:text-left opacity-0 animate-fade-up"
                style={{ animationDelay: `${900 + i * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4 — What You'll Learn */}
        <section className="container mx-auto px-4 py-20">
          <h2
            className="text-2xl md:text-3xl font-bold mb-10 text-center opacity-0 animate-fade-up"
            style={{ animationDelay: "1200ms" }}
          >
            What you'll learn to detect
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "⚠️",
                title: "Logical Fallacies",
                desc: "Flawed arguments disguised as sound reasoning. Ad hominem attacks, strawmen, false dilemmas, slippery slopes — the tricks used to win arguments dishonestly.",
                link: "/learn/logical-fallacies",
                linkText: "Explore Fallacies",
              },
              {
                icon: "🧠",
                title: "Cognitive Biases",
                desc: "The mental shortcuts your brain takes that make you vulnerable to manipulation. Confirmation bias, availability heuristic, anchoring — and how others exploit them.",
                link: "/learn/cognitive-biases",
                linkText: "Explore Biases",
              },
              {
                icon: "🎭",
                title: "Bad-Faith Tactics",
                desc: "Deliberate manipulation techniques used in arguments and debate. Gaslighting, moving the goalposts, whataboutism — used every day in politics and online discourse.",
                link: "/learn/bad-faith-arguments",
                linkText: "Explore Tactics",
              },
            ].map((card, i) => (
              <Card
                key={i}
                className="p-6 border-border/50 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 opacity-0 animate-fade-up"
                style={{ animationDelay: `${1300 + i * 100}ms` }}
              >
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-muted-foreground mb-5 leading-relaxed">{card.desc}</p>
                <Link
                  to={card.link}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                >
                  {card.linkText} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* SECTION 5 — Motivational Banner */}
        <section
          className="py-20 mt-10 opacity-0 animate-fade-up"
          style={{
            animationDelay: "1600ms",
            background: "linear-gradient(135deg, hsl(270 60% 8%), hsl(280 50% 6%))",
          }}
        >
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <p className="text-2xl md:text-3xl font-medium italic text-foreground leading-snug mb-6">
              "The most dangerous arguments aren't the ones that are obviously wrong. They're the ones that sound{" "}
              <span className="text-primary">almost right</span>."
            </p>
            <p className="text-muted-foreground mb-8">
              Project Razor trains you to tell the difference.
            </p>
            <Button size="lg" asChild className="rounded-full px-8">
              <Link to="/train">Start Training — It's Free</Link>
            </Button>
          </div>
        </section>

        {/* SECTION 6 — Footer */}
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
