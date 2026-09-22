import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Beam board" },
      { name: "description", content: "Your Beam profile, onboarding and campaign board." },
    ],
  }),
  component: Dashboard,
});

type ProfileForm = {
  display_name: string;
  company_name: string;
  website: string;
  bio: string;
  category: string;
  primary_platform: string;
  location: string;
  follower_count: string;
  engagement_rate: string;
  min_rate: string;
};

const EMPTY: ProfileForm = {
  display_name: "",
  company_name: "",
  website: "",
  bio: "",
  category: "",
  primary_platform: "",
  location: "",
  follower_count: "",
  engagement_rate: "",
  min_rate: "",
};

const creatorSchema = z.object({
  display_name: z.string().trim().min(2, "Add your display name").max(80),
  category: z.string().trim().min(2, "Pick a category").max(60),
  primary_platform: z.string().trim().min(2, "Pick a platform").max(40),
  follower_count: z.coerce.number().int().min(0).max(1_000_000_000),
  engagement_rate: z.coerce.number().min(0).max(100),
  min_rate: z.coerce.number().int().min(0).max(100_000_000),
});

const brandSchema = z.object({
  company_name: z.string().trim().min(2, "Add your company name").max(80),
  website: z.string().trim().max(200).optional().or(z.literal("")),
});

function Dashboard() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Not signed in");

      const [{ data: profile, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user.id),
      ]);
      if (pErr) throw pErr;
      if (rErr) throw rErr;

      return {
        email: user.email ?? "",
        profile,
        role: (roles?.[0]?.role ?? "creator") as "brand" | "creator" | "admin",
      };
    },
  });

  useEffect(() => {
    if (!data?.profile) return;
    const p = data.profile;
    setForm({
      display_name: p.display_name ?? "",
      company_name: p.company_name ?? "",
      website: p.website ?? "",
      bio: p.bio ?? "",
      category: p.category ?? "",
      primary_platform: p.primary_platform ?? "",
      location: p.location ?? "",
      follower_count: p.follower_count?.toString() ?? "",
      engagement_rate: p.engagement_rate?.toString() ?? "",
      min_rate: p.min_rate?.toString() ?? "",
    });
  }, [data?.profile]);

  const save = useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Not signed in");

      const payload =
        data?.role === "brand"
          ? {
              company_name: form.company_name.trim(),
              display_name: form.company_name.trim(),
              website: form.website.trim() || null,
              bio: form.bio.trim() || null,
              location: form.location.trim() || null,
            }
          : {
              display_name: form.display_name.trim(),
              category: form.category.trim(),
              primary_platform: form.primary_platform.trim(),
              location: form.location.trim() || null,
              bio: form.bio.trim() || null,
              follower_count: Number(form.follower_count || 0),
              engagement_rate: Number(form.engagement_rate || 0),
              min_rate: Number(form.min_rate || 0),
            };

      const { error } = await supabase
        .from("profiles")
        .update({ ...payload, onboarding_complete: true })
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile saved");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save"),
  });

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    const schema = data?.role === "brand" ? brandSchema : creatorSchema;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error("Check the highlighted fields");
      return;
    }
    setErrors({});
    save.mutate();
  }

  function field(key: keyof ProfileForm) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value })),
      "aria-invalid": Boolean(errors[key]),
    };
  }

  const isBrand = data?.role === "brand";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-80" />
            <Skeleton className="h-72 w-full rounded-2xl" />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl">Your board</h1>
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {data?.role}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Signed in as {data?.email}.{" "}
              {data?.profile?.onboarding_complete
                ? "Your matching profile is complete."
                : "Finish onboarding so Beam can score your matches."}
            </p>

            <form
              onSubmit={handleSave}
              className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-lift)] sm:p-8"
            >
              <h2 className="text-xl">
                {isBrand ? "Brand profile" : "Creator matching profile"}
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {isBrand ? (
                  <>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <Label htmlFor="company_name">Company name</Label>
                      <Input id="company_name" maxLength={80} {...field("company_name")} />
                      {errors["company_name"] ? (
                        <p className="text-sm text-destructive">{errors["company_name"]}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" placeholder="northloop.coffee" {...field("website")} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="Bengaluru, IN" {...field("location")} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="display_name">Display name</Label>
                      <Input id="display_name" maxLength={80} {...field("display_name")} />
                      {errors["display_name"] ? (
                        <p className="text-sm text-destructive">{errors["display_name"]}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Input id="category" placeholder="Skincare" {...field("category")} />
                      {errors["category"] ? (
                        <p className="text-sm text-destructive">{errors["category"]}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="primary_platform">Primary platform</Label>
                      <Input id="primary_platform" placeholder="Instagram" {...field("primary_platform")} />
                      {errors["primary_platform"] ? (
                        <p className="text-sm text-destructive">{errors["primary_platform"]}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="Mumbai, IN" {...field("location")} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="follower_count">Followers</Label>
                      <Input id="follower_count" inputMode="numeric" {...field("follower_count")} />
                      {errors["follower_count"] ? (
                        <p className="text-sm text-destructive">{errors["follower_count"]}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="engagement_rate">Engagement rate (%)</Label>
                      <Input id="engagement_rate" inputMode="decimal" {...field("engagement_rate")} />
                      {errors["engagement_rate"] ? (
                        <p className="text-sm text-destructive">{errors["engagement_rate"]}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="min_rate">Minimum rate per campaign</Label>
                      <Input id="min_rate" inputMode="numeric" {...field("min_rate")} />
                      {errors["min_rate"] ? (
                        <p className="text-sm text-destructive">{errors["min_rate"]}</p>
                      ) : null}
                    </div>
                  </>
                )}

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="bio">{isBrand ? "About the brand" : "About you"}</Label>
                  <Textarea id="bio" rows={4} maxLength={600} {...field("bio")} />
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="pill"
                className="mt-7"
                disabled={save.isPending}
              >
                {save.isPending ? <Loader2 className="animate-spin" /> : null}
                Save profile
              </Button>
            </form>

            <section className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center">
              <h2 className="text-xl">
                {isBrand ? "No campaigns yet" : "No briefs matched yet"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {isBrand
                  ? "Campaign posting, ranked applications and payout tracking arrive in the next build step."
                  : "Brief discovery with match scores and applications arrive in the next build step."}
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
