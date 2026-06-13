import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useAppData } from "../../store/AppDataProvider";
import type { User } from "../../types";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/20";

interface Props {
  open: boolean;
  onClose: () => void;
  member: User | null;
  /** when true, the "Remove from team" action is hidden (can't remove yourself) */
  isSelf?: boolean;
}

export function TeamMemberModal({ open, onClose, member, isSelf }: Props) {
  const { upsertUser, deleteUser } = useAppData();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [color, setColor] = useState("#14B8C4");
  const [targets, setTargets] = useState({ leads: 0, won: 0, revenue: 0, conversion: 0 });

  // Seed local state each time a different member opens the modal.
  const [seededId, setSeededId] = useState<string | null>(null);
  if (member && seededId !== member.id) {
    setSeededId(member.id);
    setName(member.name);
    setRole(member.role);
    setColor(member.avatar_color || "#14B8C4");
    setTargets({ ...member.targets });
  }

  if (!member) return null;

  const save = () => {
    upsertUser({
      ...member,
      name: name.trim() || member.email.split("@")[0],
      role: role.trim() || "Member",
      avatar_color: color,
      targets: {
        leads: Number(targets.leads) || 0,
        won: Number(targets.won) || 0,
        revenue: Number(targets.revenue) || 0,
        conversion: Number(targets.conversion) || 0,
      },
    });
    onClose();
  };

  const remove = () => {
    if (window.confirm(`Remove "${member.name}" from the team? This clears their profile and KPI targets (it does not delete their login).`)) {
      deleteUser(member.id);
      onClose();
    }
  };

  const Num = ({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) => (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <input type="number" min="0" value={value} onChange={(e) => onChange(Number(e.target.value))} className={inputClass} />
    </label>
  );

  return (
    <Modal open={open} onClose={onClose} title="Edit team member">
      <div className="space-y-4">
        <p className="text-xs text-slate-500">{member.email}</p>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Role</span>
            <input value={role} onChange={(e) => setRole(e.target.value)} className={inputClass} placeholder="e.g. Account Manager" />
          </label>
        </div>

        <label className="flex items-center gap-3">
          <span className="text-sm font-medium text-navy">Avatar colour</span>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-12 cursor-pointer rounded-lg border border-line bg-white" />
          <span className="text-xs text-slate-400">{color}</span>
        </label>

        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="mb-3 text-sm font-semibold text-navy">KPI targets</p>
          <div className="grid grid-cols-2 gap-3">
            <Num label="Leads" value={targets.leads} onChange={(n) => setTargets((t) => ({ ...t, leads: n }))} />
            <Num label="Deals won" value={targets.won} onChange={(n) => setTargets((t) => ({ ...t, won: n }))} />
            <Num label="Revenue (USD)" value={targets.revenue} onChange={(n) => setTargets((t) => ({ ...t, revenue: n }))} />
            <Num label="Conversion (%)" value={targets.conversion} onChange={(n) => setTargets((t) => ({ ...t, conversion: n }))} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          {!isSelf ? (
            <Button type="button" variant="outline" icon={Trash2} onClick={remove} className="text-rose-600 hover:border-rose-300 hover:text-rose-700">
              Remove
            </Button>
          ) : (
            <span className="text-xs text-slate-400">This is you</span>
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={save}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
