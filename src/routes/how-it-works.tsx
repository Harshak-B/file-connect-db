import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How Beam works — brief, score, pitch, payout" },
      {
        name: "description",
        content:
          "Six steps from posting a brief to a confirmed payout: scoring, applications, review, milestones and release.",
      },
      { property: "og:title", content: "How Beam works" },
      {
        property: "og:description",
        content: "Brief, score, pitch, review, deliver, get paid — the whole Beam flow.",
      },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  {
    title: "Pick your side",
    body: "Sign up as a brand or a creator. Onboarding only asks for what matching actually uses.",
  },
  {
    title: "A brand posts a brief",
    body: "Category, platform, audience, budget, location, deliverables. No vague DMs.",
  },
  {
    title: "Beam scores the roster",
    body: "Every eligible creator gets a match score with the reasons behind each point.",
  },
  {
    title: "Creators apply once",
    body: "One application per brief, budget visible up front, score snapshotted at submission.",
  },
  {
    title: "The brand reviews a ranked list",
    body: "Accept, reject or invite. Statuses move applied → review → accepted → in progress.",
  },
  {
    title: "Deliver, confirm, get paid",
    body: "Milestones tracked on one board. Payout only shows released after it is confirmed.",
  },
];

function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
        <h1 className="display-xl text-4xl sm:text-6xl">
          How Beam <span className="text-editorial-italic text-primary">works.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          One board, server-checked rules, and a score you can explain to your client.
        </p>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-lift)]"
            >
              <span className="font-display text-3xl text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 text-xl">{step.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex flex-wrap gap-4">
          <Button asChild variant="hero" size="pill">
            <Link to="/auth" search={{ mode: "signup" }}>
              Create your account
            </Link>
          </Button>
          <Button asChild variant="heroOutline" size="pill">
            <Link to="/for-brands">I'm hiring creators</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
