import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import skincare from "@/assets/creator-skincare.jpg";
import food from "@/assets/creator-food.jpg";
import gaming from "@/assets/creator-gaming.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beam — Where brands and creators click" },
      {
        name: "description",
        content:
          "Beam scores every creator against your brief — category, platform, reach, engagement, budget. Pitch, agree, deliver, get paid on one board.",
      },
      { property: "og:title", content: "Beam — Where brands and creators click" },
      {
        property: "og:description",
        content:
          "Scored creator matches, transparent budgets and one board from pitch to payout.",
      },
    ],
  }),
  component: Index,
});

const CREATORS = [
  {
    handle: "@lunaskies",
    meta: "Skincare · Instagram",
    image: skincare,
    reach: "212K reach",
    eng: "6.4% eng.",
    tilt: "-rotate-2",
  },
  {
    handle: "@theroastedhour",
    meta: "Food · YouTube",
    image: food,
    reach: "88K reach",
    eng: "9.1% eng.",
    tilt: "rotate-1",
  },
  {
    handle: "@pixelforge",
    meta: "Gaming · YouTube",
    image: gaming,
    reach: "340K reach",
    eng: "5.2% eng.",
    tilt: "rotate-3",
  },
] as const;

const TICKER = [
  "24,800 campaigns launched",
  "₹3.2 crore paid out to creators",
  "1,900 brands onboarded",
  "41,000 scored matches",
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div>
            <h1 className="display-xl text-5xl sm:text-6xl lg:text-7xl">
              Where brands
              <br />
              and creators
              <br />
              <span className="text-editorial-italic text-primary">click.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-muted-foreground">
              Beam scores every creator against your brief — category, platform, reach, engagement,
              budget — so the first name you see is the one worth paying. Pitch, agree, deliver, get
              paid, all on one board.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button asChild variant="hero" size="pill">
                <Link to="/auth" search={{ mode: "signup", role: "creator" }}>
                  Join as a creator
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="pill">
                <Link to="/auth" search={{ mode: "signup", role: "brand" }}>
                  Join as a brand
                </Link>
              </Button>
            </div>
            <p className="mt-8 max-w-md text-sm text-muted-foreground/80">
              Already trusted by teams at Solstice Skincare, Northloop Coffee, and 1,800+ growing
              brands.
            </p>
          </div>

          <div className="relative grid gap-5 sm:grid-cols-2">
            {CREATORS.map((creator, i) => (
              <article
                key={creator.handle}
                className={`rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] ${creator.tilt} ${
                  i === 2 ? "sm:mt-10" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`flex size-9 items-center justify-center rounded-full font-semibold ${
                      i === 1 ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {creator.handle.charAt(1).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-semibold leading-tight">{creator.handle}</p>
                    <p className="text-xs text-muted-foreground">{creator.meta}</p>
                  </div>
                </div>
                <img
                  src={creator.image}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  width={896}
                  height={752}
                  className="mt-3 aspect-[4/3] w-full rounded-xl object-cover"
                />
                <div className="mt-3 flex items-center justify-between text-sm font-medium">
                  <span>{creator.reach}</span>
                  <span className="text-muted-foreground">{creator.eng}</span>
                </div>
              </article>
            ))}

            <aside className="rounded-2xl bg-accent p-5 text-accent-foreground shadow-[var(--shadow-card)] sm:-mt-6 sm:rotate-2">
              <p className="text-editorial-italic text-lg leading-snug">
                “Booked three campaigns in a week. The match score did the pitching for me.”
              </p>
              <p className="mt-3 text-sm font-semibold">— Priya, creator</p>
            </aside>
          </div>
        </section>

        {/* Ticker */}
        <div className="overflow-hidden border-y border-border bg-surface py-4">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap px-5 text-sm font-semibold">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center gap-10">
                {item}
                <span aria-hidden className="text-accent">
                  •
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Split value props */}
        <section className="grid lg:grid-cols-2">
          <div className="bg-surface px-5 py-16 sm:px-10 lg:px-16">
            <span className="inline-flex rounded-full bg-primary/15 px-4 py-1.5 text-sm font-semibold text-primary">
              For brands
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl">
              Stop scrolling profiles.
              <br />
              Read a ranked list.
            </h2>
            <ul className="mt-8 divide-y divide-border border-t border-border">
              {[
                "Every creator scored on category, platform, reach, engagement and budget fit",
                "Filter the whole roster by niche, followers, engagement rate and location",
                "One board for applications, statuses and campaign performance",
              ].map((item) => (
                <li key={item} className="flex gap-3 py-4 text-foreground/90">
                  <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="heroOutline" size="pill" className="mt-8">
              <Link to="/auth" search={{ mode: "signup", role: "brand" }}>
                Post a campaign
              </Link>
            </Button>
          </div>

          <div className="bg-background px-5 py-16 sm:px-10 lg:px-16">
            <span className="inline-flex rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent">
              For creators
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl">
              See the budget and your odds before you write a word.
            </h2>
            <ul className="mt-8 divide-y divide-border border-t border-border">
              {[
                "Full budget shown up front — no lowball surprises",
                "Your match score on every brief, with the reasons behind it",
                "Track applied, accepted, in progress and completed in one list",
              ].map((item) => (
                <li key={item} className="flex gap-3 py-4 text-foreground/90">
                  <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="hero" size="pill" className="mt-8">
              <Link to="/auth" search={{ mode: "signup", role: "creator" }}>
                Create your profile
              </Link>
            </Button>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-20 text-center sm:px-8">
          <h2 className="mx-auto max-w-2xl text-4xl sm:text-5xl">
            Ready to make some <span className="text-editorial-italic text-primary">noise?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Create a free account, finish a two-minute onboarding, and start matching today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild variant="hero" size="pill">
              <Link to="/auth" search={{ mode: "signup" }}>
                Get started
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="pill">
              <Link to="/how-it-works">See how it works</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
