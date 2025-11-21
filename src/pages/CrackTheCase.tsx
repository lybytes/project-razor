import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import scenarios from "@/data/scenarios.json";
import { ArrowRight, RotateCcw } from "lucide-react";

const CrackTheCase = () => {
  const caseScenarios = scenarios.filter(s => s.mode === "crack-the-case");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentScenario = caseScenarios[currentIndex];

  const handleSubmit = () => {
    const answer = userAnswer.toLowerCase().trim();
    const correct = currentScenario.correctAnswer.toLowerCase();
    
    const matches = answer.includes(correct) || correct.includes(answer);
    
    setIsCorrect(matches);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < caseScenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setShowResult(false);
      setIsCorrect(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setUserAnswer("");
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/train" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Training
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Crack the Case
            </h1>
            <p className="text-muted-foreground">
              Case {currentIndex + 1} of {caseScenarios.length}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-6">
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
                Historical Case Study
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                  {currentScenario.scenario}
                </p>
              </div>
            </div>

            {!showResult ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    What cognitive biases and logical fallacies were at play?
                  </label>
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Analyze the case and identify the key BFBAs..."
                    className="w-full min-h-[120px]"
                  />
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!userAnswer.trim()}
                  className="w-full"
                >
                  Reveal Analysis
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-6 rounded-lg border-2 ${
                  isCorrect 
                    ? 'bg-green-950/20 border-green-600' 
                    : 'bg-amber-950/20 border-amber-600'
                }`}>
                  <p className={`font-bold text-xl mb-2 ${
                    isCorrect ? 'text-green-400' : 'text-amber-400'
                  }`}>
                    {isCorrect ? '✓ Excellent analysis!' : '⚠ Partial - Review the full analysis below'}
                  </p>
                </div>

                <div className="bg-muted/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Expert Analysis
                  </h3>
                  <div 
                    className="text-muted-foreground leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentScenario.explanation }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  {currentIndex < caseScenarios.length - 1 ? (
                    <Button onClick={handleNext} className="w-full">
                      Next Case <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleReset} className="w-full">
                      <RotateCcw className="mr-2 w-4 h-4" /> Start Over
                    </Button>
                  )}
                  <Link to="/train" className="w-full">
                    <Button variant="outline" className="w-full">
                      Other Training
                    </Button>
                  </Link>
                  <Link to="/learn" className="w-full">
                    <Button variant="outline" className="w-full">
                      Study
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-center">
            {caseScenarios.map((_, idx) => (
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

export default CrackTheCase;
