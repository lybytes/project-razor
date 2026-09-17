import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";
import { consumePostAuthRedirect } from "@/lib/postAuthRedirect";
import { Turnstile, isTurnstileEnabled } from "@/components/Turnstile";
import { LegalModal, type LegalDoc } from "@/components/legal/LegalModal";

const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please re-enter your password"),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(30, "Name must be 30 characters or fewer")
      .regex(
        /^[A-Za-z0-9'’_\- ]+$/,
        "Name can only contain letters, numbers, spaces, hyphens, underscores, and apostrophes"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(() => searchParams.get("mode") === "signup");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null);
  // A prominent in-card message after a signup attempt. The corner toast is
  // easy to miss, and this is the one signal the user gets — signup always
  // returns the same neutral message whether the email is new or already
  // registered (anti-enumeration), so this must be clearly visible.
  const [notice, setNotice] = useState<string | null>(null);
  const navigate = useNavigate();
  const { hasSession, login, signup, requestPasswordReset } = useAuth();
  const signupStartedRef = useRef(false);

  // Turnstile tokens are single-use and short-lived. After any auth call the
  // token is spent, so re-mount the widget (new key) to mint a fresh one for
  // the next attempt — otherwise a retry sends a stale/empty token and
  // Supabase rejects it with "no captcha_token found".
  const resetCaptcha = () => {
    setCaptchaToken(null);
    setCaptchaKey((k) => k + 1);
  };

  // A confirmed new account lands back here via the email link, whose hash
  // carries type=signup. That is the only honest signal of a verified new
  // account — signup_completed is never inferred from an error-free signUp().
  useEffect(() => {
    if (window.location.hash.includes("type=signup")) {
      track({ name: "signup_completed" });
    }
  }, []);

  useEffect(() => {
    if (hasSession) {
      const target = consumePostAuthRedirect();
      navigate(target || "/account", { replace: true });
    }
  }, [hasSession, navigate]);

  // Fire once per signup attempt on the first deliberate form interaction.
  const markSignupStarted = () => {
    if (isSignUp && !signupStartedRef.current) {
      signupStartedRef.current = true;
      track({ name: "signup_started" });
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signUpSchema.safeParse({ email, password, confirmPassword, name });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    if (isTurnstileEnabled() && !captchaToken) {
      toast.error("Please complete the verification challenge.");
      return;
    }

    setLoading(true);

    try {
      const { session } = await signup(email, password, name, captchaToken ?? undefined);

      // With email confirmation enabled, Supabase intentionally returns the
      // same success response for both new signups and existing emails to avoid
      // leaking account existence. We can't distinguish them client-side.
      if (session) {
        // Email confirmation is disabled and a new account was created.
        await supabase.auth.signOut();
        toast.success("Account created — sign in to start training.");
        setNotice("Account created — sign in below to start training.");
      } else {
        const msg = "Check your inbox to confirm your account. If this email is already registered, sign in instead.";
        toast.success(msg, { duration: 10000 });
        setNotice(msg);
      }

      setIsSignUp(false);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      if (message.toLowerCase().includes("already registered") || message.toLowerCase().includes("user already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(message);
      }
    }

    if (isTurnstileEnabled()) resetCaptcha();
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setErrors({});

    const result = z.string().email().safeParse(email);
    if (!result.success) {
      setErrors({ email: "Enter your email first, then tap Forgot password" });
      return;
    }

    if (isTurnstileEnabled() && !captchaToken) {
      toast.error("Please complete the verification challenge.");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email, captchaToken ?? undefined);
      const msg = "If an account exists for that email, a reset link has been sent. Check your inbox.";
      toast.success(msg, { duration: 10000 });
      setNotice(msg);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't send the reset link");
    }
    if (isTurnstileEnabled()) resetCaptcha();
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signInSchema.safeParse({ email, password });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    if (isTurnstileEnabled() && !captchaToken) {
      toast.error("Please complete the verification challenge.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password, captchaToken ?? undefined);
      toast.success("Welcome back!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      if (message.includes("Invalid")) {
        toast.error("Invalid email or password. Please try again.");
      } else if (message.includes("Email not confirmed")) {
        toast.error("Please confirm your email before signing in.");
      } else {
        toast.error(message);
      }
    }

    if (isTurnstileEnabled()) resetCaptcha();
    setLoading(false);
  };

  const PasswordToggle = ({
    show,
    onClick,
  }: {
    show: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center h-11 w-11 text-muted-foreground hover:text-foreground transition-colors"
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 sm:mb-8 opacity-0 animate-fade-up">
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp
                ? "Join to track your reasoning progress"
                : "Sign in to continue your streak"}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-5 sm:p-8 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
            {notice && (
              <div
                role="status"
                className="mb-5 rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm text-foreground"
              >
                {notice}
              </div>
            )}
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { markSignupStarted(); setNotice(null); setEmail(e.target.value); }}
                  placeholder="you@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { markSignupStarted(); setPassword(e.target.value); }}
                    placeholder="••••••••"
                    className={errors.password ? "border-red-500 pr-11" : "pr-11"}
                  />
                  <PasswordToggle show={showPassword} onClick={() => setShowPassword(!showPassword)} />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="text-primary hover:underline text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              {isSignUp && (
                <>
                  <div>
                    <Label htmlFor="confirmPassword">Re-enter password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => { markSignupStarted(); setConfirmPassword(e.target.value); }}
                        placeholder="••••••••"
                        className={errors.confirmPassword ? "border-red-500 pr-11" : "pr-11"}
                      />
                      <PasswordToggle
                        show={showConfirmPassword}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => { markSignupStarted(); setName(e.target.value); }}
                      placeholder="Your name"
                      maxLength={30}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                </>
              )}

              {isTurnstileEnabled() && <Turnstile key={captchaKey} onToken={setCaptchaToken} />}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>

              {isSignUp && (
                <p className="text-xs text-muted-foreground text-center">
                  By creating an account you agree to our{" "}
                  <button type="button" onClick={() => setLegalDoc("terms")} className="text-primary hover:underline">Terms</button>{" "}
                  and{" "}
                  <button type="button" onClick={() => setLegalDoc("privacy")} className="text-primary hover:underline">Privacy Policy</button>.
                </p>
              )}
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                  setNotice(null);
                  signupStartedRef.current = false;
                }}
                className="text-primary hover:underline text-sm"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <LegalModal doc={legalDoc} onOpenChange={(open) => { if (!open) setLegalDoc(null); }} />
    </div>
  );
};

export default Auth;
