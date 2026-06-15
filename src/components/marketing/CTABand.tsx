import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Check, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/Button";
import { scrollToId } from "../../lib/scrollToId";
import { useSiteContent } from "../../store/SiteContentProvider";
import { submitContactLead } from "../../store/supabaseRepo";

export function CTABand() {
  const { cta } = useSiteContent().content;
  const location = useLocation();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // Arriving from a "Request this template" click: pre-fill the message and jump
  // to the form so the visitor lands ready to send.
  useEffect(() => {
    const requested = (location.state as { requestTemplate?: string } | null)?.requestTemplate;
    if (requested) {
      setForm((f) => ({ ...f, message: `I'm interested in the "${requested}" template. ` }));
      const t = setTimeout(() => scrollToId("contact"), 80);
      return () => clearTimeout(t);
    }
  }, [location.state]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    const res = await submitContactLead({
      name: form.name,
      email: form.email,
      message: form.message,
    });
    setSending(false);
    if (res.ok) setSent(true);
    else setError("Something went wrong — please email us instead.");
  };

  return (
    <section id="contact" className="px-5 py-20 sm:px-8 md:py-28">
      <div className="container-page overflow-hidden rounded-3xl bg-brand-gradient p-1 shadow-card-hover">
        <div className="grid gap-10 rounded-[1.4rem] bg-navy/95 p-8 md:grid-cols-2 md:p-14">
          <div className="text-white">
            <h2 className="font-display text-4xl font-bold leading-tight text-white">
              {cta.title}
            </h2>
            <p className="mt-4 max-w-md text-lg text-white/70">{cta.subtitle}</p>
            <ul className="mt-8 space-y-3">
              {cta.bullets.map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/85">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-cyan/20 text-cyan">
                    <Check className="h-4 w-4" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow-card-hover dark:bg-darkcard">
            {sent ? (
              <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-gradient text-white">
                  <Check className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-navy dark:text-white">{cta.successTitle}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{cta.successCopy}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Field label="Full name" id="cta-name">
                  <input
                    id="cta-name"
                    required
                    className={inputClass}
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </Field>
                <Field label="Email" id="cta-email">
                  <input
                    id="cta-email"
                    type="email"
                    required
                    className={inputClass}
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </Field>
                <Field label="What can we help with?" id="cta-msg">
                  <textarea
                    id="cta-msg"
                    rows={4}
                    className={inputClass}
                    placeholder="A few words about your project…"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  />
                </Field>
                {error && <p className="text-sm text-rose-500">{error}</p>}
                <Button type="submit" className="w-full" arrow disabled={sending}>
                  {sending ? "Sending…" : "Get a Free Consultation"}
                </Button>
                <p className="flex items-center justify-center gap-1 text-xs text-slate-400">
                  {cta.formNote} <ArrowUpRight className="h-3 w-3" />
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-navy outline-none transition-colors placeholder:text-slate-400 focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/20 dark:border-white/10 dark:bg-darkbg dark:text-white dark:focus:bg-darkbg";

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy dark:text-white">{label}</span>
      {children}
    </label>
  );
}
