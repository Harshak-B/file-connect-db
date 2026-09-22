import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/for-creators")({
  head: () => ({
    meta: [
      { title: "Beam for creators — budgets and odds up front" },
      {
        name: "description",
        content:
          "See the full budget, your match score and the reasons behind it before you pitch. Track every application in one list.",
      },
      { property: "og:title", content: "Beam for creators" },
      {
        property: "og:description",
        content: "See the budget and your odds before you write a word.",
      },
    ],
  }),
  component: ForCreators,
});

const POINTS = [
  {
    title: "Budgets shown up front",
    body: "Every brief lists its real budget and deliverables. No lowball reveal after the call.",
  },
  {
    title: "Your score, explained",
    body: "See exactly which parts of the brief you match and which ones cost you points.",
  },
  {
    title: "One application, one list",
    body: "Applied, accepted, in progress and completed — tracked without spreadsheet gymnastics.",
  },
  {
    title: "Payouts you can follow",
    body: "Milestones and payout states are visible, and nothing claims released until it is confirmed.",
  },
];

function ForCreators() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <span className="inline-flex rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent">
          For creators
        </span>
        <h1 className="display-xl mt-6 text-4xl sm:text-6xl">
          See the budget and your
          <br />
          <span className="text-editorial-italic text-accent">odds</span> before you write a word.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Build your profile once — category, platform, reach, engagement, rate — and every brief
          arrives pre-scored.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {POINTS.map((point) => (
            <section
              key={point.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-lift)]"
            >
              <h2 className="text-xl">{point.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{point.body}</p>
            </section>
          ))}
        </div>

        <Button asChild variant="hero" size="pill" className="mt-12">
          <Link to="/auth" search={{ mode: "signup", role: "creator" }}>
            Create your profile
          </Link>
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}
