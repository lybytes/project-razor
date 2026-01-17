import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  age: z.number().min(13, "You must be at least 13 years old").max(120, "Please enter a valid age").optional(),
  role: z.string().max(50, "Role must be less than 50 characters").optional(),
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
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signUpSchema.safeParse({
      email,
      password,
      name,
      age: age ? parseInt(age) : undefined,
      role: role || undefined,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(error.message);
      }
      setLoading(false);
      return;
    }

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: data.user.id,
        name,
        age: age ? parseInt(age) : null,
        role: role || null,
      });

      if (profileError) {
        toast.error("Error creating profile. Please try again.");
        setLoading(false);
        return;
      }

      // Create streak record
      await supabase.from("streaks").insert({
        user_id: data.user.id,
        current_streak: 0,
        longest_streak: 0,
      });

      toast.success("Account created successfully!");
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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Welcome back!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 opacity-0 animate-fade-up">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp 
                ? "Join to track your reasoning progress" 
                : "Sign in to continue your streak"}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
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
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {isSignUp && (
                <>
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="age">Age (optional)</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="25"
                      className={errors.age ? "border-red-500" : ""}
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                  </div>

                  <div>
                    <Label htmlFor="role">Role (optional)</Label>
                    <Input
                      id="role"
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Student, Teacher, Professional..."
                    />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
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
