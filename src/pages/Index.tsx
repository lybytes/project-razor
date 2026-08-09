import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { HeroBackground } from "@/components/HeroBackground";

const easeOut = [0.23, 1, 0.32, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: easeOut },
} as const;

const heroReveal = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: easeOut },
} as const;

const stats = [
  {
    stat: "~50 tactics",
    desc: "logical fallacies and manipulation tricks are reused constantly by advertisers, politicians, and state actors. Most people can't name five.",
  },
  {
    stat: "Seconds",
    desc: "is how long it takes a bad argument to work. You feel something's off but can't name why before the moment's gone",
  },
  {
    stat: "Almost never taught",
    desc: "most people will never learn how an argument is actually built, and more importantly how it's rigged.",
  },
];

const steps = [
  {
    num: "01",
    title: "Learn the tactics",
    desc: "Each lesson introduces 2–3 real logical fallacies,from strawmanning to slippery slopes, with clear explanations and real-world examples.",
  },
  {
    num: "02",
    title: "Train on real content",
    desc: "Practice spotting fallacies in the real world, from comment sections to ads and political discourse.",
  },
  {
    num: "03",
    title: "Build the reflex",
    desc: "Daily practice and rising difficulty turn recognition into instinct. After a while you'll spot the moves in real time.",
  },
];

const learnCards = [
  {
    title: "Logical Fallacies",
    desc: "Flawed arguments disguised as sound reasoning. Ad hominem attacks, strawmen, false dilemmas, slippery slopes. These are the tricks used to win arguments dishonestly.",
    link: "/learn/logical-fallacies",
    linkText: "Explore Fallacies",
  },
  {
    title: "Cognitive Biases",
    desc: "The mental shortcuts your brain takes that make you vulnerable to manipulation. Confirmation bias, availability heuristic, anchoring.",
    link: "/learn/cognitive-biases",
    linkText: "Explore Biases",
  },
  {
    title: "Bad-Faith Tactics",
    desc: "Deliberate manipulation techniques used in arguments and debate. Gaslighting, moving the goalposts, whataboutism. These areused every day in politics and online discourse.",
    link: "/learn/bad-faith-arguments",
    linkText: "Explore Tactics",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero */}
        <section className="relative min-h-[100dvh] flex items-center container mx-auto px-4 pt-24 pb-16 overflow-hidden">
          <HeroBackground />
          <div className="relative z-10 max-w-4xl">
            <motion.span
              className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6"
              {...heroReveal}
              transition={{ ...heroReveal.transition, delay: 0 }}
            >
              Critical Thinking Training
            </motion.span>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tighter leading-[1.05]"
              {...heroReveal}
              transition={{ ...heroReveal.transition, delay: 0.08 }}
            >
              Stop getting{" "}
              <span className="text-primary">played</span>.
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-4 leading-relaxed"
              {...heroReveal}
              transition={{ ...heroReveal.transition, delay: 0.16 }}
            >
              Every day, someone online is trying to win you over with an argument that&apos;s quietly broken. A dodge, a strawman, a fake either/or.
            </motion.p>

            <motion.p
              className="text-lg sm:text-xl text-foreground font-medium max-w-2xl mb-10 leading-relaxed"
              {...heroReveal}
              transition={{ ...heroReveal.transition, delay: 0.2 }}
            >
              Razor trains you to catch the move, name it, and shut it down.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              {...heroReveal}
              transition={{ ...heroReveal.transition, delay: 0.28 }}
            >
              <Button size="lg" asChild className="rounded-full px-8 h-12 text-base">
                <Link to="/train">
                  Start the Course <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full px-8 h-12 text-base">
                <Link to="/learn">Explore the Library</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="container mx-auto px-4 py-20 sm:py-28">
          <motion.div className="max-w-5xl" {...reveal}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 tracking-tight">Why this matters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
              {stats.map((card, i) => (
                <div key={i} className="pt-6 border-t border-border">
                  <p className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{card.stat}</p>
                  <p className="text-base text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-20 sm:py-28">
          <motion.div className="max-w-5xl" {...reveal}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-16 tracking-tight">How Project Razor works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
              {steps.map((step, i) => (
                <div key={i} className="relative">
                  <span className="absolute -top-8 left-0 text-7xl font-bold text-muted-foreground/20 select-none">
                    {step.num}
                  </span>
                  <div className="relative pt-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* What You'll Learn */}
        <section className="container mx-auto px-4 py-20 sm:py-28">
          <motion.div className="max-w-5xl" {...reveal}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 tracking-tight">What you'll learn to detect</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {learnCards.map((card, i) => (
                <Card
                  key={i}
                  className="p-6 border border-border bg-card rounded-xl hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <h3 className="text-lg sm:text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-base text-muted-foreground mb-6 leading-relaxed">{card.desc}</p>
                  <Link
                    to={card.link}
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    {card.linkText} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Card>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Motivational Banner */}
        <section className="py-20 sm:py-28 border-y border-border/50 bg-gradient-to-br from-primary/[0.04] to-transparent">
          <motion.div
            className="container mx-auto px-4 max-w-4xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <blockquote>
              <p className="text-2xl sm:text-3xl md:text-4xl font-medium italic text-foreground leading-snug mb-6 tracking-tight">
                The most dangerous arguments aren&apos;t the ones that are obviously wrong. They&apos;re the ones that sound{" "}
                <span className="text-primary not-italic">almost right</span>.
              </p>
            </blockquote>
            <p className="text-lg text-muted-foreground mb-8">
              Project Razor trains you to tell the difference.
            </p>
            <Button size="lg" asChild className="rounded-full px-8 h-12 text-base">
              <Link to="/train">Start Training. It&apos;s Free</Link>
            </Button>
          </motion.div>
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
