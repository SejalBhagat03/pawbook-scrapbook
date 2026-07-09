import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/pawbook/SiteChrome";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — PawBook" },
      {
        name: "description",
        content: "Sign in to share the little friends you meet along the way.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/found-friends" });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate({ to: "/found-friends" });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Check your inbox to confirm your email 🐾");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back 🌸");
        navigate({ to: "/found-friends" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/auth",
      },
    });
    if (error) {
      toast.error(error.message);
      setBusy(false);
    }
  }

  async function handleGuest() {
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      toast.success("Welcome, Guest! 🐾");
      navigate({ to: "/found-friends" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to sign in as guest");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-6 pt-10">
        <div className="scrapbook-shadow rounded-3xl border border-coffee/10 bg-white/90 p-8">
          <div className="text-center">
            <div className="text-4xl">🐾</div>
            <h1 className="mt-2 font-display text-3xl">
              {mode === "sign-in" ? "Welcome back" : "Join PawBook"}
            </h1>
            <p className="mt-1 text-sm text-coffee/70">
              Share the little friends you meet on the street.
            </p>
          </div>

          <button
            onClick={handleGoogle}
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-coffee/20 bg-white px-4 py-2.5 text-sm font-semibold text-coffee hover:bg-cream disabled:opacity-50 cursor-pointer"
          >
            <span>🔆</span> Continue with Google
          </button>

          <button
            onClick={handleGuest}
            disabled={busy}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-peach px-4 py-2.5 text-sm font-bold text-coffee hover:scale-105 transition-transform disabled:opacity-50 cursor-pointer"
          >
            <span>🐾</span> Continue as Guest (No Login)
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-coffee/50">
            <div className="h-px flex-1 bg-coffee/10" /> or email{" "}
            <div className="h-px flex-1 bg-coffee/10" />
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-coffee/15 bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-peach"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-coffee/15 bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-peach"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-coffee px-5 py-2.5 text-sm font-bold text-cream hover:bg-coffee/90 disabled:opacity-50"
            >
              {mode === "sign-in" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
            className="mt-4 w-full text-center text-xs text-coffee/60 hover:text-peach"
          >
            {mode === "sign-in"
              ? "New here? Create an account"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
