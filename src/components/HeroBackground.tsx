export const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="orb-primary" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
          <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orb-accent" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.12" />
          <stop offset="60%" stopColor="hsl(var(--accent))" stopOpacity="0.04" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft color orbs */}
      <circle cx="1150" cy="220" r="380" fill="url(#orb-primary)" />
      <circle cx="220" cy="720" r="320" fill="url(#orb-accent)" />

      {/* Argument network — fine nodes and connecting lines */}
      <g className="text-foreground/[0.06]">
        {/* Top-left cluster */}
        <path d="M260 240 L360 180" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M360 180 L460 280" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M260 240 L300 360" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 3" />
        <path d="M300 360 L440 400" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M460 280 L440 400" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 3" />
        <circle cx="260" cy="240" r="3" fill="currentColor" />
        <circle cx="360" cy="180" r="2.5" fill="currentColor" />
        <circle cx="460" cy="280" r="3" fill="currentColor" />
        <circle cx="300" cy="360" r="2" fill="currentColor" />
        <circle cx="440" cy="400" r="2.5" fill="currentColor" />

        {/* Top-right cluster */}
        <path d="M980 200 L1080 140" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M1080 140 L1220 180" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 3" />
        <path d="M1220 180 L1180 300" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M1180 300 L1040 320" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M1040 320 L980 200" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 3" />
        <circle cx="980" cy="200" r="2.5" fill="currentColor" />
        <circle cx="1080" cy="140" r="3" fill="currentColor" />
        <circle cx="1220" cy="180" r="2" fill="currentColor" />
        <circle cx="1180" cy="300" r="2.5" fill="currentColor" />
        <circle cx="1040" cy="320" r="2" fill="currentColor" />

        {/* Bottom-right cluster */}
        <path d="M1100 620 L1220 660" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M1220 660 L1280 760" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 3" />
        <path d="M1280 760 L1160 800" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M1160 800 L1060 720" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M1060 720 L1100 620" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 3" />
        <circle cx="1100" cy="620" r="3" fill="currentColor" />
        <circle cx="1220" cy="660" r="2" fill="currentColor" />
        <circle cx="1280" cy="760" r="2.5" fill="currentColor" />
        <circle cx="1160" cy="800" r="3" fill="currentColor" />
        <circle cx="1060" cy="720" r="2" fill="currentColor" />

        {/* Cross-connections between clusters — a single broken link thread */}
        <path d="M440 400 L980 200" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 6" />
        <path d="M1040 320 L1100 620" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 6" />
      </g>
    </svg>

    {/* Bottom fade so the next section doesn't clash */}
    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
  </div>
);
