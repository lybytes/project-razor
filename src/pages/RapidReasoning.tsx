import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import scenarios from "@/data/scenarios.json";
import { ArrowRight, RotateCcw } from "lucide-react";

const RapidReasoning = () => {
  const rapidScenarios = scenarios.filter(s => s.mode === "rapid-reasoning");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentScenario = rapidScenarios[currentIndex];

  const handleSubmit = () => {
    const answer = userAnswer.toLowerCase().trim();
    const correct = currentScenario.correctAnswer.toLowerCase();
    
    // Check for exact match or partial match
    const matches = answer.includes(correct) || correct.includes(answer);
    
    setIsCorrect(matches);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < rapidScenarios.length - 1) {
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to="/train" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Training
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Rapid Reasoning
            </h1>
            <p className="text-muted-foreground">
              Scenario {currentIndex + 1} of {rapidScenarios.length}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-6">
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
                Scenario
              </h2>
              <p className="text-lg text-foreground leading-relaxed">
                {currentScenario.scenario}
              </p>
            </div>

            {!showResult ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    What BFBA is being used here?
                  </label>
                  <Input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Enter your answer..."
                    className="w-full"
                  />
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!userAnswer.trim()}
                  className="w-full"
                >
                  Reveal Answer
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-6 rounded-lg border-2 ${
                  isCorrect 
                    ? 'bg-green-950/20 border-green-600' 
                    : 'bg-red-950/20 border-red-600'
                }`}>
                  <p className={`font-bold text-xl mb-2 ${
                    isCorrect ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isCorrect ? '✓ Well done, that is correct!' : '✗ That\'s not quite right.'}
                  </p>
                </div>

                <div className="bg-muted/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Explanation
                  </h3>
                  <div 
                    className="text-muted-foreground leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentScenario.explanation }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  {currentIndex < rapidScenarios.length - 1 ? (
                    <Button onClick={handleNext} className="w-full">
                      Continue Playing <ArrowRight className="ml-2 w-4 h-4" />
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
            {rapidScenarios.map((_, idx) => (
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

export default RapidReasoning;
