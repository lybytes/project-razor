import { useEffect, useRef } from "react";

// Cloudflare Turnstile widget. Rendered only when a public site key is
// configured (VITE_TURNSTILE_SITE_KEY); the matching secret lives in
// Supabase's server-side auth config, which does the actual verification.
// When no site key is set the widget never mounts and auth flows behave
// exactly as before — so this is safe to ship dark and switch on later.

export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

export function isTurnstileEnabled(): boolean {
  return !!TURNSTILE_SITE_KEY;
}

interface TurnstileWindow extends Window {
  turnstile?: {
    render: (
      el: HTMLElement,
      opts: {
        sitekey: string;
        callback: (token: string) => void;
        "expired-callback"?: () => void;
        "error-callback"?: () => void;
        theme?: "auto" | "light" | "dark";
      }
    ) => string;
    remove: (id: string) => void;
    reset: (id?: string) => void;
  };
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as TurnstileWindow).turnstile) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Turnstile failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(script);
  });
}

interface TurnstileProps {
  onToken: (token: string | null) => void;
}

export const Turnstile = ({ onToken }: TurnstileProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        const w = window as TurnstileWindow;
        if (cancelled || !w.turnstile || !containerRef.current) return;
        widgetIdRef.current = w.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "auto",
          callback: (token) => onToken(token),
          "expired-callback": () => onToken(null),
          "error-callback": () => onToken(null),
        });
      })
      .catch(() => onToken(null));

    return () => {
      cancelled = true;
      const w = window as TurnstileWindow;
      if (widgetIdRef.current && w.turnstile) {
        w.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onToken]);

  if (!TURNSTILE_SITE_KEY) return null;

  return <div ref={containerRef} className="flex justify-center" />;
};
