import type { ReactNode } from "react";
import { AmbientBackground } from "@/components/AmbientBackground";

export const PageShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <AmbientBackground />
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};
