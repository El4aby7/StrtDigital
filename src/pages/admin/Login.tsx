import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { AuthShell, authInputClass } from "../../components/admin/AuthShell";
import { useAuth } from "../../store/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Return the user to wherever ProtectedRoute gated them out of (state.from), or a
  // ?redirect= query param, defaulting to the dashboard root.
  const fromState = (location.state as { from?: string } | null)?.from;
  const fromQuery = new URLSearchParams(location.search).get("redirect");
  const from = fromState ?? fromQuery ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await login(email, password, remember);
    setSubmitting(false);
    if (res.ok) navigate(from, { replace: true });
    else setError(res.error ?? "Could not sign in.");
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your StrtDigital dashboard.">
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInputClass}
              placeholder="you@strtdigital.site"
              autoComplete="username"
              required
            />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">Password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={authInputClass}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
        </label>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-line text-teal focus:ring-teal/30"
            />
            Remember me
          </label>
          <Link
            to="/admin/forgot-password"
            className="text-sm font-medium text-teal hover:text-teal-dark"
          >
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <Button type="submit" className="w-full" arrow={!submitting} disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <Link
        to="/"
        className="mt-6 inline-block text-sm font-medium text-slate-500 hover:text-teal"
      >
        ← Back to website
      </Link>
    </AuthShell>
  );
}
