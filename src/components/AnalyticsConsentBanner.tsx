import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getAnalyticsConsent,
  isAnalyticsConfigured,
  setAnalyticsConsent,
} from "@/lib/analytics";

export const AnalyticsConsentBanner = () => {
  const [decided, setDecided] = useState(() => getAnalyticsConsent() !== null);

  if (!isAnalyticsConfigured() || decided) return null;

  const decide = (granted: boolean) => {
    setAnalyticsConsent(granted);
    setDecided(true);
  };

  return (
    <div
      role="dialog"
      aria-label="Analytics consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur px-4 py-4 sm:py-5"
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <p className="text-sm text-muted-foreground flex-1">
          We use privacy-respecting product analytics to understand how people move through the course.
          No session recording, no ad tracking. You can decline and still use Project Razor.
        </p>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none h-11 px-4"
            onClick={() => decide(false)}
          >
            Decline
          </Button>
          <Button
            size="sm"
            className="flex-1 sm:flex-none h-11 px-4"
            onClick={() => decide(true)}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};
