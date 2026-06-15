import { useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Plus, Trash2, Check, ExternalLink } from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/cn";
import { useSiteContent } from "../../store/SiteContentProvider";
import { useAppData } from "../../store/AppDataProvider";
import {
  ICON_NAMES,
  SECTION_LABELS,
  type SiteContent,
  type SiteContentKey,
  type HeroContent,
  type ServicesContent,
  type WhyUsContent,
  type PortfolioContent,
  type ProcessContent,
  type TestimonialsContent,
  type FaqContent,
  type CtaContent,
  type IconItem,
  type CaseStudyItem,
  type ProcessStepItem,
  type TestimonialItem,
  type FaqItem,
  type CustomContent,
  type CustomField,
} from "../../data/siteContent";

const inputCls =
  "w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-navy outline-none transition-colors placeholder:text-slate-400 focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/20";

function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={inputCls}
      />
    </label>
  );
}

function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">Icon</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {ICON_NAMES.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
}

// Generic add/remove list editor. `render` returns the fields for one item; the
// supplied `update` merges a partial into that item immutably.
function ListEditor<T>({
  items,
  onChange,
  makeNew,
  addLabel,
  render,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  makeNew: () => T;
  addLabel: string;
  render: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="relative rounded-xl border border-line bg-white p-4 pr-12">
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {render(item, (patch) =>
            onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it))),
          )}
        </div>
      ))}
      <Button variant="outline" size="sm" icon={Plus} onClick={() => onChange([...items, makeNew()])}>
        {addLabel}
      </Button>
    </div>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

// ── per-section editors ─────────────────────────────────────────────────────

function HeroEditor({ value, onChange }: { value: HeroContent; onChange: (v: HeroContent) => void }) {
  const set = (patch: Partial<HeroContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Badge" value={value.badge} onChange={(v) => set({ badge: v })} />
      <Grid>
        <Field label="Title (lead)" value={value.titleLead} onChange={(v) => set({ titleLead: v })} />
        <Field label="Title (accent, coloured)" value={value.titleAccent} onChange={(v) => set({ titleAccent: v })} />
      </Grid>
      <Field label="Subtitle" textarea value={value.subtitle} onChange={(v) => set({ subtitle: v })} />
      <Grid>
        <Field label="Primary button" value={value.ctaPrimary} onChange={(v) => set({ ctaPrimary: v })} />
        <Field label="Secondary button" value={value.ctaSecondary} onChange={(v) => set({ ctaSecondary: v })} />
      </Grid>
      <Field label="Rating text" value={value.ratingText} onChange={(v) => set({ ratingText: v })} />
      <Grid>
        <Field label="Stat 1 label" value={value.statLiftLabel} onChange={(v) => set({ statLiftLabel: v })} />
        <Field label="Stat 1 value" value={value.statLiftValue} onChange={(v) => set({ statLiftValue: v })} />
        <Field label="Stat 2 label" value={value.statProjectsLabel} onChange={(v) => set({ statProjectsLabel: v })} />
        <Field label="Stat 2 value" value={value.statProjectsValue} onChange={(v) => set({ statProjectsValue: v })} />
      </Grid>
    </div>
  );
}

function IconItemsEditor({ items, onChange }: { items: IconItem[]; onChange: (v: IconItem[]) => void }) {
  return (
    <ListEditor<IconItem>
      items={items}
      onChange={onChange}
      addLabel="Add item"
      makeNew={() => ({ icon: "Sparkles", title: "", copy: "" })}
      render={(item, update) => (
        <div className="space-y-3">
          <Grid>
            <Field label="Title" value={item.title} onChange={(v) => update({ title: v })} />
            <IconSelect value={item.icon} onChange={(v) => update({ icon: v })} />
          </Grid>
          <Field label="Copy" textarea rows={2} value={item.copy} onChange={(v) => update({ copy: v })} />
        </div>
      )}
    />
  );
}

function ServicesEditor({ value, onChange }: { value: ServicesContent; onChange: (v: ServicesContent) => void }) {
  const set = (patch: Partial<ServicesContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Eyebrow" value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <Field label="Title" value={value.title} onChange={(v) => set({ title: v })} />
      <Field label="Subtitle" textarea value={value.subtitle} onChange={(v) => set({ subtitle: v })} />
      <IconItemsEditor items={value.items} onChange={(items) => set({ items })} />
    </div>
  );
}

function WhyUsEditor({ value, onChange }: { value: WhyUsContent; onChange: (v: WhyUsContent) => void }) {
  const set = (patch: Partial<WhyUsContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Eyebrow" value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <Field label="Title" value={value.title} onChange={(v) => set({ title: v })} />
      <Field label="Subtitle" textarea value={value.subtitle} onChange={(v) => set({ subtitle: v })} />
      <Grid>
        <Field label="Stat value" value={value.statValue} onChange={(v) => set({ statValue: v })} />
        <Field label="Stat label" value={value.statLabel} onChange={(v) => set({ statLabel: v })} />
      </Grid>
      <IconItemsEditor items={value.items} onChange={(items) => set({ items })} />
    </div>
  );
}

function PortfolioEditor({ value, onChange }: { value: PortfolioContent; onChange: (v: PortfolioContent) => void }) {
  const set = (patch: Partial<PortfolioContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Eyebrow" value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <Field label="Title" value={value.title} onChange={(v) => set({ title: v })} />
      <ListEditor<CaseStudyItem>
        items={value.items}
        onChange={(items) => set({ items })}
        addLabel="Add case study"
        makeNew={() => ({
          id: `case-${Date.now()}`,
          name: "",
          category: "",
          result: "",
          blurb: "",
          cover: "linear-gradient(135deg,#0D1B2A,#14B8C4)",
        })}
        render={(item, update) => (
          <div className="space-y-3">
            <Grid>
              <Field label="Name" value={item.name} onChange={(v) => update({ name: v })} />
              <Field label="Category" value={item.category} onChange={(v) => update({ category: v })} />
            </Grid>
            <Field label="Result" value={item.result} onChange={(v) => update({ result: v })} />
            <Field label="Blurb" textarea rows={2} value={item.blurb} onChange={(v) => update({ blurb: v })} />
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Field label="Cover (CSS background)" value={item.cover} onChange={(v) => update({ cover: v })} />
              </div>
              <span
                className="h-10 w-16 shrink-0 rounded-lg border border-line"
                style={{ background: item.cover }}
                aria-hidden
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}

function ProcessEditor({ value, onChange }: { value: ProcessContent; onChange: (v: ProcessContent) => void }) {
  const set = (patch: Partial<ProcessContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Eyebrow" value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <Field label="Title" value={value.title} onChange={(v) => set({ title: v })} />
      <Field label="Subtitle" textarea value={value.subtitle} onChange={(v) => set({ subtitle: v })} />
      <ListEditor<ProcessStepItem>
        items={value.steps}
        onChange={(steps) => set({ steps })}
        addLabel="Add step"
        makeNew={() => ({ number: "", title: "", copy: "" })}
        render={(item, update) => (
          <div className="space-y-3">
            <Grid>
              <Field label="Number" value={item.number} onChange={(v) => update({ number: v })} />
              <Field label="Title" value={item.title} onChange={(v) => update({ title: v })} />
            </Grid>
            <Field label="Copy" textarea rows={2} value={item.copy} onChange={(v) => update({ copy: v })} />
          </div>
        )}
      />
    </div>
  );
}

function TestimonialsEditor({ value, onChange }: { value: TestimonialsContent; onChange: (v: TestimonialsContent) => void }) {
  const set = (patch: Partial<TestimonialsContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Eyebrow" value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <Field label="Title" value={value.title} onChange={(v) => set({ title: v })} />
      <ListEditor<TestimonialItem>
        items={value.items}
        onChange={(items) => set({ items })}
        addLabel="Add testimonial"
        makeNew={() => ({ quote: "", name: "", company: "", rating: 5, initials: "" })}
        render={(item, update) => (
          <div className="space-y-3">
            <Field label="Quote" textarea value={item.quote} onChange={(v) => update({ quote: v })} />
            <Grid>
              <Field label="Name" value={item.name} onChange={(v) => update({ name: v })} />
              <Field label="Company" value={item.company} onChange={(v) => update({ company: v })} />
              <Field label="Initials" value={item.initials} onChange={(v) => update({ initials: v })} />
              <NumberField label="Rating (1–5)" value={item.rating} onChange={(v) => update({ rating: v })} />
            </Grid>
          </div>
        )}
      />
    </div>
  );
}

function FaqEditor({ value, onChange }: { value: FaqContent; onChange: (v: FaqContent) => void }) {
  const set = (patch: Partial<FaqContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Eyebrow" value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <Field label="Title" value={value.title} onChange={(v) => set({ title: v })} />
      <Field label="Intro line" textarea rows={2} value={value.subtitleLead} onChange={(v) => set({ subtitleLead: v })} />
      <ListEditor<FaqItem>
        items={value.items}
        onChange={(items) => set({ items })}
        addLabel="Add question"
        makeNew={() => ({ q: "", a: "" })}
        render={(item, update) => (
          <div className="space-y-3">
            <Field label="Question" value={item.q} onChange={(v) => update({ q: v })} />
            <Field label="Answer" textarea value={item.a} onChange={(v) => update({ a: v })} />
          </div>
        )}
      />
    </div>
  );
}

function StringListEditor({
  items,
  onChange,
  addLabel,
  label,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  label: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={item}
            onChange={(e) => onChange(items.map((it, j) => (j === i ? e.target.value : it)))}
            className={inputCls}
            aria-label={`${label} ${i + 1}`}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            aria-label="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button variant="outline" size="sm" icon={Plus} onClick={() => onChange([...items, ""])}>
        {addLabel}
      </Button>
    </div>
  );
}

function CtaEditor({ value, onChange }: { value: CtaContent; onChange: (v: CtaContent) => void }) {
  const set = (patch: Partial<CtaContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Title" value={value.title} onChange={(v) => set({ title: v })} />
      <Field label="Subtitle" textarea value={value.subtitle} onChange={(v) => set({ subtitle: v })} />
      <div>
        <span className="mb-1 block text-xs font-medium text-slate-500">Bullets</span>
        <StringListEditor
          items={value.bullets}
          onChange={(bullets) => set({ bullets })}
          addLabel="Add bullet"
          label="Bullet"
        />
      </div>
      <Grid>
        <Field label="Success title" value={value.successTitle} onChange={(v) => set({ successTitle: v })} />
        <Field label="Form note" value={value.formNote} onChange={(v) => set({ formNote: v })} />
      </Grid>
      <Field label="Success copy" textarea rows={2} value={value.successCopy} onChange={(v) => set({ successCopy: v })} />
    </div>
  );
}

function CustomEditor({ value, onChange }: { value: CustomContent; onChange: (v: CustomContent) => void }) {
  const set = (patch: Partial<CustomContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Section heading" value={value.heading} onChange={(v) => set({ heading: v })} />
      <p className="text-xs text-slate-500">
        Add your own fields here — each one shows on the homepage as a labelled card. Leave the list empty to hide the section.
      </p>
      <ListEditor<CustomField>
        items={value.fields}
        onChange={(fields) => set({ fields })}
        addLabel="Add field"
        makeNew={() => ({ id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, label: "", value: "" })}
        render={(item, update) => (
          <div className="space-y-3">
            <Field label="Label" value={item.label} onChange={(v) => update({ label: v })} />
            <Field label="Content" textarea value={item.value} onChange={(v) => update({ value: v })} />
          </div>
        )}
      />
    </div>
  );
}

const SECTION_ORDER: SiteContentKey[] = [
  "hero",
  "services",
  "whyUs",
  "portfolio",
  "process",
  "testimonials",
  "faqs",
  "cta",
  "custom",
];

export function SiteContentEditor() {
  const { content, loading, saveSection } = useSiteContent();
  const { isAdmin } = useAppData();
  const [section, setSection] = useState<SiteContentKey>("hero");
  const source = content[section];
  const [draft, setDraft] = useState<SiteContent[SiteContentKey]>(() => structuredClone(source));
  const [sync, setSync] = useState<{ section: SiteContentKey; source: SiteContent[SiteContentKey] }>({
    section,
    source,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  // Keep the working copy in lockstep with the selected section and the loaded
  // content — done DURING render (not in an effect) so the editor below never
  // renders with a draft from a different section (which would crash, e.g. reading
  // `.items` off the Hero shape). Resets also pick up content hydrated from Supabase.
  if (sync.section !== section || sync.source !== source) {
    setDraft(structuredClone(source));
    setSync({ section, source });
    setStatus("idle");
    setError(null);
  }

  // Site content editing is admin-only (members shouldn't reach this route).
  if (!isAdmin) return <Navigate to="/admin" replace />;

  const save = async () => {
    setStatus("saving");
    setError(null);
    const res = await saveSection(section, draft as never);
    if (res.ok) {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } else {
      setStatus("error");
      setError(res.error ?? "Could not save.");
    }
  };

  const renderEditor = () => {
    switch (section) {
      case "hero":
        return <HeroEditor value={draft as HeroContent} onChange={setDraft} />;
      case "services":
        return <ServicesEditor value={draft as ServicesContent} onChange={setDraft} />;
      case "whyUs":
        return <WhyUsEditor value={draft as WhyUsContent} onChange={setDraft} />;
      case "portfolio":
        return <PortfolioEditor value={draft as PortfolioContent} onChange={setDraft} />;
      case "process":
        return <ProcessEditor value={draft as ProcessContent} onChange={setDraft} />;
      case "testimonials":
        return <TestimonialsEditor value={draft as TestimonialsContent} onChange={setDraft} />;
      case "faqs":
        return <FaqEditor value={draft as FaqContent} onChange={setDraft} />;
      case "cta":
        return <CtaEditor value={draft as CtaContent} onChange={setDraft} />;
      case "custom":
        return <CustomEditor value={draft as CustomContent} onChange={setDraft} />;
    }
  };

  return (
    <div>
      <PageHeader
        title="Site Content"
        subtitle="Edit the public website. Changes publish to all visitors."
        actions={
          <>
            <a href="#/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" icon={ExternalLink}>
                View site
              </Button>
            </a>
            <Button size="sm" onClick={save} disabled={status === "saving"}>
              {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save changes"}
            </Button>
          </>
        }
      />

      {error && (
        <p className="mb-4 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>
      )}
      {status === "saved" && (
        <p className="mb-4 flex items-center gap-2 rounded-xl bg-teal/10 px-4 py-2 text-sm text-teal-dark">
          <Check className="h-4 w-4" /> Saved and published.
        </p>
      )}

      {/* section tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {SECTION_ORDER.map((k) => (
          <button
            key={k}
            onClick={() => setSection(k)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              section === k
                ? "bg-brand-gradient text-white shadow-card"
                : "border border-line text-slate-600 hover:border-teal hover:text-teal",
            )}
          >
            {SECTION_LABELS[k]}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          renderEditor()
        )}
      </div>
    </div>
  );
}
