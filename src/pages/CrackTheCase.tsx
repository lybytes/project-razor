import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import scenarios from "@/data/scenarios.json";
import { ArrowRight } from "lucide-react";
import { formatBoldText } from "@/lib/formatText";

const CrackTheCase = () => {
  const caseScenarios = scenarios.filter(s => s.mode === "crack-the-case");
  
  // Track which scenarios have been seen to avoid immediate repeats
  const [seenIndices, setSeenIndices] = useState<number[]>([]);
  
  // Get a random scenario index that hasn't been seen recently
  const getRandomIndex = () => {
    const availableIndices = caseScenarios
      .map((_, idx) => idx)
      .filter(idx => !seenIndices.includes(idx));
    
    // If all have been seen, reset and pick from all
    if (availableIndices.length === 0) {
      return Math.floor(Math.random() * caseScenarios.length);
    }
    
    return availableIndices[Math.floor(Math.random() * availableIndices.length)];
  };

  const [currentIndex, setCurrentIndex] = useState(() => 
    Math.floor(Math.random() * caseScenarios.length)
  );
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
    // Mark current as seen
    setSeenIndices(prev => {
      const updated = [...prev, currentIndex];
      // Keep only last N to allow cycling back eventually
      if (updated.length >= caseScenarios.length) {
        return updated.slice(-Math.floor(caseScenarios.length / 2));
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/train" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Training
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Crack the Case
            </h1>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-6">
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
                Historical Case Study
              </h2>
              <div className="prose prose-invert max-w-none">
                <p 
                  className="text-base text-foreground leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: formatBoldText(currentScenario.scenario) }}
                />
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
                    className="text-foreground leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatBoldText(currentScenario.explanation) }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  <Button onClick={handleNext} className="w-full">
                    Next Case <ArrowRight className="ml-2 w-4 h-4" />
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

export default CrackTheCase;