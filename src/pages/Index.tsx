import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Brain, BookOpen, Shield, Zap, Target, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-6 py-2 bg-destructive/20 border border-destructive rounded-full">
            <span className="text-destructive font-bold">⚠️ BEWARE OF BFBAs!</span>
          </div>
          <h1 className="mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Project Razor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Master the art of critical thinking. Learn to identify and refute Biases, Fallacies, and Bad-Faith Arguments.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
              <Link to="/train">Start Training</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/learn">Explore Library</Link>
            </Button>
          </div>
        </div>

        {/* BFBA Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 border-destructive/50 hover:border-destructive transition-colors">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-bold mb-2">B — Cognitive Biases</h3>
            <p className="text-muted-foreground mb-4">Mental shortcuts that lead to systematic errors in thinking</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/learn/cognitive-biases">Explore Biases</Link>
            </Button>
          </Card>

          <Card className="p-6 border-warning/50 hover:border-warning transition-colors">
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-xl font-bold mb-2">F — Logical Fallacies</h3>
            <p className="text-muted-foreground mb-4">Flaws in reasoning that undermine logical arguments</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/learn/logical-fallacies">Explore Fallacies</Link>
            </Button>
          </Card>

          <Card className="p-6 border-primary/50 hover:border-primary transition-colors">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-bold mb-2">BA — Bad-Faith Arguments</h3>
            <p className="text-muted-foreground mb-4">Manipulative tactics used to win without honest debate</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/learn/bad-faith-arguments">Explore Tactics</Link>
            </Button>
          </Card>
        </div>

        {/* Training Modes */}
        <div className="mb-16">
          <h2 className="text-center mb-10">Interactive Training Modes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card hover:bg-card/80 transition-colors">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Rapid Reasoning</h3>
              <p className="text-muted-foreground mb-4">Quick scenarios to sharpen your critical thinking reflexes</p>
              <Button asChild className="w-full">
                <Link to="/train/rapid-reasoning">Start</Link>
              </Button>
            </Card>

            <Card className="p-6 bg-card hover:bg-card/80 transition-colors">
              <Target className="h-12 w-12 text-warning mb-4" />
              <h3 className="text-xl font-bold mb-2">Crack the Case</h3>
              <p className="text-muted-foreground mb-4">Deep dive into real-world examples and historical cases</p>
              <Button asChild className="w-full">
                <Link to="/train/crack-the-case">Start</Link>
              </Button>
            </Card>

            <Card className="p-6 bg-card hover:bg-card/80 transition-colors">
              <TrendingUp className="h-12 w-12 text-success mb-4" />
              <h3 className="text-xl font-bold mb-2">Social Warzone</h3>
              <p className="text-muted-foreground mb-4">Navigate simulated social media and spot manipulation</p>
              <Button asChild className="w-full">
                <Link to="/train/social-warzone">Start</Link>
              </Button>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
          <Shield className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h2 className="mb-4">Build Disinformation Resilience</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            In a world of misinformation, critical thinking is your greatest defense. Start your journey today.
          </p>
          <Button size="lg" asChild>
            <Link to="/train">Begin Training</Link>
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default Index;
