import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Confirming — PerpScope" }] }),
  component: AuthCallback,
});
function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Supabase auto-parses the URL hash and sets the session.
        const { data, error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error) throw error;
        if (data.session) {
          toast.success("Email confirmed! Welcome to PerpScope.");
          navigate({ to: "/" });
        } else {
          // wait briefly for hash to be processed
          setTimeout(async () => {
            const { data: d2 } = await supabase.auth.getSession();
            if (d2.session) {
              toast.success("Email confirmed! Welcome to PerpScope.");
              navigate({ to: "/" });
            } else {
              setError("Confirmation link is invalid or expired.");
            }
          }, 800);
        }
      } catch (e: any) {
        setError(e?.message ?? "Confirmation failed");
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {error ? (
        <div className="max-w-sm text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <p className="mt-3 text-sm text-destructive">{error}</p>
          <Link to="/login" className="mt-4 inline-block text-sm text-primary hover:underline">Back to sign in</Link>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm">Confirming your email…</span>
        </div>
      )}
    </div>
  );
}