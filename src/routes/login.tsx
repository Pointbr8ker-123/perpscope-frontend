import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth";
import { AuthShell, AuthInput, AuthButton } from "@/components/perpscope/auth-shell";
export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — PerpScope" }] }),
  component: LoginPage,
});
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/" });
  }
  return (
    <AuthShell title="Sign in to PerpScope" subtitle="Access funding rate analytics and alerts.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Email</label>
          <AuthInput type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Password</label>
          <div className="relative">
            <AuthInput type={show ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {error && <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}
        <AuthButton type="submit" loading={loading}>Sign In</AuthButton>
        <div className="flex items-center justify-between pt-2 text-xs">
          <Link to="/signup" className="text-primary hover:underline">Don't have an account? Sign up</Link>
          <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => toast.message("Password reset coming soon")}>Forgot password?</button>
        </div>
      </form>
    </AuthShell>
  );
}