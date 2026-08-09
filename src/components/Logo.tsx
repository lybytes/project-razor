import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2 group", className)}>
      <svg
        viewBox="0 0 152 32"
        fill="none"
        className="h-7 w-auto"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M2 30L18 2L34 30"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
        <text
          x="44"
          y="12"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="9"
          fontWeight="500"
          letterSpacing="0.12em"
          fill="currentColor"
          className="opacity-60"
        >
          PROJECT
        </text>
        <text
          x="44"
          y="28"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="22"
          fontWeight="700"
          letterSpacing="-0.02em"
          fill="currentColor"
        >
          Razor
        </text>
      </svg>
    </Link>
  );
};
