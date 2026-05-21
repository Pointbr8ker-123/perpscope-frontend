import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Trash2, Plus, X, Loader2 } from "lucide-react";
import { Navbar } from "@/components/perpscope/navbar";
import { ProtectedRoute } from "@/components/perpscope/protected-route";
import { useAuth } from "@/hooks/useAuth";
import { api, type UserAlert } from "@/lib/api";
export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — PerpScope" }] }),
  component: () => (
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  ),
});
function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="glass-card p-6">
      <header className="mb-5">
        <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
        {desc && <p className="mt-1 text-xs text-muted-foreground">{desc}</p>}
      </header>
      {children}
    </section>
  );
}
function AccountPage() {
  const { user } = useAuth();
  const plan = (user?.user_metadata?.plan as string) || "FREE";
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Account Settings</h1>
        <div className="space-y-5">
          <Section title="Profile">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <div className="mt-1 rounded-md border border-border bg-card/30 px-3 py-2 text-sm text-muted-foreground">{user?.email}</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Plan</label>
                  <div className="mt-1">
                    <span className={
                      plan === "PRO"
                        ? "rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-primary"
                        : "rounded-md border border-border bg-muted/40 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    }>{plan}</span>
                  </div>
                </div>
                {plan !== "PRO" && (
                  <button disabled className="rounded-md border border-border bg-card/50 px-3 py-2 text-xs font-medium text-muted-foreground opacity-60">Upgrade to Pro</button>
                )}
              </div>
            </div>
          </Section>
          <TelegramSection />
          <AlertsSection plan={plan} />
        </div>
      </main>
    </div>
  );
}
function TelegramSection() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["telegram"], queryFn: () => api.user.telegramStatus() });
  const [chatId, setChatId] = useState("");
  const [saving, setSaving] = useState(false);
  async function save() {
    if (!chatId.trim()) return;
    setSaving(true);
    try {
      await api.user.telegram(chatId.trim());
      toast.success("Telegram connected");
      setChatId("");
      qc.invalidateQueries({ queryKey: ["telegram"] });
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Failed to connect Telegram");
    } finally { setSaving(false); }
  }
  async function disconnect() {
    try {
      await api.user.disconnectTelegram();
      toast.success("Telegram disconnected");
      qc.invalidateQueries({ queryKey: ["telegram"] });
    } catch { toast.error("Failed to disconnect"); }
  }
  return (
    <Section title="Telegram Alerts" desc="Connect Telegram to receive real-time alerts when funding rate opportunities are detected.">
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : data?.connected ? (
        <div className="flex items-center justify-between rounded-md border border-success/30 bg-success/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <Check className="h-4 w-4 text-success" />
            <div>
              <div className="text-sm font-medium text-foreground">Telegram connected</div>
              <div className="text-xs text-muted-foreground">Chat ID: {data.chat_id}</div>
            </div>
          </div>
          <button onClick={disconnect} className="rounded-md border border-border bg-card/50 px-3 py-1.5 text-xs font-medium hover:bg-elevated">Disconnect</button>
        </div>
      ) : (
        <ol className="space-y-3 text-sm text-muted-foreground">
          <li><span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">1</span>Message <span className="font-mono text-foreground">@PerpScopeBot</span> on Telegram and type <span className="font-mono text-foreground">/start</span></li>
          <li><span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">2</span>Copy your Chat ID from the bot's reply</li>
          <li>
            <div className="mb-2"><span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">3</span>Paste your Chat ID below</div>
            <div className="flex gap-2">
              <input value={chatId} onChange={(e) => setChatId(e.target.value)} placeholder="Your Telegram Chat ID" className="flex h-10 flex-1 rounded-md border border-border bg-card/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <button onClick={save} disabled={saving || !chatId.trim()} className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}Save
              </button>
            </div>
          </li>
        </ol>
      )}
    </Section>
  );
}
const TIER_LABELS: Record<string, string> = { ALL: "All", LARGE: "Large Cap", MID: "Mid Cap", SMALL: "Small Cap" };
const THRESHOLD_LABELS: Record<string, string> = { RETAIL: "Retail", FUND: "Fund", INSTITUTION: "Institution", MARKET_MAKER: "Market Maker" };
function AlertsSection({ plan }: { plan: string }) {
  const qc = useQueryClient();
  const { data: alerts = [], isLoading } = useQuery({ queryKey: ["alerts"], queryFn: () => api.user.alerts() });
  const [open, setOpen] = useState(false);
  async function del(id: string) {
    try {
      await api.user.deleteAlert(id);
      toast.success("Alert deleted");
      qc.invalidateQueries({ queryKey: ["alerts"] });
    } catch { toast.error("Failed to delete"); }
  }
  const atLimit = plan !== "PRO" && alerts.length >= 3;
  return (
    <Section title="My Alerts" desc="Get notified when an opportunity matches your criteria.">
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : alerts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No alerts yet.</p>
      ) : (
        <ul className="space-y-2">
          {alerts.map((a) => (
            <li key={a.id} className="flex items-center justify-between rounded-md border border-border bg-card/30 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-mono font-semibold text-foreground">{a.symbol || "All coins"}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{TIER_LABELS[a.tier] ?? a.tier}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{THRESHOLD_LABELS[a.threshold] ?? a.threshold}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-foreground">ρ ≥ {a.min_rho.toFixed(2)}</span>
              </div>
              <button onClick={() => del(a.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setOpen(true)} disabled={atLimit}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> Add Alert
        </button>
        {plan !== "PRO" && (
          <p className="text-xs text-muted-foreground">Free plan: up to 3 alerts. Upgrade for unlimited.</p>
        )}
      </div>
      {open && <AlertModal onClose={() => setOpen(false)} onCreated={() => qc.invalidateQueries({ queryKey: ["alerts"] })} />}
    </Section>
  );
}
function AlertModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [symbol, setSymbol] = useState("");
  const [tier, setTier] = useState<UserAlert["tier"]>("ALL");
  const [threshold, setThreshold] = useState<UserAlert["threshold"]>("RETAIL");
  const [minRho, setMinRho] = useState(1.0);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);
  async function save() {
    setSaving(true);
    try {
      await api.user.createAlert({ symbol: symbol.trim().toUpperCase() || null, tier, threshold, min_rho: minRho });
      toast.success("Alert created");
      onCreated();
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Failed to create alert");
    } finally { setSaving(false); }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">New Alert</h3>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-elevated"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Symbol (optional)</label>
            <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Leave blank for all coins" className="mt-1 flex h-10 w-full rounded-md border border-border bg-card/40 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Tier</label>
            <select value={tier} onChange={(e) => setTier(e.target.value as any)} className="mt-1 flex h-10 w-full rounded-md border border-border bg-card/40 px-3 text-sm focus:border-primary focus:outline-none">
              <option value="ALL">All</option><option value="LARGE">Large Cap</option><option value="MID">Mid Cap</option><option value="SMALL">Small Cap</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Threshold</label>
            <select value={threshold} onChange={(e) => setThreshold(e.target.value as any)} className="mt-1 flex h-10 w-full rounded-md border border-border bg-card/40 px-3 text-sm focus:border-primary focus:outline-none">
              <option value="RETAIL">Retail</option><option value="FUND">Fund</option><option value="INSTITUTION">Institution</option><option value="MARKET_MAKER">Market Maker</option>
            </select>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Min ρ (annualized)</label>
              <span className="font-mono text-xs text-foreground">{minRho.toFixed(2)}</span>
            </div>
            <input type="range" min={0.5} max={5} step={0.1} value={minRho} onChange={(e) => setMinRho(Number(e.target.value))} className="w-full accent-primary" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-border bg-card/50 px-4 py-2 text-sm font-medium hover:bg-elevated">Cancel</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}Save
          </button>
        </div>
      </div>
    </div>
  );
}