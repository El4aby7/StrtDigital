import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowUpRight, Lock } from "lucide-react";
import { Logo, LogoMark } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../store/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const [email, setEmail] = useState("admin@strtdigital.site");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.ok) navigate(from, { replace: true });
    else setError(res.error ?? "Could not sign in.");
  };

  const inputClass =
    "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-navy outline-none transition-colors placeholder:text-slate-400 focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/20";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* brand panel */}
      <div className="relative hidden overflow-hidden bg-brand-gradient p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link to="/">
          <Logo tone="light" />
        </Link>
        <div>
          <ArrowUpRight className="h-16 w-16 text-white/90" strokeWidth={1.5} />
          <h1 className="mt-6 max-w-sm font-display text-4xl font-bold leading-tight">
            Run your agency's growth from one place.
          </h1>
          <p className="mt-4 max-w-sm text-white/80">
            KPIs, leads, and expenses — all connected, all in real time.
          </p>
        </div>
        <p className="text-sm text-white/60">© {new Date().getFullYear()} StrtDigital</p>
      </div>

      {/* form */}
      <div className="flex items-center justify-center bg-white px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <LogoMark className="h-12 w-12" />
          </div>
          <h2 className="mt-6 font-display text-3xl font-bold text-navy">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to your StrtDigital dashboard.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-navy">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@strtdigital.site"
                autoComplete="username"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-navy">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <Button type="submit" className="w-full" arrow>
              Sign in
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-xs text-slate-500">
            <Lock className="h-4 w-4 shrink-0 text-teal" />
            Demo mode — any email and password will sign you in. Supabase Auth
            connects here later.
          </div>

          <Link
            to="/"
            className="mt-6 inline-block text-sm font-medium text-slate-500 hover:text-teal"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
