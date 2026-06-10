import { useMemo, useState } from "react";
import { Plus, Paperclip, Pencil, Trash2, Search } from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { Button } from "../../components/ui/Button";
import { DataTable, type Column } from "../../components/ui/Table";
import { ExpenseModal } from "../../components/admin/ExpenseModal";
import { useAppData } from "../../store/AppDataProvider";
import { formatCurrency, formatDate } from "../../lib/format";
import { EXPENSE_CATEGORIES, type Expense } from "../../types";

export function Expenses() {
  const { expenses, leads, linkExpenseToLead, deleteExpense } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | undefined>();
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      expenses
        .filter((e) => (category ? e.category === category : true))
        .filter((e) =>
          query
            ? `${e.vendor} ${e.description}`.toLowerCase().includes(query.toLowerCase())
            : true,
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    [expenses, category, query],
  );

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const openAdd = () => {
    setEditing(undefined);
    setModalOpen(true);
  };
  const openEdit = (e: Expense) => {
    setEditing(e);
    setModalOpen(true);
  };

  const columns: Column<Expense>[] = [
    { key: "date", header: "Date", cell: (e) => <span className="whitespace-nowrap text-slate-600">{formatDate(e.date)}</span> },
    {
      key: "category",
      header: "Category",
      cell: (e) => (
        <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-navy">{e.category}</span>
      ),
    },
    { key: "vendor", header: "Vendor", cell: (e) => <span className="font-medium text-navy">{e.vendor}</span> },
    {
      key: "receipt",
      header: "Receipt",
      cell: (e) =>
        e.receipt ? (
          <span className="inline-flex items-center gap-1 text-xs text-teal-dark">
            <Paperclip className="h-3.5 w-3.5" />
            {e.receipt.data_url ? (
              <a href={e.receipt.data_url} download={e.receipt.name} className="hover:underline">
                {e.receipt.name}
              </a>
            ) : (
              e.receipt.name
            )}
          </span>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        ),
    },
    {
      key: "lead",
      header: "Linked lead",
      cell: (e) => (
        <select
          value={e.lead_id ?? ""}
          onClick={(ev) => ev.stopPropagation()}
          onChange={(ev) => linkExpenseToLead(e.id, ev.target.value || null)}
          className="max-w-[180px] rounded-lg border border-line bg-white px-2 py-1 text-xs text-navy outline-none focus:border-teal"
        >
          <option value="">— Unlinked —</option>
          {leads.map((l) => (
            <option key={l.id} value={l.id}>
              {l.company}
            </option>
          ))}
        </select>
      ),
    },
    { key: "amount", header: "Amount", align: "right", cell: (e) => <span className="font-semibold text-navy">{formatCurrency(e.amount)}</span> },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (e) => (
        <div className="flex justify-end gap-1">
          <button onClick={() => openEdit(e)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-surface hover:text-teal" aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => deleteExpense(e.id)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Expenses"
        subtitle="Track and document every cost — link each one to a lead."
        actions={
          <Button onClick={openAdd} icon={Plus}>
            Add expense
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vendor…"
            className="rounded-xl border border-line bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-teal"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-navy outline-none focus:border-teal"
        >
          <option value="">All categories</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <span className="ml-auto text-sm text-slate-500">
          {filtered.length} expense{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(e) => e.id}
        empty="No expenses match your filters."
        footer={
          <>
            <td className="px-4 py-3" colSpan={5}>
              Total
            </td>
            <td className="px-4 py-3 text-right">{formatCurrency(total)}</td>
            <td className="px-4 py-3" />
          </>
        }
      />

      <ExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  );
}
