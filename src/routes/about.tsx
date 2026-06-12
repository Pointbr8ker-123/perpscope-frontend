import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, AlertTriangle, HelpCircle, Activity, Eye, Bell, BarChart3, Zap } from "lucide-react";
import { Navbar } from "@/components/perpscope/navbar";
import { Footer } from "@/routes/index";
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — PerpScope" },
      { name: "description", content: "Learn how PerpScope identifies funding rate arbitrage opportunities in altcoin perpetual futures." },
    ],
  }),
  component: AboutPage,
});
function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About PerpScope</h1>
          <p className="mt-3 text-base text-muted-foreground">
            A research-grade tool for understanding perpetual futures mispricing.
          </p>
        </div>
        {/* Section 1 */}
        <Section number="1" title="What is PerpScope?">
          <p>
            PerpScope monitors a specific type of trading opportunity in the cryptocurrency derivatives market — one that professional quantitative funds have been quietly exploiting for years, and that retail traders have had no easy way to access.
          </p>
          <p>
            The opportunity involves <strong>perpetual futures contracts</strong> — a type of crypto derivative that is supposed to track the price of the underlying coin. When a perpetual futures contract trades too far above or below its fair value, there is a mathematical opportunity to profit from the gap closing, regardless of which direction the market moves.
          </p>
          <Callout>
            PerpScope identifies these gaps in real time, across <strong>300+ coins</strong> on Bybit.
          </Callout>
        </Section>
        {/* Section 2 */}
        <Section number="2" title="What is a Perpetual Futures Contract?">
          <p>
            A perpetual futures contract is a bet on the future price of a coin that <strong>never expires</strong>. Unlike traditional futures contracts, it has no end date — you can hold it indefinitely.
          </p>
          <p>
            To keep the futures price anchored to the actual spot price of the coin, exchanges use a mechanism called the <strong>funding rate</strong>. Every 8 hours, one side of the trade pays the other:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>If futures are trading <strong>above</strong> spot price → longs (buyers) pay shorts (sellers)</li>
            <li>If futures are trading <strong>below</strong> spot price → shorts (sellers) pay longs (buyers)</li>
          </ul>
          <p>
            This payment nudges traders to push the price back toward fair value. When the gap is large, the payment is large — and that is exactly when PerpScope sends you an alert.
          </p>
        </Section>
        {/* Section 3 */}
        <Section number="3" title={<>What is ρ <span className="text-lg text-muted-foreground">(rho)</span>?</>}>
          <p>
            ρ (the Greek letter rho, pronounced "row") is PerpScope's core measurement. It tells you how far a coin's perpetual futures price has drifted from its theoretical fair value, expressed as an <strong>annualised percentage</strong>.
          </p>
          <p>
            Think of it like an interest rate. A ρ of 150% means the market is currently mispriced enough that, if nothing changed, you could theoretically earn 150% per year just from the funding payments — before the price gap even closes.
          </p>
          <div className="mt-6 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">ρ value</th>
                  <th className="px-4 py-2.5 font-medium">What it means</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-2.5 font-mono font-medium text-[#94A3B8]">0% to 50%</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Small deviation. Likely within normal trading costs.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-medium text-[#EAB308]">50% to 150%</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Moderate opportunity. Worth watching.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-medium text-[#F97316]">150% to 400%</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Strong opportunity. Above typical trading costs.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono font-bold text-[#EF4444]">Above 400%</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Very large deviation. Investigate before trading.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            ρ is calculated using the no-arbitrage pricing formula from <em>He, Manela, Ross & von Wachter (2024)</em>. It is not a prediction — it is a measurement of the current gap between price and fair value.
          </p>
        </Section>
        {/* Section 4 */}
        <Section number="4" id="signals" title="The Two Trading Signals">
          <div className="space-y-6">
            <div className="rounded-lg border border-[#EF4444]/20 bg-[#EF4444]/[0.04] p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                <h3 className="text-sm font-semibold text-[#FCA5A5]">Short Perp — Futures Overpriced</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The perpetual futures contract is trading above fair value. Buyers of the futures are overpaying, and they are currently paying a funding rate to shorts.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">The opportunity:</strong> Sell (short) the futures contract, and simultaneously buy the actual coin on the spot market. Every 8 hours, you collect funding payments from the longs. When the prices converge back to fair value, close both positions and keep the profit.
              </p>
              <div className="mt-3 rounded border border-[#EF4444]/10 bg-[#EF4444]/5 px-3 py-2 text-xs text-[#FCA5A5]">
                You are not betting on the coin going up or down. You are betting on the gap closing — which the funding mechanism naturally pushes toward.
              </div>
            </div>
            <div className="rounded-lg border border-[#3B82F6]/20 bg-[#3B82F6]/[0.04] p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
                <h3 className="text-sm font-semibold text-[#93C5FD]">Long Perp — Futures Underpriced</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The perpetual futures contract is trading below fair value. Sellers of the futures are currently paying longs to hold their positions.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">The opportunity:</strong> Buy (long) the futures contract, and simultaneously sell the actual coin on the spot market. Every 8 hours, you collect funding payments from the shorts. When prices converge, close both positions and keep the profit.
              </p>
            </div>
          </div>
        </Section>
        {/* Section 5 */}
        <Section number="5" title="Why Small-Cap Coins Show Larger Opportunities">
          <p>
            In theory, every gap should close immediately — professional arbitrage firms would trade it away within seconds. In practice, large institutional traders focus on Bitcoin and Ethereum, where the position sizes are large enough to justify their costs.
          </p>
          <p>
            For smaller, less liquid coins, there are fewer professionals watching. When a gap appears, it can persist for hours or days before closing. PerpScope's <Link to="/research" className="underline decoration-primary/40 underline-offset-4 hover:text-primary">Research page</Link> shows this empirically — small-cap altcoins show significantly larger average deviations than large-cap coins.
          </p>
          <Callout>
            This is the research finding behind the platform, and it is what makes the alerts most useful for smaller coins.
          </Callout>
        </Section>
        {/* Section 6 */}
        <Section number="6" title="How to Use PerpScope">
          <div className="space-y-4">
            <Step n={1} icon={Eye} title="Browse the Dashboard">
              See current opportunities ranked by deviation size.
            </Step>
            <Step n={2} icon={BarChart3} title="Click any coin">
              See its historical deviation chart — this shows whether the current opportunity is unusual or typical for that coin.
            </Step>
            <Step n={3} icon={Bell} title="Set up a Telegram alert">
              In your <Link to="/account" className="underline decoration-primary/40 underline-offset-4 hover:text-primary">account settings</Link>, choose which coins or tiers you want to watch, and set a minimum ρ level that makes sense for your trading costs.
            </Step>
            <Step n={4} icon={Zap} title="Act on alerts">
              When you receive an alert, the opportunity has just crossed your threshold. Check the coin detail page for context before deciding whether to act.
            </Step>
          </div>
          <div className="mt-6 rounded-lg border border-border bg-elevated/40 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Important:</strong> PerpScope identifies opportunities. It does not execute trades. You still need to evaluate each opportunity against your own risk tolerance, available capital, and the liquidity of the coin before trading.
              </p>
            </div>
          </div>
        </Section>
        {/* Section 7 */}
        <Section number="7" title="Risk Warning">
          <p className="text-muted-foreground">
            Funding rate arbitrage is <strong className="text-foreground">not risk-free</strong>. Risks include:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
            <li><strong className="text-foreground">Execution risk:</strong> Prices can move between when you see the signal and when your orders fill.</li>
            <li><strong className="text-foreground">Liquidity risk:</strong> Small-cap coins may be difficult to buy or sell in large quantities.</li>
            <li><strong className="text-foreground">Exchange risk:</strong> Both legs of the trade are on Bybit — any exchange outage affects both positions.</li>
            <li><strong className="text-foreground">Model risk:</strong> ρ is based on a theoretical pricing model. Real markets sometimes behave differently from theory.</li>
          </ul>
          <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center text-sm text-destructive">
            This platform is a research tool. Nothing on PerpScope is financial advice.
          </div>
        </Section>
        <div className="mt-12 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-5 py-2.5 text-sm font-medium transition hover:border-border-strong hover:bg-elevated"
          >
            Back to Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
function Section({ number, title, children, id }: { number: string; title: React.ReactNode; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="mb-14 scroll-mt-20">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-7 w-7 place-items-center rounded-full border border-border bg-card text-xs font-bold text-muted-foreground">
          {number}
        </span>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="space-y-4 leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
      {children}
    </div>
  );
}
function Step({ n, icon: Icon, title, children }: { n: number; icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-xs font-bold text-muted-foreground">
          {n}
        </div>
        <div className="mt-1 h-full w-px bg-border" />
      </div>
      <div className="pb-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon className="h-4 w-4 text-primary" /> {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
