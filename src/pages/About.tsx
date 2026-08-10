import { Navigation } from "@/components/Navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const easeOut = [0.23, 1, 0.32, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: easeOut },
} as const;

const pillars = [
  {
    title: "Our Mission",
    description:
      "To empower individuals with the tools and knowledge needed to identify and counter logical fallacies and bad-faith arguments in everyday discourse.",
  },
  {
    title: "Our Approach",
    description:
      "Combining education with interactive training, we help users develop practical skills through realistic scenarios and real-world examples.",
  },
  {
    title: "What We Teach",
    description:
      "Logical fallacies, cognitive biases, and bad-faith argumentation tactics through comprehensive libraries and interactive training modes.",
  },
  {
    title: "Who It's For",
    description:
      "Students, educators, debaters, journalists, and anyone who wants to think more critically and communicate more effectively.",
  },
];

const framework = [
  {
    initial: "B",
    label: "Biases",
    text: "Systematic patterns of deviation from rationality in judgment. These are unconscious mental shortcuts that can lead us astray.",
  },
  {
    initial: "F",
    label: "Fallacies",
    text: "Errors in reasoning that undermine the logic of an argument. These are flaws in the structure of arguments themselves.",
  },
  {
    initial: "BA",
    label: "Bad-Faith Arguments",
    text: "Manipulative tactics used to win arguments dishonestly. These are deliberate strategies to avoid genuine discussion.",
  },
];

const About = () => {
  return (
    <PageShell>
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-20">
        <div className="max-w-4xl">
          <motion.header
            className="mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              About
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tighter leading-[1.05]">
              Project Razor
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              A training platform for how to think clearly, when someone is trying to make you think badly.
            </p>
          </motion.header>

          <motion.section className="mb-20 sm:mb-24" {...reveal}>
            <div className="grid sm:grid-cols-2 gap-6">
              {pillars.map((card, index) => (
                <Card
                  key={card.title}
                  className="p-6 border border-border bg-card rounded-xl hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-foreground mb-3">{card.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{card.description}</p>
                </Card>
              ))}
            </div>
          </motion.section>

          <motion.section className="mb-20 sm:mb-24" {...reveal}>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">
              Why &ldquo;Razor&rdquo;?
            </h2>
            <div className="max-w-[65ch] space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                The name is inspired by <strong className="text-foreground">Occam&apos;s Razor</strong> — the principle that simpler explanations are generally better than complex ones. In critical thinking, a &ldquo;razor&rdquo; is a tool that cuts through noise to reveal truth.
              </p>
              <p>
                Project Razor gives you multiple &ldquo;razors&rdquo;, sharp mental tools to cut through faulty logic, identify cognitive traps, and recognize manipulative tactics.
              </p>
            </div>
          </motion.section>

          <motion.section className="mb-20 sm:mb-24" {...reveal}>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 tracking-tight">
              The BFBA Framework
            </h2>
            <div className="space-y-4">
              {framework.map((item, index) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border bg-card p-5 sm:p-6 hover:border-primary/40 transition-colors"
                >
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    <span className="text-primary">{item.initial}</span>
                    <span className="text-muted-foreground font-medium mx-2">—</span>
                    {item.label}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="py-20 sm:py-28 border-t border-border/50"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-10 tracking-tight">
              What this is for
            </h2>
            <div className="max-w-[70ch] space-y-6 text-lg sm:text-xl text-foreground/90 leading-relaxed">
              <p className="text-foreground">
                Razor exists to make you better at spotting bad reasoning. That&apos;s the whole purpose, and it&apos;s the reason the platform doesn&apos;t take political positions.
              </p>
              <p>
                You&apos;ll encounter arguments here from every part of the political spectrum, because bad reasoning isn&apos;t concentrated on one side of it. Strawmen, false dilemmas and appeals to emotion get used by governments and by their critics, by campaigners and by the people who oppose them. An educational platform that drew its examples from only one direction wouldn&apos;t be teaching critical thinking, but allegiance.
              </p>
              <p>
                Therefore the goal in every exercise is the reasoning, not the conclusion. When Razor takes apart a fallacious argument for a claim, idea or policy, that is not an argument against the policy. A position can be badly defended and still be correct. Treating a bad argument as proof that the whole claim is false is itself a fallacy (the &ldquo;Fallacy Fallacy&rdquo;), and it&apos;s one of the most common mistakes made by people who have just learned to name a few others.
              </p>
              <p>
                Razor is independent. It isn&apos;t funded by, affiliated with, or acting on behalf of any party, campaign or advocacy organisation, and no political group has input into what gets taught or which examples are used. We sincerely hope users can use the tools we teach them to formulate their own opinions.
              </p>
            </div>
          </motion.section>

          <motion.section
            className="py-12 sm:py-16 border-y border-border/50"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">
              Start training your judgment
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              The first lesson is free. No sign-up required until you want to save your progress.
            </p>
            <Button size="lg" asChild className="rounded-full px-8 h-12 text-base">
              <Link to="/train">Start the Course</Link>
            </Button>
          </motion.section>
        </div>
      </main>
    </PageShell>
  );
};

export default About;
