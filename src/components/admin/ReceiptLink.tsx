import { useState } from "react";
import { Paperclip } from "lucide-react";
import { signedReceiptUrl } from "../../store/supabaseRepo";
import type { ReceiptFile } from "../../types";

// Receipts live in a private bucket, so there's no permanent URL — we mint a
// short-lived signed URL on click and open it in a new tab.
export function ReceiptLink({ receipt }: { receipt: ReceiptFile | null }) {
  const [loading, setLoading] = useState(false);

  if (!receipt) return <span className="text-xs text-slate-300">—</span>;

  const open = async () => {
    if (!receipt.path) return;
    setLoading(true);
    const url = await signedReceiptUrl(receipt.path);
    setLoading(false);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        open();
      }}
      disabled={loading || !receipt.path}
      className="inline-flex items-center gap-1 text-xs text-teal-dark hover:underline disabled:opacity-60"
    >
      <Paperclip className="h-3.5 w-3.5" />
      {loading ? "Opening…" : receipt.name}
    </button>
  );
}
