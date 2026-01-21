import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import scenarios from "@/data/scenarios.json";
import { Heart, Repeat2 } from "lucide-react";
import { formatBoldText } from "@/lib/formatText";
import { useStreak } from "@/hooks/useStreak";
import { useAuth } from "@/hooks/useAuth";

const SocialWarzone = () => {
  const socialScenarios = scenarios.filter((s) => s.mode === "social-warzone");
  const { recordActivity } = useStreak();
  const { user } = useAuth();
  
  // Track which scenarios have been seen to avoid immediate repeats
  const [seenIndices, setSeenIndices] = useState<number[]>([]);
  const [hasRecordedToday, setHasRecordedToday] = useState(false);
  
  // Get a random scenario index that hasn't been seen recently
  const getRandomIndex = () => {
    const availableIndices = socialScenarios
      .map((_, idx) => idx)
      .filter(idx => !seenIndices.includes(idx));
    
    // If all have been seen, reset and pick from all
    if (availableIndices.length === 0) {
      return Math.floor(Math.random() * socialScenarios.length);
    }
    
    return availableIndices[Math.floor(Math.random() * availableIndices.length)];
  };

  const [currentIndex, setCurrentIndex] = useState(() => 
    Math.floor(Math.random() * socialScenarios.length)
  );
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentScenario = socialScenarios[currentIndex];

  const handleSubmit = async () => {
    const answer = userAnswer.toLowerCase().trim();
    const correct = currentScenario.correctAnswer.toLowerCase();

    const matches = answer.includes(correct) || correct.includes(answer);

    setIsCorrect(matches);
    setShowResult(true);

    // Record streak activity on first game completion of the day
    if (user && !hasRecordedToday) {
      await recordActivity("social-warzone");
      setHasRecordedToday(true);
    }
  };

  const handleNext = () => {
    // Mark current as seen
    setSeenIndices(prev => {
      const updated = [...prev, currentIndex];
      // Keep only last N to allow cycling back eventually
      if (updated.length >= socialScenarios.length) {
        return updated.slice(-Math.floor(socialScenarios.length / 2));
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link to="/train" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Training
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">Social Warzone</h1>
          </div>

          {!showResult && (
            <>
              {/* Case study title outside box */}
              {currentScenario.context && (
                <h2 className="text-2xl font-bold text-foreground mb-4">{currentScenario.context.title}</h2>
              )}

              {/* Context section */}
              {currentScenario.context && (
                <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      This is an excerpt from a recent {currentScenario.context.source} article titled "{currentScenario.context.articleTitle}"
                    </p>

                    <div className="bg-muted/20 border border-border rounded-lg p-4">
                      <p className="text-foreground leading-relaxed whitespace-pre-line text-sm">
                        {currentScenario.context.content}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Post section with preface */}
              <p className="text-muted-foreground mb-4 text-sm italic">
                The following comment was made in response to a Reddit thread about the article:
              </p>

              <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
                <div className="p-6 bg-muted/20">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {currentScenario.post.author.substring(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{currentScenario.post.author}</div>
                      <div className="text-sm text-muted-foreground">15d</div>
                    </div>
                  </div>

                  <p className="text-foreground leading-relaxed mb-4">{currentScenario.post.content}</p>

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

              {/* Answer input in separate styled box */}
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-6">
                <p className="text-primary font-semibold mb-4 text-lg">
                  What BFBA is being used here?
                </p>
                <Input
                  type="text"
                  placeholder="Type your answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="mb-4 bg-background/80 border-border/50 focus:border-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                />
                <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity" size="lg">
                  Reveal Answer
                </Button>
              </div>
            </>
          )}

          {showResult && (
            <div className="space-y-6">
              {/* Feedback */}
              <div className={`p-6 rounded-lg border-2 ${
                isCorrect 
                  ? 'bg-green-950/20 border-green-600' 
                  : 'bg-red-950/20 border-red-600'
              }`}>
                <p className={`font-bold text-xl ${
                  isCorrect ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isCorrect ? '✓ Well done, that is correct!' : '✗ That\'s not quite right.'}
                </p>
              </div>

              {/* Answer and Explanation */}
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Answer</strong>
                </p>
                <p className="text-foreground text-lg mb-4">
                  The <strong>{currentScenario.correctAnswer}</strong>
                </p>
              <div
                className="text-foreground leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formatBoldText(currentScenario.explanation) }}
              />
              </div>

              {/* Navigation buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button onClick={handleNext} className="w-full" size="lg">
                  Continue Playing
                </Button>
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
      </main>
    </div>
  );
};

export default SocialWarzone;
