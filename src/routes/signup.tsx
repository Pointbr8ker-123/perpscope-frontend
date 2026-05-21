import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { signUp } from "@/lib/auth";
import { AuthShell, AuthInput, AuthButton } from "@/components/perpscope/auth-shell";
export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — PerpScope" }] }),
  component: SignupPage,
});
function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
function SignupPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const score = useMemo(() => strength(pw), [pw]);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (pw.length < 8) return setError("Password must be at least 8 characters");
    if (pw !== pw2) return setError("Passwords do not match");
    setLoading(true);
    const { error } = await signUp(email, pw);
    setLoading(false);
    if (error) return setError(error.message);
    setSent(true);
  }
  if (sent) {
    return (
      <AuthShell title="Check your email">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 className="h-10 w-10 text-success" />
          <p className="text-sm text-muted-foreground">
            We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>. Click it to activate your account.
          </p>
          <Link to="/login" className="mt-2 text-xs text-primary hover:underline">Back to sign in</Link>
        </div>
      </AuthShell>
    );
  }
  const strengthColor = ["bg-destructive", "bg-destructive", "bg-warning", "bg-warning", "bg-success"][score];
  const strengthLabel = ["Too weak", "Weak", "Fair", "Strong", "Excellent"][score];
  return (
    <AuthShell title="Create your account" subtitle="Start monitoring funding rate deviations.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Email</label>
          <AuthInput type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Password</label>
          <div className="relative">
            <AuthInput type={show ? "text" : "password"} required minLength={8} autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 8 characters" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {pw && (
            <div className="flex items-center gap-2 pt-1">
              <div className="flex h-1 flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-full flex-1 rounded ${i < score ? strengthColor : "bg-border"}`} />
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{strengthLabel}</span>
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Confirm Password</label>
          <AuthInput type={show ? "text" : "password"} required value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Re-enter password" />
        </div>
        {error && <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}
        <AuthButton type="submit" loading={loading}>Sign Up</AuthButton>
        <div className="pt-2 text-center text-xs">
          <Link to="/login" className="text-primary hover:underline">Already have an account? Sign in</Link>
        </div>
      </form>
    </AuthShell>
  );
}