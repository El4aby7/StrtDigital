import { useState } from "react";
import { Paperclip, X } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useAppData } from "../../store/AppDataProvider";
import { newId } from "../../lib/id";
import {
  EXPENSE_CATEGORIES,
  type Expense,
  type ExpenseCategory,
  type ReceiptFile,
} from "../../types";

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  /** when set, the new expense is pre-linked to this lead */
  presetLeadId?: string;
  /** when set, edit an existing expense instead of creating one */
  editing?: Expense;
}

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/20";

export function ExpenseModal({ open, onClose, presetLeadId, editing }: ExpenseModalProps) {
  const { leads, upsertExpense } = useAppData();

  const [date, setDate] = useState(editing?.date ?? "2026-06-10");
  const [category, setCategory] = useState<ExpenseCategory>(editing?.category ?? "Advertising");
  const [vendor, setVendor] = useState(editing?.vendor ?? "");
  const [amount, setAmount] = useState(editing?.amount?.toString() ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [leadId, setLeadId] = useState<string>(editing?.lead_id ?? presetLeadId ?? "");
  const [receipt, setReceipt] = useState<ReceiptFile | null>(editing?.receipt ?? null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setReceipt({ name: file.name, data_url: reader.result as string, size: file.size });
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Expense = {
      id: editing?.id ?? newId("e"),
      date,
      category,
      vendor: vendor.trim() || "Unknown vendor",
      amount: Number(amount) || 0,
      description: description.trim(),
      receipt,
      lead_id: leadId || null,
    };
    upsertExpense(expense);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Edit expense" : "Add expense"}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)} className={inputClass}>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Vendor</span>
            <input value={vendor} onChange={(e) => setVendor(e.target.value)} className={inputClass} placeholder="e.g. Meta Ads" required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Amount (USD)</span>
            <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} placeholder="0.00" required />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">Description</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="What was this for?" />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">
            Link to lead {presetLeadId && <span className="text-teal">(pre-selected)</span>}
          </span>
          <select value={leadId} onChange={(e) => setLeadId(e.target.value)} className={inputClass}>
            <option value="">— No linked lead —</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.company} — {l.name}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-navy">Receipt / document</span>
          {receipt ? (
            <div className="flex items-center justify-between rounded-xl border border-line bg-surface px-3 py-2 text-sm">
              <span className="flex items-center gap-2 text-navy">
                <Paperclip className="h-4 w-4 text-teal" />
                {receipt.name}
              </span>
              <button type="button" onClick={() => setReceipt(null)} className="text-slate-400 hover:text-rose-600" aria-label="Remove receipt">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-line bg-surface px-3 py-3 text-sm text-slate-500 hover:border-teal hover:text-teal">
              <Paperclip className="h-4 w-4" />
              Attach a receipt (PDF or image)
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{editing ? "Save changes" : "Add expense"}</Button>
        </div>
      </form>
    </Modal>
  );
}
