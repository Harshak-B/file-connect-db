import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/for-brands")({
  head: () => ({
    meta: [
      { title: "Beam for brands — read a ranked list, not a feed" },
      {
        name: "description",
        content:
          "Post a brief and get creators scored on category, platform, reach, engagement and budget fit, with applications on one board.",
      },
      { property: "og:title", content: "Beam for brands" },
      {
        property: "og:description",
        content: "Stop scrolling profiles. Read a ranked list of creators scored against your brief.",
      },
    ],
  }),
  component: ForBrands,
});

const POINTS = [
  {
    title: "Scored against your brief",
    body: "Category, platform, reach, engagement and budget fit — each with its own contribution to the score.",
  },
  {
    title: "Filter the whole roster",
    body: "Niche, follower band, engagement rate, location and rate range, all server-side.",
  },
  {
    title: "One review board",
    body: "Applications, statuses, milestones and campaign performance in a single dense view.",
  },
  {
    title: "Safe by default",
    body: "Closed campaigns reject new applications, allocations reserve budget, transitions are authorized server-side.",
  },
];

function ForBrands() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <span className="inline-flex rounded-full bg-primary/15 px-4 py-1.5 text-sm font-semibold text-primary">
          For brands
        </span>
        <h1 className="display-xl mt-6 text-4xl sm:text-6xl">
          Stop scrolling profiles.
          <br />
          Read a <span className="text-editorial-italic text-primary">ranked list.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Describe the campaign once. Beam ranks eligible creators, shows why each one scored, and
          keeps every application in one place.
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
          <Link to="/auth" search={{ mode: "signup", role: "brand" }}>
            Post a campaign
          </Link>
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}
