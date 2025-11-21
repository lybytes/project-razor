import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Brain, BookOpen, Info, FileText } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">R</span>
            </div>
            <span className="text-xl font-bold">Project Razor</span>
          </Link>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/"><Home className="h-4 w-4 mr-2" />Home</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/train"><Brain className="h-4 w-4 mr-2" />Train</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/learn"><BookOpen className="h-4 w-4 mr-2" />Learn</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/about"><Info className="h-4 w-4 mr-2" />About</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/blog"><FileText className="h-4 w-4 mr-2" />Blog</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
