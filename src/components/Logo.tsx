import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/" className={cn("inline-flex items-center group", className)}>
      <span className="flex flex-col leading-none">
        <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-primary">Project</span>
        <span className="font-display uppercase text-2xl tracking-tight -mt-1">Razor</span>
      </span>
    </Link>
  );
};
