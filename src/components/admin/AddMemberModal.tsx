import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { createMember } from "../../store/supabaseRepo";
import { useAppData } from "../../store/AppDataProvider";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/20";

// Admin-only. Creates a real login account for a new team member via the
// create-member edge function, then refreshes the roster.
export function AddMemberModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { reload } = useAppData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");
  const [color, setColor] = useState("#14B8C4");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("Member");
    setColor("#14B8C4");
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const res = await createMember({ email: email.trim(), password, name: name.trim(), role: role.trim(), color });
    setSaving(false);
    if (res.ok) {
      await reload();
      reset();
      onClose();
    } else {
      setError(res.error ?? "Could not create the member.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add team member">
      <form onSubmit={submit} className="space-y-4">
        <p className="text-xs text-slate-500">
          Creates a real login account. The member can sign in straight away and change their password from the login screen.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Full name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Jane Doe" required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Role</span>
            <input value={role} onChange={(e) => setRole(e.target.value)} className={inputClass} placeholder="e.g. Account Manager" />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="jane@company.com" autoComplete="off" required />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Temp password</span>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="min 6 characters" autoComplete="new-password" required minLength={6} />
          </label>
          <label className="flex flex-col">
            <span className="mb-1.5 block text-sm font-medium text-navy">Avatar colour</span>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-xl border border-line bg-white" />
          </label>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Creating…" : "Create member"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
