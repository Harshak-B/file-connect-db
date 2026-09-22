import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const searchSchema = z.object({
  mode: z.enum(["login", "signup"]).default("login"),
  role: z.enum(["brand", "creator"]).default("creator"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Log in or join Beam" },
      {
        name: "description",
        content: "Create your Beam account as a brand or a creator, or log back into your board.",
      },
      { property: "og:title", content: "Log in or join Beam" },
      {
        property: "og:description",
        content: "Create a Beam account as a brand or creator and start matching.",
      },
    ],
  }),
  component: AuthPage,
});

const credentialsSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(72),
});

function AuthPage() {
  const { mode, role } = Route.useSearch();
  const navigate = useNavigate();
  const isSignup = mode === "signup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pickedRole, setPickedRole] = useState<"brand" | "creator">(role);
  const [busy, setBusy] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => setPickedRole(role), [role]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setBusy(true);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              role: pickedRole,
              display_name: name.trim() || parsed.data.email.split("@")[0],
              ...(pickedRole === "brand" ? { company_name: name.trim() } : {}),
            },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setConfirmSent(true);
          return;
        }
        toast.success("Account created");
        navigate({ to: "/dashboard", replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Try email instead.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-5 py-14 sm:px-8">
        <h1 className="text-3xl sm:text-4xl">
          {isSignup ? (
            <>
              Join <span className="text-editorial-italic text-primary">Beam.</span>
            </>
          ) : (
            "Welcome back."
          )}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {isSignup
            ? "Two fields now, a two-minute onboarding next."
            : "Log in to your campaigns and applications."}
        </p>

        {confirmSent ? (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-border bg-card p-6 text-sm shadow-[var(--shadow-lift)]"
          >
            <p className="font-semibold text-foreground">Check your email</p>
            <p className="mt-2 text-muted-foreground">
              We sent a confirmation link to {email}. Click it to activate your account, then come
              back and log in.
            </p>
            <Button
              variant="heroOutline"
              size="pill"
              className="mt-5 w-full"
              onClick={() => {
                setConfirmSent(false);
                navigate({ to: "/auth", search: { mode: "login", role: pickedRole } });
              }}
            >
              Back to log in
            </Button>
          </div>
        ) : (
          <>
            {isSignup ? (
              <fieldset className="mt-8">
                <legend className="text-sm font-semibold">I'm joining as</legend>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {(["creator", "brand"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={pickedRole === option}
                      onClick={() => setPickedRole(option)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition-colors ${
                        pickedRole === option
                          ? "border-primary bg-primary/15 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
              {isSignup ? (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">
                    {pickedRole === "brand" ? "Company name" : "Display name"}
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    maxLength={80}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={pickedRole === "brand" ? "Northloop Coffee" : "Luna Skies"}
                  />
                </div>
              ) : null}

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(errors["email"])}
                  aria-describedby={errors["email"] ? "email-error" : undefined}
                  required
                />
                {errors["email"] ? (
                  <p id="email-error" className="text-sm text-destructive">
                    {errors["email"]}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={Boolean(errors["password"])}
                  aria-describedby={errors["password"] ? "password-error" : undefined}
                  required
                />
                {errors["password"] ? (
                  <p id="password-error" className="text-sm text-destructive">
                    {errors["password"]}
                  </p>
                ) : null}
              </div>

              <Button type="submit" variant="hero" size="pill" disabled={busy} className="mt-2">
                {busy ? <Loader2 className="animate-spin" /> : null}
                {isSignup ? "Create account" : "Log in"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button variant="heroOutline" size="pill" onClick={handleGoogle} disabled={busy}>
              Continue with Google
            </Button>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {isSignup ? "Already have an account? " : "New to Beam? "}
              <Link
                to="/auth"
                search={{ mode: isSignup ? "login" : "signup", role: pickedRole }}
                className="font-semibold text-primary hover:underline"
              >
                {isSignup ? "Log in" : "Create one"}
              </Link>
            </p>
          </>
        )}
      </main>
    </div>
  );
}
