import type { MotionValue } from "motion/react";
import { motion, useSpring, useTransform } from "motion/react";

interface HeroBackgroundProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

export const HeroBackground = ({ mouseX, mouseY }: HeroBackgroundProps) => {
  const springConfig = { stiffness: 180, damping: 20, mass: 0.15 };
  const spotX = useSpring(mouseX, springConfig);
  const spotY = useSpring(mouseY, springConfig);
  const lightX = useTransform(spotX, (v) => v - 300);
  const lightY = useTransform(spotY, (v) => v - 300);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Drifting color orbs */}
      <div className="hero-orb-primary" style={{ top: "-20%", right: "-15%" }} />
      <div className="hero-orb-accent" style={{ bottom: "-15%", left: "-15%" }} />
      <div className="hero-orb-core" style={{ top: "25%", left: "45%" }} />

      {/* Subtle grid */}
      <div className="hero-grid" />

      {/* Argument network */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* Static structure — faint white */}
        <g className="text-foreground/[0.12]">
          <path d="M260 240 L360 180" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M360 180 L460 280" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M300 360 L440 400" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M980 200 L1080 140" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M1220 180 L1180 300" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M1180 300 L1040 320" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M1100 620 L1220 660" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M1280 760 L1160 800" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M1160 800 L1060 720" stroke="currentColor" strokeWidth="1" fill="none" />
          <circle cx="260" cy="240" r="2.5" fill="currentColor" className="hero-node" style={{ animationDelay: "0.6s" }} />
          <circle cx="360" cy="180" r="2" fill="currentColor" className="hero-node" style={{ animationDelay: "0.8s" }} />
          <circle cx="460" cy="280" r="2.5" fill="currentColor" className="hero-node" style={{ animationDelay: "1s" }} />
          <circle cx="300" cy="360" r="1.5" fill="currentColor" className="hero-node" style={{ animationDelay: "1.2s" }} />
          <circle cx="440" cy="400" r="2" fill="currentColor" className="hero-node" style={{ animationDelay: "0.7s" }} />
          <circle cx="980" cy="200" r="2" fill="currentColor" className="hero-node" style={{ animationDelay: "1.1s" }} />
          <circle cx="1080" cy="140" r="2.5" fill="currentColor" className="hero-node" style={{ animationDelay: "0.9s" }} />
          <circle cx="1220" cy="180" r="1.5" fill="currentColor" className="hero-node" style={{ animationDelay: "1.3s" }} />
          <circle cx="1180" cy="300" r="2" fill="currentColor" className="hero-node" style={{ animationDelay: "1.5s" }} />
          <circle cx="1040" cy="320" r="1.5" fill="currentColor" className="hero-node" style={{ animationDelay: "1.4s" }} />
          <circle cx="1100" cy="620" r="2.5" fill="currentColor" className="hero-node" style={{ animationDelay: "1.6s" }} />
          <circle cx="1220" cy="660" r="1.5" fill="currentColor" className="hero-node" style={{ animationDelay: "1.8s" }} />
          <circle cx="1280" cy="760" r="2" fill="currentColor" className="hero-node" style={{ animationDelay: "2s" }} />
          <circle cx="1160" cy="800" r="2.5" fill="currentColor" className="hero-node" style={{ animationDelay: "1.7s" }} />
          <circle cx="1060" cy="720" r="1.5" fill="currentColor" className="hero-node" style={{ animationDelay: "1.9s" }} />
        </g>

        {/* Moving threads — purple to make them visible */}
        <g className="text-primary/50">
          <path d="M260 240 L300 360" stroke="currentColor" strokeWidth="1.5" fill="none" className="hero-thread-slow" strokeDasharray="3 3" />
          <path d="M460 280 L440 400" stroke="currentColor" strokeWidth="1.5" fill="none" className="hero-thread-slow" strokeDasharray="3 3" />
          <path d="M1080 140 L1220 180" stroke="currentColor" strokeWidth="1.5" fill="none" className="hero-thread-slow" strokeDasharray="3 3" />
          <path d="M1040 320 L980 200" stroke="currentColor" strokeWidth="1.5" fill="none" className="hero-thread-slow" strokeDasharray="3 3" />
          <path d="M1220 660 L1280 760" stroke="currentColor" strokeWidth="1.5" fill="none" className="hero-thread-slow" strokeDasharray="3 3" />
          <path d="M1060 720 L1100 620" stroke="currentColor" strokeWidth="1.5" fill="none" className="hero-thread-slow" strokeDasharray="3 3" />
          <path d="M440 400 L980 200" stroke="currentColor" strokeWidth="1.5" fill="none" className="hero-thread" strokeDasharray="4 6" />
          <path d="M1040 320 L1100 620" stroke="currentColor" strokeWidth="1.5" fill="none" className="hero-thread" strokeDasharray="4 6" />
          <path d="M260 240 L1080 140" stroke="currentColor" strokeWidth="1.5" fill="none" className="hero-thread-reverse" strokeDasharray="5 7" />
          <path d="M460 280 L1160 800" stroke="currentColor" strokeWidth="1.5" fill="none" className="hero-thread" strokeDasharray="4 6" />
        </g>

        {/* Deeper background threads */}
        <g className="text-foreground/[0.06]">
          <path d="M180 180 C 420 80, 900 40, 1280 160" stroke="currentColor" strokeWidth="0.5" fill="none" className="hero-thread-slow" strokeDasharray="8 10" />
          <path d="M80 600 C 300 500, 600 850, 1360 720" stroke="currentColor" strokeWidth="0.5" fill="none" className="hero-thread-slow" strokeDasharray="8 10" style={{ animationDelay: "4s" }} />
        </g>
      </svg>

      {/* Cursor spotlight */}
      <motion.div
        className="absolute top-0 left-0 rounded-full pointer-events-none"
        style={{
          x: lightX,
          y: lightY,
          width: 600,
          height: 600,
          background: "radial-gradient(circle, hsl(var(--primary) / 0.22) 0%, hsl(var(--accent) / 0.08) 40%, transparent 70%)",
          filter: "blur(60px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Bottom fade so the next section doesn't clash */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
