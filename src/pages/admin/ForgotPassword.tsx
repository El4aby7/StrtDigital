import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { AuthShell, authInputClass } from "../../components/admin/AuthShell";
import { useAuth } from "../../store/AuthContext";

export function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await requestPasswordReset(email);
    setSubmitting(false);
    if (res.ok) setSent(true);
    else setError(res.error ?? "Could not send the reset link.");
  };

  if (sent) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="If an account exists for that address, a reset link is on its way."
      >
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-slate-600">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-teal" />
          <span>
            We sent a password-reset link to <strong className="text-navy">{email}</strong>.
            Open it on this device to set a new password.
          </span>
        </div>
        <Link
          to="/admin/login"
          className="mt-6 inline-block text-sm font-medium text-slate-500 hover:text-teal"
        >
          ← Back to sign in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link."
    >
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

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <Button type="submit" className="w-full" arrow={!submitting} disabled={submitting}>
          {submitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <Link
        to="/admin/login"
        className="mt-6 inline-block text-sm font-medium text-slate-500 hover:text-teal"
      >
        ← Back to sign in
      </Link>
    </AuthShell>
  );
}
