import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import scenarios from "@/data/scenarios.json";
import { ArrowRight } from "lucide-react";
import { formatBoldText } from "@/lib/formatText";

const RapidReasoning = () => {
  const rapidScenarios = scenarios.filter(s => s.mode === "rapid-reasoning");
  
  // Track which scenarios have been seen to avoid immediate repeats
  const [seenIndices, setSeenIndices] = useState<number[]>([]);
  
  // Get a random scenario index that hasn't been seen recently
  const getRandomIndex = () => {
    const availableIndices = rapidScenarios
      .map((_, idx) => idx)
      .filter(idx => !seenIndices.includes(idx));
    
    // If all have been seen, reset and pick from all
    if (availableIndices.length === 0) {
      return Math.floor(Math.random() * rapidScenarios.length);
    }
    
    return availableIndices[Math.floor(Math.random() * availableIndices.length)];
  };

  const [currentIndex, setCurrentIndex] = useState(() => 
    Math.floor(Math.random() * rapidScenarios.length)
  );
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
    // Mark current as seen
    setSeenIndices(prev => {
      const updated = [...prev, currentIndex];
      // Keep only last N to allow cycling back eventually
      if (updated.length >= rapidScenarios.length) {
        return updated.slice(-Math.floor(rapidScenarios.length / 2));
      }
      return updated;
    });
    
    // Get next random index
    const nextIndex = getRandomIndex();
    setCurrentIndex(nextIndex);
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
                    className="text-foreground leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatBoldText(currentScenario.explanation) }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  <Button onClick={handleNext} className="w-full">
                    Continue Playing <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
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
        </div>
      </main>
    </div>
  );
};

export default RapidReasoning;
