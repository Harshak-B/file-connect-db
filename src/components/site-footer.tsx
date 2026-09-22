import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link to="/" className="font-display text-2xl font-bold">
            Beam<span className="text-primary">.</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Where brands and creators click. Scored matches, transparent budgets, one board from
            pitch to payout.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm">
          <div>
            <p className="font-semibold">Product</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>
                <Link to="/how-it-works" className="hover:text-foreground">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/for-brands" className="hover:text-foreground">
                  For brands
                </Link>
              </li>
              <li>
                <Link to="/for-creators" className="hover:text-foreground">
                  For creators
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Account</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>
                <Link to="/auth" search={{ mode: "signup" }} className="hover:text-foreground">
                  Create account
                </Link>
              </li>
              <li>
                <Link to="/auth" search={{ mode: "login" }} className="hover:text-foreground">
                  Log in
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-5 py-5 text-center text-xs text-muted-foreground sm:px-8">
        Beam is a portfolio demo. Payments and payouts are simulated.
      </div>
    </footer>
  );
}
