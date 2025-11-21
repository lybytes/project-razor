import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import scenarios from "@/data/scenarios.json";
import { ArrowRight, RotateCcw, Heart, Repeat2 } from "lucide-react";

const SocialWarzone = () => {
  const socialScenarios = scenarios.filter(s => s.mode === "social-warzone");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState<"context" | "post" | "answer">("context");
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentScenario = socialScenarios[currentIndex];

  // Auto-advance to post step if there's no context
  useEffect(() => {
    if (step === "context" && !currentScenario.context) {
      setStep("post");
    }
  }, [step, currentScenario]);

  const handleSubmit = () => {
    const answer = userAnswer.toLowerCase().trim();
    const correct = currentScenario.correctAnswer.toLowerCase();
    
    const matches = answer.includes(correct) || correct.includes(answer);
    
    setIsCorrect(matches);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < socialScenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStep("context");
      setUserAnswer("");
      setShowResult(false);
      setIsCorrect(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setStep("context");
    setUserAnswer("");
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link to="/train" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Training
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Social Warzone
            </h1>
            <p className="text-muted-foreground">
              Post {currentIndex + 1} of {socialScenarios.length}
            </p>
          </div>

          {step === "context" && currentScenario.context && (
            <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {currentScenario.context.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  This is an excerpt from a recent {currentScenario.context.source} article titled
                </p>
                <p className="text-lg text-muted-foreground italic mb-6">
                  "{currentScenario.context.articleTitle}"
                </p>
                
                <div className="bg-card border border-border rounded-lg p-6 mb-6">
                  <p className="text-foreground leading-relaxed whitespace-pre-line">
                    {currentScenario.context.content}
                  </p>
                </div>

                <Button 
                  onClick={() => setStep("post")} 
                  className="w-full"
                  size="lg"
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === "post" && (
            <>
              {currentScenario.post.context && (
                <p className="text-muted-foreground mb-4 text-sm">
                  {currentScenario.post.context}
                </p>
              )}
              
              <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
                <div className="p-6 bg-muted/20">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {currentScenario.post.author.substring(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">
                        {currentScenario.post.author}
                      </div>
                      <div className="text-sm text-muted-foreground">15d</div>
                    </div>
                  </div>
                  
                  <p className="text-foreground leading-relaxed mb-4">
                    {currentScenario.post.content}
                  </p>

                  {currentScenario.post.likes > 0 && (
                    <div className="flex gap-6 text-muted-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        <span>{currentScenario.post.likes.toLocaleString()}</span>
                      </div>
                      {currentScenario.post.retweets > 0 && (
                        <div className="flex items-center gap-2">
                          <Repeat2 className="w-4 h-4" />
                          <span>{currentScenario.post.retweets.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <p className="text-primary font-semibold mb-3">
                  Identify and refute the critical thinking pitfall before it spreads further.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Take a moment to think through the BFBA being used and how you'd counter it. When ready, reveal the answer below.
                </p>
                <Button 
                  onClick={() => setStep("answer")} 
                  className="w-full"
                  size="lg"
                >
                  Reveal Answer
                </Button>
              </div>
            </>
          )}

          {step === "answer" && (
            <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
              <div className="p-6 bg-muted/20">
                {currentScenario.post.context && (
                  <p className="text-muted-foreground mb-4 text-sm">
                    {currentScenario.post.context}
                  </p>
                )}
                
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {currentScenario.post.author.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      {currentScenario.post.author}
                    </div>
                    <div className="text-sm text-muted-foreground">15d</div>
                  </div>
                </div>
                
                <p className="text-foreground leading-relaxed mb-4">
                  {currentScenario.post.content}
                </p>

                {currentScenario.post.likes > 0 && (
                  <div className="flex gap-6 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>{currentScenario.post.likes.toLocaleString()}</span>
                    </div>
                    {currentScenario.post.retweets > 0 && (
                      <div className="flex items-center gap-2">
                        <Repeat2 className="w-4 h-4" />
                        <span>{currentScenario.post.retweets.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6">
                {!showResult ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Answer (after pressing reveal answer)</strong>
                  </p>
                  <p className="text-foreground text-lg mb-4">
                    1. The <strong>{currentScenario.correctAnswer}</strong>
                  </p>
                  <div 
                    className="text-muted-foreground leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentScenario.explanation }}
                  />
                  <Button 
                    onClick={() => setShowResult(true)} 
                    className="w-full mt-6"
                    size="lg"
                  >
                    Continue
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                    {currentIndex < socialScenarios.length - 1 ? (
                      <Button onClick={handleNext} className="w-full" size="lg">
                        Continue Playing
                      </Button>
                    ) : (
                      <Button onClick={handleReset} className="w-full" size="lg">
                        <RotateCcw className="mr-2 w-4 h-4" /> Start Over
                      </Button>
                    )}
                    <Link to="/train" className="w-full">
                      <Button variant="secondary" className="w-full" size="lg">
                        Other Training
                      </Button>
                    </Link>
                    <Link to="/learn" className="w-full">
                      <Button variant="secondary" className="w-full" size="lg">
                        Study
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}

          <div className="flex gap-2 justify-center">
            {socialScenarios.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'bg-primary w-8' 
                    : idx < currentIndex 
                    ? 'bg-primary/50' 
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SocialWarzone;
