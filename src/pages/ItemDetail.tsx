import { Navigation } from "@/components/Navigation";
import { Link, useParams, useNavigate } from "react-router-dom";
import fallacies from "@/data/fallacies.json";
import biases from "@/data/biases.json";
import badFaith from "@/data/bad-faith.json";
import type { Concept } from "@/data/concepts";
import { ConceptExampleCard } from "@/components/ConceptExampleCard";
import { ArrowLeft, BookOpen, Shield, AlertCircle, Search } from "lucide-react";
import { useEffect } from "react";

const ItemDetail = () => {
  const { type, slug } = useParams();
  const navigate = useNavigate();

  let item: Concept | null = null;
  let bias: (typeof biases)[number] | null = null;
  let backLink = "";
  let categoryName = "";
  let isBadFaith = false;

  if (type === "logical-fallacies") {
    item = (fallacies as Concept[]).find(f => f.slug === slug) ?? null;
    backLink = "/learn/logical-fallacies";
    categoryName = "Logical Fallacy";
  } else if (type === "cognitive-biases") {
    bias = biases.find(b => b.slug === slug) ?? null;
    backLink = "/learn/cognitive-biases";
    categoryName = "Cognitive Bias";
  } else if (type === "bad-faith-arguments") {
    item = (badFaith as Concept[]).find(bf => bf.slug === slug) ?? null;
    backLink = "/learn/bad-faith-arguments";
    categoryName = "Bad-Faith Tactic";
    isBadFaith = true;
  }

  const found = item || bias;

  useEffect(() => {
    if (!found) {
      navigate("/learn");
    }
  }, [found, navigate]);

  if (bias) {
    return <BiasDetail bias={bias} backLink={backLink} categoryName={categoryName} />;
  }

  if (!item) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <Link to={backLink} className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 hover:underline mb-6 sm:mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {categoryName} Library
          </Link>

          <div className="mb-8 sm:mb-10">
            <div className="inline-flex items-center h-7 px-3 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide mb-4">
              {categoryName}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              {item.name}
            </h1>
            {item.aka.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Also known as: {item.aka.join(", ")}
              </p>
            )}
          </div>

          {/* Section 1 — What is it? */}
          <section className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  What is it?
                </h2>
                <p className="text-base text-foreground leading-relaxed">
                  {item.oneLiner}
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 — In Depth & How to Spot It */}
          <section className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  In Depth
                </h2>
                <p className="text-base text-foreground leading-relaxed mb-6">
                  {item.deepDive}
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  How to Spot It
                </h3>
                <ul className="space-y-3">
                  {item.howToSpot.map((point, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-primary flex-shrink-0">•</span>
                      <span className="text-base text-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 — Examples */}
          <section className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Examples
              </h2>
            </div>
            <div className="space-y-4 sm:space-y-5">
              {item.examples.map((example, idx) => (
                <ConceptExampleCard key={idx} example={example} index={idx} conceptName={item.name} />
              ))}
            </div>
          </section>

          {/* Section 4 — Refutation Strategy */}
          <section className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Refutation Strategy
              </h2>
            </div>
            <ul className="space-y-6">
              {item.refutation.map((point, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-primary flex-shrink-0">•</span>
                  <div className="flex-1">
                    <span className="font-bold text-foreground">{point.title}: </span>
                    <span className="text-base text-foreground">{point.text}</span>
                    <div className="mt-2 border-l-2 border-primary/50 bg-primary/5 rounded-r px-4 py-2">
                      <p className="text-base text-foreground italic">
                        Say: &ldquo;{point.comeback}&rdquo;
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* How to Avoid It — fallacies only */}
          {!isBadFaith && !!item.avoidance?.length && (
            <section className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  How to Avoid It
                </h2>
              </div>
              <ul className="space-y-4">
                {item.avoidance.map((point, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-primary flex-shrink-0">•</span>
                    <span className="text-base text-foreground flex-1">{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

/* Cognitive biases still use the legacy string-based schema. */
const BiasDetail = ({ bias, backLink, categoryName }: {
  bias: (typeof biases)[number];
  backLink: string;
  categoryName: string;
}) => (
  <div className="min-h-screen bg-background">
    <Navigation />

    <main className="container mx-auto px-4 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto">
        <Link to={backLink} className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 hover:underline mb-6 sm:mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {categoryName} Library
        </Link>

        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center h-7 px-3 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide mb-4">
            {categoryName}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">{bias.name}</h1>
        </div>

        <section className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-foreground mb-3">What is it?</h2>
              <p className="text-base text-foreground leading-relaxed">{bias.explanation}</p>
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-6">
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Examples</h2>
          </div>
          <div className="space-y-4">
            {bias.examples.map((example, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card/50 p-4 sm:p-5">
                <div className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">{idx + 1}.</span>
                  <span className="text-base text-foreground">{example}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-6">
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Refutation Strategy</h2>
          </div>
          <ul className="space-y-4">
            {bias.refutation.map((point, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-primary flex-shrink-0">•</span>
                <span className="text-base text-foreground flex-1">{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-card border border-border rounded-xl p-6 sm:p-8">
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">How to Avoid It</h2>
          </div>
          <ul className="space-y-4">
            {bias.avoidance.map((point, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-primary flex-shrink-0">•</span>
                <span className="text-base text-foreground flex-1">{point}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  </div>
);

export default ItemDetail;
