import type { MotionValue } from "motion/react";
import { motion, useSpring, useTransform } from "motion/react";

interface StarNode {
  id: number;
  x: number;
  y: number;
  primary: boolean;
}

const rng = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
};

const next = rng(42);

const constellationNodes: StarNode[] = Array.from({ length: 72 }, (_, i) => ({
  id: i,
  x: 24 + next() * 1392,
  y: 24 + next() * 852,
  primary: next() > 0.86,
}));

const Constellation = () => {
  const connections: [number, number][] = [];
  for (let i = 0; i < constellationNodes.length; i++) {
    for (let j = i + 1; j < constellationNodes.length; j++) {
      const a = constellationNodes[i];
      const b = constellationNodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= 155) {
        connections.push([i, j]);
      }
    }
  }

  // Pick a fixed subset of connections to animate as moving pulses.
  const threadConnections = connections.filter((_, idx) => idx % 5 === 0).slice(0, 30);

  return (
    <g>
      {/* Static constellation threads */}
      <g className="text-foreground/[0.1]" filter="url(#star-glow)">
        {connections
          .filter(([i, j]) => !threadConnections.some(([ti, tj]) => (ti === i && tj === j) || (ti === j && tj === i)))
          .map(([i, j]) => {
            const a = constellationNodes[i];
            const b = constellationNodes[j];
            return (
              <path
                key={`${a.id}-${b.id}`}
                d={`M${a.x} ${a.y} L${b.x} ${b.y}`}
                stroke="currentColor"
                strokeWidth="0.75"
                fill="none"
              />
            );
          })}
      </g>

      {/* Moving signal threads */}
      <g className="text-primary/55" filter="url(#star-glow)">
        {threadConnections.map(([i, j], idx) => {
          const a = constellationNodes[i];
          const b = constellationNodes[j];
          const speedClass = ["hero-thread", "hero-thread-slow", "hero-thread-reverse"][idx % 3];
          return (
            <path
              key={`thread-${a.id}-${b.id}`}
              d={`M${a.x} ${a.y} L${b.x} ${b.y}`}
              stroke="currentColor"
              strokeWidth="1.25"
              fill="none"
              className={speedClass}
              strokeDasharray="4 7"
              style={{ animationDelay: `${idx * 0.25}s` }}
            />
          );
        })}
      </g>

      {/* Stars */}
      {constellationNodes.map((node, idx) => (
        <circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r={node.primary ? 2.25 : 1.25}
          fill="currentColor"
          className={`hero-node ${node.primary ? "text-primary/90" : "text-foreground/70"}`}
          style={{ animationDelay: `${idx * 0.08}s` }}
          filter="url(#star-glow)"
        />
      ))}
    </g>
  );
};

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

      {/* Neural network / brain motif */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="star-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <Constellation />
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
