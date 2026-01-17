import { Navigation } from "@/components/Navigation";
import { Link, useParams, useNavigate } from "react-router-dom";
import fallacies from "@/data/fallacies.json";
import biases from "@/data/biases.json";
import badFaith from "@/data/bad-faith.json";
import { ArrowLeft, BookOpen, Shield, AlertCircle } from "lucide-react";
import { useEffect } from "react";

const ItemDetail = () => {
  const { type, slug } = useParams();
  const navigate = useNavigate();

  let item = null;
  let backLink = "";
  let categoryName = "";
  let isBadFaith = false;

  if (type === "logical-fallacies") {
    item = fallacies.find(f => f.slug === slug);
    backLink = "/learn/logical-fallacies";
    categoryName = "Logical Fallacy";
  } else if (type === "cognitive-biases") {
    item = biases.find(b => b.slug === slug);
    backLink = "/learn/cognitive-biases";
    categoryName = "Cognitive Bias";
  } else if (type === "bad-faith-arguments") {
    item = badFaith.find(bf => bf.slug === slug);
    backLink = "/learn/bad-faith-arguments";
    categoryName = "Bad-Faith Argument";
    isBadFaith = true;
  }

  useEffect(() => {
    if (!item) {
      navigate("/learn");
    }
  }, [item, navigate]);

  if (!item) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link to={backLink} className="inline-flex items-center text-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {categoryName} Library
          </Link>

          <div className="mb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              {categoryName}
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              {item.name}
            </h1>
          </div>

          {/* Explanation */}
          <section className="bg-card border border-border rounded-lg p-8 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-normal text-foreground mb-3">
                  What is it?
                </h2>
                <p className="text-base text-foreground leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            </div>
          </section>

          {/* Examples */}
          <section className="bg-card border border-border rounded-lg p-8 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-lg font-normal text-foreground mb-4">
                  Examples
                </h2>
                <div className="space-y-6">
                  {item.examples.map((example, idx) => {
                    const isObject = typeof example === 'object';
                    const text = isObject ? example.text : example;
                    const explanation = isObject ? example.explanation : null;
                    
                    return (
                      <div key={idx}>
                        <div className="bg-muted/50 border border-border rounded-lg p-4 mb-2">
                          <div className="flex gap-3">
                            <span className="text-primary font-bold flex-shrink-0">{idx + 1}.</span>
                            <span className="text-base text-foreground">{text}</span>
                          </div>
                        </div>
                        {explanation && (
                          <p className="text-base text-foreground ml-8 mt-2">
                            {explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Refutation */}
          <section className="bg-card border border-border rounded-lg p-8 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-lg font-normal text-foreground mb-4">
                  Refutation Strategy
                </h2>
                <ul className="space-y-4">
                  {item.refutation.map((point, idx) => {
                    const isObject = typeof point === 'object';
                    const title = isObject ? point.title : null;
                    const text = isObject ? point.text : point;
                    const explanation = isObject ? point.explanation : null;
                    
                    return (
                      <li key={idx} className="flex gap-3">
                        <span className="text-primary flex-shrink-0">•</span>
                        <div className="flex-1">
                          {title && <span className="font-bold text-foreground">{title}: </span>}
                          <span className="text-base text-foreground">{text}</span>
                          {explanation && (
                            <p className="text-base text-foreground mt-1">{explanation}</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </section>

          {/* Avoidance - Only show for non-bad-faith items */}
          {!isBadFaith && (
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-lg font-normal text-foreground mb-4">
                    How to Avoid It
                  </h2>
                  <ul className="space-y-4">
                    {item.avoidance.map((point, idx) => {
                      const isObject = typeof point === 'object';
                      const title = isObject ? point.title : null;
                      const text = isObject ? point.text : point;
                      const explanation = isObject ? point.explanation : null;
                      
                      return (
                        <li key={idx} className="flex gap-3">
                          <span className="text-primary flex-shrink-0">•</span>
                          <div className="flex-1">
                            {title && <span className="font-bold text-foreground">{title}: </span>}
                            <span className="text-base text-foreground">{text}</span>
                            {explanation && (
                              <p className="text-base text-foreground mt-1">{explanation}</p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default ItemDetail;