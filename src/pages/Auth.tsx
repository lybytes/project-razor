import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { hasSession, login, signup, requestPasswordReset } = useAuth();

  useEffect(() => {
    if (hasSession) {
      navigate("/account");
    }
  }, [hasSession, navigate]);

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

    setLoading(true);

    try {
      const { session } = await signup(email, password, name);

      // With email confirmation enabled, Supabase intentionally returns the
      // same success response for both new signups and existing emails to avoid
      // leaking account existence. We can't distinguish them client-side.
      if (session) {
        // Email confirmation is disabled and a new account was created.
        await supabase.auth.signOut();
        toast.success("Account created — sign in to start training.");
      } else {
        toast.success("If this email isn't already registered, a confirmation link has been sent.");
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

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setErrors({});

    const result = z.string().email().safeParse(email);
    if (!result.success) {
      setErrors({ email: "Enter your email first, then tap Forgot password" });
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      toast.success("Reset link sent — check your inbox.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't send the reset link");
    }
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

    setLoading(true);

    try {
      await login(email, password);
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
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <PasswordToggle show={showPassword} onClick={() => setShowPassword(!showPassword)} />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-primary hover:underline text-sm mt-2"
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
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
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
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      maxLength={30}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
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
    </div>
  );
};

export default Auth;
