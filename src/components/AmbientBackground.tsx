import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

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

const next = rng(73);

const nodes: StarNode[] = Array.from({ length: 42 }, (_, i) => ({
  id: i,
  x: 24 + next() * 1392,
  y: 24 + next() * 852,
  primary: next() > 0.85,
}));

const connections: [number, number][] = [];
for (let i = 0; i < nodes.length; i++) {
  for (let j = i + 1; j < nodes.length; j++) {
    const a = nodes[i];
    const b = nodes[j];
    const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    if (dist <= 170) connections.push([i, j]);
  }
}

const pulseConnections = connections.filter((_, idx) => idx % 6 === 0).slice(0, 16);

export const AmbientBackground = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const setCenter = () => {
      mouseX.set(window.innerWidth / 2);
      mouseY.set(window.innerHeight / 2);
    };
    setCenter();

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("resize", setCenter);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", setCenter);
    };
  }, [mouseX, mouseY]);

  const springConfig = { stiffness: 180, damping: 22, mass: 0.18 };
  const spotX = useSpring(mouseX, springConfig);
  const spotY = useSpring(mouseY, springConfig);
  const lightX = useTransform(spotX, (v) => v - 300);
  const lightY = useTransform(spotY, (v) => v - 300);

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Drifting colour orbs */}
      <div className="ambient-orb-primary" style={{ top: "-10%", right: "-10%" }} />
      <div className="ambient-orb-accent" style={{ bottom: "-15%", left: "-5%" }} />
      <div className="ambient-orb-core" style={{ top: "40%", left: "55%" }} />

      {/* Subtle grid */}
      <div className="ambient-grid" />

      {/* Constellation */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full text-foreground/[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="ambient-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#ambient-glow)">
          {connections
            .filter(([i, j]) => !pulseConnections.some(([pi, pj]) => (pi === i && pj === j) || (pi === j && pj === i)))
            .map(([i, j]) => {
              const a = nodes[i];
              const b = nodes[j];
              return (
                <path
                  key={`${a.id}-${b.id}`}
                  d={`M${a.x} ${a.y} L${b.x} ${b.y}`}
                  stroke="currentColor"
                  strokeWidth="0.6"
                  fill="none"
                />
              );
            })}

          {pulseConnections.map(([i, j], idx) => {
            const a = nodes[i];
            const b = nodes[j];
            const speedClass = ["ambient-thread", "ambient-thread-slow", "ambient-thread-reverse"][idx % 3];
            return (
              <path
                key={`pulse-${a.id}-${b.id}`}
                d={`M${a.x} ${a.y} L${b.x} ${b.y}`}
                stroke="hsl(var(--primary) / 0.45)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 8"
                className={speedClass}
                style={{ animationDelay: `${idx * 0.35}s` }}
              />
            );
          })}

          {nodes.map((node, idx) => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.primary ? 2 : 1.25}
              fill={node.primary ? "hsl(var(--primary) / 0.9)" : "currentColor"}
              className="ambient-node"
              style={{ animationDelay: `${idx * 0.1}s` }}
            />
          ))}
        </g>
      </svg>

      {/* Cursor spotlight */}
      <motion.div
        className="absolute top-0 left-0 rounded-full"
        style={{
          x: lightX,
          y: lightY,
          width: 600,
          height: 600,
          background: "radial-gradient(circle, hsl(var(--primary) / 0.16) 0%, hsl(var(--accent) / 0.06) 40%, transparent 70%)",
          filter: "blur(70px)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};
