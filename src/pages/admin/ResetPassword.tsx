import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { AuthShell, authInputClass } from "../../components/admin/AuthShell";
import { useAuth } from "../../store/AuthContext";

export function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    const res = await updatePassword(password);
    setSubmitting(false);
    if (res.ok) navigate("/admin", { replace: true });
    else setError(res.error ?? "Could not update your password.");
  };

  return (
    <AuthShell title="Set a new password" subtitle="Choose a new password for your account.">
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">New password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={authInputClass}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">Confirm password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={authInputClass}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>
        </label>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <Button type="submit" className="w-full" arrow={!submitting} disabled={submitting}>
          {submitting ? "Updating…" : "Update password"}
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
