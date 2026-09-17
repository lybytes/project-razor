import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Project Razor
        </p>
        <nav className="flex items-center gap-6">
          <Link
            to="/about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors min-h-11 flex items-center"
          >
            About
          </Link>
          <Link
            to="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors min-h-11 flex items-center"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors min-h-11 flex items-center"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
};
