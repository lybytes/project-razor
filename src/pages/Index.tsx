import { useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue } from "motion/react";
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
    stat: "50+ tactics",
    desc: "A playbook of logical fallacies, cognitive biases and manipulation tactics used to influence conversations, opinions, and decisions.",
  },
  {
    stat: "Seconds",
    desc: "That's how quickly a bad argument can sink. Learn to recognise the trick before you're fooled.",
  },
  {
    stat: "Rarely taught",
    desc: "Most people are never taught how arguments work or how easily they can be manipulated. Don't let yourself become them.",
  },
];

const steps = [
  {
    num: "01",
    title: "Learn the tactics",
    desc: "In our course, each lesson is bite-size and introduces 2–3 logical fallacies or manipulation tactics with clear explanations, memorable examples, and practical ways to call them out.",
  },
  {
    num: "02",
    title: "Train on real arguments",
    desc: "Put your knowledge to the test by practicing spotting flawed reasoning in real-world examples, from social media posts and comment sections to advertisements and political debates. We'll train you for the real world.",
  },
  {
    num: "03",
    title: "Build the reflex",
    desc: "By introducing progressively harder exercises, we'll help turn conscious analysis into instinct. We firmly believe that the more you practice, the faster you'll be able to recognise these fallacies and tactics.",
  },
];

const learnCards = [
  {
    title: "Logical Fallacies",
    desc: "Flawed reasoning disguised as sound argument. From straw men and false dilemmas to slippery slopes and personal attacks, explore the reasoning errors that make bad arguments seem convincing.",
    link: "/learn/logical-fallacies",
    linkText: "Explore Fallacies",
  },
  {
    title: "Cognitive Biases",
    desc: "The mental shortcuts that shape how you and those around you think. Your brain relies on shortcuts that can distort judgment and make you vulnerable to manipulation. Explore confirmation bias, anchoring, availability bias, and more.",
    link: "/learn/cognitive-biases",
    linkText: "Explore Biases",
  },
  {
    title: "Bad-Faith Tactics",
    desc: "When truth is no longer the goal: it's winning. Recognise tactics commonly used to derail discussion, distort reality, and avoid accountability, from gaslighting and whataboutism to moving the goalposts.",
    link: "/learn/bad-faith-arguments",
    linkText: "Explore Tactics",
  },
];

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      mouseX.set(rect.width / 2);
      mouseY.set(rect.height / 2);
    }
  }, [mouseX, mouseY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero */}
        <section
          ref={heroRef}
          onMouseMove={handleMouseMove}
          className="relative min-h-[100dvh] flex items-center pt-24 pb-16 overflow-hidden"
        >
          <HeroBackground mouseX={mouseX} mouseY={mouseY} />
          <div className="relative z-10 w-full container mx-auto px-4">
           <div className="max-w-5xl mx-auto">
           <div className="max-w-4xl">
            <motion.span
              className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6"
              {...heroReveal}
              transition={{ ...heroReveal.transition, delay: 0 }}
            >
              Intellectual Self-Defence
            </motion.span>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tighter leading-[1.05]"
              {...heroReveal}
              transition={{ ...heroReveal.transition, delay: 0.08 }}
            >
              You&apos;re easier to{" "}
              <span className="text-primary">fool</span> than you think.
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-4 leading-relaxed"
              {...heroReveal}
              transition={{ ...heroReveal.transition, delay: 0.16 }}
            >
              From straw men to ad hominem attacks, flawed arguments are everywhere. Unfortunately, most people don&apos;t recognise them when they appear. Don&apos;t be one of them.
            </motion.p>

            <motion.p
              className="text-lg sm:text-xl text-foreground font-medium max-w-2xl mb-10 leading-relaxed"
              {...heroReveal}
              transition={{ ...heroReveal.transition, delay: 0.2 }}
            >
              Razor is training for intellectual self-defence, so you never fall for the same trick twice.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row sm:items-start gap-4"
              {...heroReveal}
              transition={{ ...heroReveal.transition, delay: 0.28 }}
            >
              <div className="flex flex-col gap-2">
                <Button size="lg" asChild className="rounded-full px-8 h-12 text-base">
                  <Link to="/train/lesson/1-1">
                    Start Course <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground text-center">Try lesson 1 now, no sign-up required.</p>
              </div>
              <Button size="lg" variant="outline" asChild className="rounded-full px-8 h-12 text-base">
                <Link to="/learn">Browse the Library</Link>
              </Button>
            </motion.div>
           </div>
           </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="container mx-auto px-4 py-20 sm:py-28">
          <motion.div className="max-w-5xl mx-auto" {...reveal}>
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
          <motion.div className="max-w-5xl mx-auto" {...reveal}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-16 tracking-tight">How Razor works</h2>
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

        {/* Knowledge Library */}
        <section className="container mx-auto px-4 py-20 sm:py-28">
          <motion.div className="max-w-5xl mx-auto" {...reveal}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 tracking-tight">Knowledge Library</h2>
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
            className="mx-auto px-4 max-w-[66rem]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-snug mb-4 tracking-tight">
              Try the first lesson
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Two tactics, a few quick scenarios, then some posts like the ones you&apos;d see online to test yourself on.
            </p>
            <Button size="lg" asChild className="rounded-full px-8 h-12 text-base">
              <Link to="/train/lesson/1-1">Start Course</Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-3">Try lesson 1 now, no sign-up required.</p>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-10 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Project Razor · Built to make the world think more clearly
          </p>
          <nav className="mt-3 flex items-center justify-center gap-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
          </nav>
        </footer>
      </main>
    </div>
  );
};

export default Index;
