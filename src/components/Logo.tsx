import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/" className={cn("inline-flex items-center group", className)}>
      <span className="flex flex-col leading-none">
        <span className="text-[9px] font-medium tracking-[0.12em] uppercase opacity-60">Project</span>
        <span className="text-xl font-bold tracking-tight -mt-0.5">Razor</span>
      </span>
    </Link>
  );
};
