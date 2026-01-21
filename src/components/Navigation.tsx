import { Link, useLocation } from "react-router-dom";
import { Home, Brain, BookOpen, Info, User, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NavItem = ({ to, icon: Icon, label, isActive }: { to: string; icon: React.ElementType; label: string; isActive: boolean }) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
      isActive 
        ? "bg-primary/15 text-primary" 
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    )}
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </Link>
);

export const Navigation = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
              <span className="text-lg font-bold text-primary-foreground">R</span>
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Project Razor
            </span>
          </Link>
          
          <div className="flex items-center gap-1 bg-muted/30 rounded-full p-1.5">
            <NavItem to="/" icon={Home} label="Home" isActive={isActive("/")} />
            <NavItem to="/train" icon={Brain} label="Train" isActive={isActive("/train")} />
            <NavItem to="/learn" icon={BookOpen} label="Learn" isActive={isActive("/learn")} />
            <NavItem to="/about" icon={Info} label="About" isActive={isActive("/about")} />
            {!loading && (
              user ? (
                <NavItem to="/account" icon={User} label="Account" isActive={isActive("/account")} />
              ) : (
                <Link 
                  to="/auth" 
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300 ml-1"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};