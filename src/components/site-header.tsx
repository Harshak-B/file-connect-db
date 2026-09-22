import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/for-brands", label: "For brands" },
  { to: "/for-creators", label: "For creators" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          Beam<span className="text-primary">.</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-sm text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="h-10 w-40 animate-pulse rounded-full bg-muted" aria-hidden />
          ) : user ? (
            <>
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="cream" size="default" className="h-10 px-5" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/auth" search={{ mode: "login" }}>
                  Log in
                </Link>
              </Button>
              <Button asChild variant="cream" className="h-10 px-5">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Get started
                </Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-surface px-5 py-5 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base text-foreground/90 hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            {user ? (
              <>
                <Button asChild variant="hero" size="pill">
                  <Link to="/dashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
                <Button variant="heroOutline" size="pill" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="hero" size="pill">
                  <Link to="/auth" search={{ mode: "signup" }} onClick={() => setOpen(false)}>
                    Get started
                  </Link>
                </Button>
                <Button asChild variant="heroOutline" size="pill">
                  <Link to="/auth" search={{ mode: "login" }} onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
