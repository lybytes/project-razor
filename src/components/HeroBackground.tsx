import type { MotionValue } from "motion/react";
import { motion, useSpring, useTransform } from "motion/react";

interface NeuralNode {
  id: string;
  x: number;
  y: number;
  primary?: boolean;
}

const nodes: NeuralNode[] = [
  // left hemisphere
  { id: "l1", x: 1000, y: 240 },
  { id: "l2", x: 1060, y: 200, primary: true },
  { id: "l3", x: 1030, y: 290 },
  { id: "l4", x: 1080, y: 260 },
  { id: "l5", x: 1010, y: 370 },
  { id: "l6", x: 1070, y: 390, primary: true },
  { id: "l7", x: 1040, y: 460 },
  { id: "l8", x: 970, y: 440 },
  // right hemisphere
  { id: "r1", x: 1220, y: 240 },
  { id: "r2", x: 1280, y: 200, primary: true },
  { id: "r3", x: 1250, y: 290 },
  { id: "r4", x: 1200, y: 260 },
  { id: "r5", x: 1280, y: 370 },
  { id: "r6", x: 1220, y: 390, primary: true },
  { id: "r7", x: 1250, y: 460 },
  { id: "r8", x: 1300, y: 440 },
  // bridge
  { id: "b1", x: 1130, y: 270, primary: true },
  { id: "b2", x: 1140, y: 330, primary: true },
  { id: "b3", x: 1130, y: 400, primary: true },
  // stem
  { id: "s1", x: 1110, y: 510 },
  { id: "s2", x: 1160, y: 540 },
  { id: "s3", x: 1210, y: 510 },
  { id: "s4", x: 1130, y: 600 },
  { id: "s5", x: 1190, y: 620 },
  { id: "s6", x: 1160, y: 670 },
  // outer accents
  { id: "o1", x: 940, y: 310 },
  { id: "o2", x: 1320, y: 310 },
  { id: "o3", x: 1090, y: 700 },
  { id: "o4", x: 1230, y: 700 },
];

const cluster = (id: string) => id[0];

const BrainNetwork = () => {
  const connections: [number, number, number][] = [];
  const threadConnections: [number, number][] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= 170) {
        connections.push([i, j, dist]);
      } else if (dist <= 260 && cluster(a.id) !== cluster(b.id)) {
        connections.push([i, j, dist]);
        threadConnections.push([i, j]);
      }
    }
  }

  // Pick a fixed subset of long-range cross-hemisphere threads.
  const visibleThreads = threadConnections.filter((_, idx) => idx % 2 === 0).slice(0, 14);

  return (
    <g>
      {/* Static synapse web */}
      <g className="text-foreground/[0.12]" filter="url(#synapse-glow)">
        {connections.map(([i, j]) => {
          const a = nodes[i];
          const b = nodes[j];
          const isThread = visibleThreads.some(([ti, tj]) => (ti === i && tj === j) || (ti === j && tj === i));
          if (isThread) return null;
          return (
            <path
              key={`${a.id}-${b.id}`}
              d={`M${a.x} ${a.y} L${b.x} ${b.y}`}
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          );
        })}
      </g>

      {/* Moving signal threads */}
      <g className="text-primary/60" filter="url(#synapse-glow)">
        {visibleThreads.map(([i, j], idx) => {
          const a = nodes[i];
          const b = nodes[j];
          const speed = ["hero-thread", "hero-thread-slow", "hero-thread-reverse"][idx % 3];
          return (
            <path
              key={`thread-${a.id}-${b.id}`}
              d={`M${a.x} ${a.y} L${b.x} ${b.y}`}
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              className={speed}
              strokeDasharray="4 6"
              style={{ animationDelay: `${idx * 0.4}s` }}
            />
          );
        })}
      </g>

      {/* Nodes */}
      {nodes.map((node, idx) => (
        <circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r={node.primary ? 3 : 2}
          fill="currentColor"
          className={`hero-node ${node.primary ? "text-primary/90" : "text-foreground/70"}`}
          style={{ animationDelay: `${idx * 0.12}s` }}
          filter="url(#synapse-glow)"
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
          <filter id="synapse-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft brain silhouette */}
        <g className="fill-foreground/[0.04]">
          <ellipse cx="1030" cy="360" rx="125" ry="185" />
          <ellipse cx="1250" cy="360" rx="125" ry="185" />
          <ellipse cx="1140" cy="570" rx="90" ry="115" />
        </g>

        <BrainNetwork />
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
