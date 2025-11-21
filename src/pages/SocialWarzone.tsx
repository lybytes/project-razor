import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import scenarios from "@/data/scenarios.json";
import { ArrowRight, RotateCcw, Heart, Repeat2 } from "lucide-react";

const SocialWarzone = () => {
  const socialScenarios = scenarios.filter(s => s.mode === "social-warzone");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentScenario = socialScenarios[currentIndex];

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

          <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
            {/* Mock Social Media Post */}
            <div className="p-6 bg-muted/20">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {currentScenario.post.author.substring(1, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">
                    {currentScenario.post.author}
                  </div>
                  <div className="text-sm text-muted-foreground">2h ago</div>
                </div>
              </div>
              
              <p className="text-foreground leading-relaxed mb-4">
                {currentScenario.post.content}
              </p>

              <div className="flex gap-6 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{currentScenario.post.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Repeat2 className="w-4 h-4" />
                  <span>{currentScenario.post.retweets.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Answer Section */}
            <div className="p-6">
              {!showResult ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      What bad-faith tactic or BFBA is being used?
                    </label>
                    <Input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                      placeholder="Identify the tactic..."
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
                      {isCorrect ? '✓ Spotted it!' : '✗ Not quite - see below'}
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
                    {currentIndex < socialScenarios.length - 1 ? (
                      <Button onClick={handleNext} className="w-full">
                        Next Post <ArrowRight className="ml-2 w-4 h-4" />
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
          </div>

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
