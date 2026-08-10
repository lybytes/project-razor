import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import fallacies from "@/data/fallacies.json";
import biases from "@/data/biases.json";
import badFaith from "@/data/bad-faith.json";
import type { Concept } from "@/data/concepts";
import { ConceptExampleCard } from "@/components/ConceptExampleCard";
import { InlineMarkdown } from "@/components/InlineMarkdown";
import { PageShell } from "@/components/PageShell";
import { ArrowLeft, BookOpen } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";

const easeOut = [0.23, 1, 0.32, 1] as const;
const reveal = { duration: 0.45, ease: easeOut } as const;

const ReadingProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-50 origin-left"
      style={{ scaleX }}
    />
  );
};

const ItemDetail = () => {
  const { type, slug } = useParams();
  const navigate = useNavigate();

  let item: Concept | null = null;
  let bias: (typeof biases)[number] | null = null;
  let backLink = "";
  let categoryName = "";

  if (type === "logical-fallacies") {
    item = (fallacies as Concept[]).find((f) => f.slug === slug) ?? null;
    backLink = "/learn/logical-fallacies";
    categoryName = "Logical Fallacy";
  } else if (type === "cognitive-biases") {
    bias = biases.find((b) => b.slug === slug) ?? null;
    backLink = "/learn/cognitive-biases";
    categoryName = "Cognitive Bias";
  } else if (type === "bad-faith-arguments") {
    item = (badFaith as Concept[]).find((bf) => bf.slug === slug) ?? null;
    backLink = "/learn/bad-faith-arguments";
    categoryName = "Bad-Faith Tactic";
  }

  const found = item || bias;

  useEffect(() => {
    if (!found) {
      navigate("/learn");
    }
  }, [found, navigate]);

  if (!found) return null;

  if (bias) {
    return <BiasDetail bias={bias} backLink={backLink} categoryName={categoryName} />;
  }

  if (!item) return null;

  return <ConceptDetail item={item} backLink={backLink} categoryName={categoryName} />;
};

interface TocItem {
  id: string;
  title: string;
}

const useActiveSection = (items: TocItem[]) => {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (!items.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return activeId;
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">
    {children}
  </span>
);

const Toc = ({ items, activeId }: { items: TocItem[]; activeId: string }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, ...reveal }}
      className="hidden lg:block"
    >
      <div className="sticky top-28">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          On this page
        </p>
        <ul className="space-y-2 border-l border-border">
          {items.map(({ id, title }) => {
            const active = activeId === id;
            return (
              <li key={id} className="relative">
                {active && (
                  <motion.div
                    layoutId="toc-active"
                    className="absolute -left-px top-0 bottom-0 w-[2px] bg-primary rounded-full"
                    transition={{ duration: 0.2, ease: easeOut }}
                  />
                )}
                <a
                  href={`#${id}`}
                  onClick={(e) => handleClick(e, id)}
                  className={[
                    "block pl-4 text-sm transition-colors",
                    active
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
};

const ConceptDetail = ({
  item,
  backLink,
  categoryName,
}: {
  item: Concept;
  backLink: string;
  categoryName: string;
}) => {
  const tocItems: TocItem[] = useMemo(() => {
    const items: TocItem[] = [
      { id: "overview", title: "Overview" },
      { id: "how-to-spot", title: "How to spot it" },
      { id: "examples", title: "Examples" },
      { id: "refutation", title: "How to refute" },
    ];
    if (item.validUses?.length) {
      items.splice(1, 0, { id: "valid-uses", title: "When it's not a fallacy" });
    }
    if (item.avoidance?.length) {
      items.push({ id: "avoidance", title: "How to avoid it" });
    }
    return items;
  }, [item.avoidance?.length, item.validUses?.length]);

  const activeId = useActiveSection(tocItems);

  return (
    <PageShell>
      <ReadingProgress />
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <Link
            to={backLink}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {categoryName} Library
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
            <article className="max-w-3xl">
              <motion.header
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: easeOut }}
              >
                <span className="inline-flex items-center h-7 px-3 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide mb-4">
                  {categoryName}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
                  {item.name}
                </h1>
                {item.aka.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Also known as: <span className="text-foreground">{item.aka.join(", ")}</span>
                  </p>
                )}
              </motion.header>

              {item.hook && (
                <motion.section
                  id="hook"
                  className="mb-14 scroll-mt-28"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={reveal}
                >
                  <blockquote className="border-l-2 border-primary pl-5 py-1">
                    <p className="text-lg sm:text-xl italic text-foreground/90 leading-relaxed">
                      &ldquo;{item.hook}&rdquo;
                    </p>
                  </blockquote>
                </motion.section>
              )}

              <motion.section
                id="overview"
                className="mb-14 scroll-mt-28"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={reveal}
              >
                <SectionLabel>Overview</SectionLabel>
                <h2 className="text-2xl font-bold text-foreground mb-4">What is it?</h2>
                <p className="text-lg text-foreground/90 leading-relaxed mb-6 max-w-[65ch]">
                  <InlineMarkdown text={item.oneLiner} />
                </p>
                <p className="text-base text-foreground/80 leading-relaxed max-w-[65ch]">
                  <InlineMarkdown text={item.deepDive} />
                </p>
              </motion.section>

              {item.validUses?.length ? (
                <motion.section
                  id="valid-uses"
                  className="mb-14 scroll-mt-28"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={reveal}
                >
                  <SectionLabel>Boundaries</SectionLabel>
                  <h2 className="text-2xl font-bold text-foreground mb-4">When it's not a fallacy</h2>
                  <ul className="space-y-3 max-w-[65ch]">
                    {item.validUses.map((point, idx) => (
                      <li key={idx} className="flex gap-3 text-base text-foreground/90 leading-relaxed">
                        <span className="text-primary font-semibold flex-shrink-0">{idx + 1}.</span>
                        <span><InlineMarkdown text={point} /></span>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              ) : null}

              <motion.section
                id="how-to-spot"
                className="mb-14 scroll-mt-28"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={reveal}
              >
                <SectionLabel>Detection</SectionLabel>
                <h2 className="text-2xl font-bold text-foreground mb-4">How to spot it</h2>
                <ul className="space-y-3">
                  {item.howToSpot.map((point, idx) => (
                    <li key={idx} className="flex gap-3 text-base text-foreground/90 leading-relaxed">
                      <span className="text-primary font-semibold flex-shrink-0">{idx + 1}.</span>
                      <span><InlineMarkdown text={point} /></span>
                    </li>
                  ))}
                </ul>
              </motion.section>

              <motion.section
                id="examples"
                className="mb-14 scroll-mt-28"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={reveal}
              >
                <SectionLabel>Examples</SectionLabel>
                <h2 className="text-2xl font-bold text-foreground mb-6">See it in action</h2>
                <div className="space-y-4 sm:space-y-5">
                  {item.examples.map((example, idx) => (
                    <ConceptExampleCard key={idx} example={example} index={idx} conceptName={item.name} />
                  ))}
                </div>
              </motion.section>

              <motion.section
                id="refutation"
                className="mb-14 scroll-mt-28"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={reveal}
              >
                <SectionLabel>Response</SectionLabel>
                <h2 className="text-2xl font-bold text-foreground mb-6">How to refute</h2>
                <div className="space-y-8">
                  {item.refutation.map((point, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ ...reveal, delay: idx * 0.08 }}
                    >
                      <h3 className="text-lg font-semibold text-foreground mb-2">{point.title}</h3>
                      <p className="text-base text-foreground/80 leading-relaxed mb-4"><InlineMarkdown text={point.text} /></p>
                      <blockquote className="border-l-2 border-primary/70 bg-primary/[0.03] rounded-r-lg pl-5 pr-4 py-3">
                        <p className="text-base italic text-foreground/90">
                          &ldquo;<InlineMarkdown text={point.comeback} />&rdquo;
                        </p>
                      </blockquote>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {item.avoidance && item.avoidance.length > 0 && (
                <motion.section
                  id="avoidance"
                  className="mb-14 scroll-mt-28"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={reveal}
                >
                  <SectionLabel>Prevention</SectionLabel>
                  <h2 className="text-2xl font-bold text-foreground mb-4">How to avoid it</h2>
                  <ul className="space-y-3">
                    {item.avoidance.map((point, idx) => (
                      <li key={idx} className="flex gap-3 text-base text-foreground/90 leading-relaxed">
                        <span className="text-primary font-semibold flex-shrink-0">{idx + 1}.</span>
                        <span><InlineMarkdown text={point} /></span>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              )}

              <motion.div
                className="pt-8 border-t border-border"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={reveal}
              >
                <Button asChild className="rounded-full h-11 px-6">
                  <Link to="/train">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Practice in a lesson
                  </Link>
                </Button>
              </motion.div>
            </article>

            <Toc items={tocItems} activeId={activeId} />
          </div>
        </div>
      </main>
    </PageShell>
  );
};

/* Cognitive biases still use the legacy string-based schema. */
const BiasDetail = ({
  bias,
  backLink,
  categoryName,
}: {
  bias: (typeof biases)[number];
  backLink: string;
  categoryName: string;
}) => {
  const tocItems: TocItem[] = useMemo(() => {
    const items: TocItem[] = [
      { id: "overview", title: "Overview" },
      { id: "examples", title: "Examples" },
      { id: "refutation", title: "How to counter" },
    ];
    if (bias.avoidance?.length) {
      items.push({ id: "avoidance", title: "How to avoid it" });
    }
    return items;
  }, [bias.avoidance?.length]);

  const activeId = useActiveSection(tocItems);

  return (
    <PageShell>
      <ReadingProgress />
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <Link
            to={backLink}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {categoryName} Library
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
            <article className="max-w-3xl">
              <motion.header
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: easeOut }}
              >
                <span className="inline-flex items-center h-7 px-3 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide mb-4">
                  {categoryName}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
                  {bias.name}
                </h1>
              </motion.header>

              <motion.section
                id="overview"
                className="mb-14 scroll-mt-28"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={reveal}
              >
                <SectionLabel>Overview</SectionLabel>
                <h2 className="text-2xl font-bold text-foreground mb-4">What is it?</h2>
                <p className="text-base text-foreground/90 leading-relaxed max-w-[65ch]">
                  <InlineMarkdown text={bias.explanation} />
                </p>
              </motion.section>

              <motion.section
                id="examples"
                className="mb-14 scroll-mt-28"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={reveal}
              >
                <SectionLabel>Examples</SectionLabel>
                <h2 className="text-2xl font-bold text-foreground mb-6">See it in action</h2>
                <div className="space-y-4">
                  {bias.examples.map((example, idx) => (
                    <motion.div
                      key={idx}
                      className="rounded-xl border border-border bg-card/30 p-4 sm:p-5"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ ...reveal, delay: idx * 0.06 }}
                    >
                      <div className="flex gap-3">
                        <span className="text-primary font-bold flex-shrink-0">{idx + 1}.</span>
                        <p className="text-base text-foreground leading-relaxed"><InlineMarkdown text={example} /></p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                id="refutation"
                className="mb-14 scroll-mt-28"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={reveal}
              >
                <SectionLabel>Response</SectionLabel>
                <h2 className="text-2xl font-bold text-foreground mb-4">How to counter it</h2>
                <ul className="space-y-3">
                  {bias.refutation.map((point, idx) => (
                    <li key={idx} className="flex gap-3 text-base text-foreground/90 leading-relaxed">
                      <span className="text-primary font-semibold flex-shrink-0">{idx + 1}.</span>
                      <span><InlineMarkdown text={point} /></span>
                    </li>
                  ))}
                </ul>
              </motion.section>

              {bias.avoidance && bias.avoidance.length > 0 && (
                <motion.section
                  id="avoidance"
                  className="mb-14 scroll-mt-28"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={reveal}
                >
                  <SectionLabel>Prevention</SectionLabel>
                  <h2 className="text-2xl font-bold text-foreground mb-4">How to avoid it</h2>
                  <ul className="space-y-3">
                    {bias.avoidance.map((point, idx) => (
                      <li key={idx} className="flex gap-3 text-base text-foreground/90 leading-relaxed">
                        <span className="text-primary font-semibold flex-shrink-0">{idx + 1}.</span>
                        <span><InlineMarkdown text={point} /></span>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              )}

              <motion.div
                className="pt-8 border-t border-border"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={reveal}
              >
                <Button asChild className="rounded-full h-11 px-6">
                  <Link to="/train">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Practice in a lesson
                  </Link>
                </Button>
              </motion.div>
            </article>

            <Toc items={tocItems} activeId={activeId} />
          </div>
        </div>
      </main>
    </PageShell>
  );
};

export default ItemDetail;
