import { supabase } from "@/integrations/supabase/client";
const redirectUrl = () =>
  typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: redirectUrl() },
  });
}
export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}
export async function signOut() {
  return supabase.auth.signOut();
}
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined,
  });
}