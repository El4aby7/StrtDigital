import { useState, useRef, type ReactNode, type ComponentType } from "react";
import { Navigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Check,
  ExternalLink,
  Upload,
  Sparkles,
  LayoutGrid,
  Award,
  LayoutTemplate,
  ListChecks,
  Quote,
  HelpCircle,
  Mail,
  Share2,
  Puzzle,
  Images,
} from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/cn";
import { useSiteContent } from "../../store/SiteContentProvider";
import { useAppData } from "../../store/AppDataProvider";
import { uploadSiteImage } from "../../store/supabaseRepo";
import {
  ICON_NAMES,
  SECTION_LABELS,
  SOCIAL_ICON_NAMES,
  type SiteContent,
  type SiteContentKey,
  type HeroContent,
  type ServicesContent,
  type WhyUsContent,
  type PortfolioContent,
  type TemplatesContent,
  type TemplateCategory,
  type TemplateItem,
  type ProcessContent,
  type TestimonialsContent,
  type FaqContent,
  type CtaContent,
  type IconItem,
  type CaseStudyItem,
  type ProcessStepItem,
  type TestimonialItem,
  type FaqItem,
  type SocialContent,
  type SocialLink,
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

// Image field with both a URL input and an "upload from your computer" button that
// pushes the file to the public site-images bucket and stores the resulting URL.
function ImageUploadField({
  value,
  cover,
  onChange,
}: {
  value: string;
  cover?: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      onChange(await uploadSiteImage(file));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-slate-500">
        Preview image (upload a screenshot, or paste a URL)
      </span>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <input
            value={value}
            placeholder="https://…/screenshot.png"
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          />
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={Upload}
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Uploading…" : "Upload"}
        </Button>
        <span
          className="h-10 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-cover bg-center"
          style={{
            background: cover,
            backgroundImage: value.trim() ? `url(${value})` : undefined,
            backgroundSize: "cover",
          }}
          aria-hidden
        />
      </div>
      {err && <p className="mt-1 text-xs text-rose-500">{err}</p>}
    </div>
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
        <div key={i} className="relative rounded-xl border border-line bg-white p-4 pl-5 pr-12">
          <span className="absolute -left-2.5 -top-2.5 grid h-6 w-6 place-items-center rounded-full bg-brand-gradient text-xs font-bold text-white shadow-card">
            {i + 1}
          </span>
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

function TemplatesEditor({ value, onChange }: { value: TemplatesContent; onChange: (v: TemplatesContent) => void }) {
  const set = (patch: Partial<TemplatesContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Eyebrow" value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <Field label="Title" value={value.title} onChange={(v) => set({ title: v })} />
      <Field label="Subtitle" textarea value={value.subtitle} onChange={(v) => set({ subtitle: v })} />
      <p className="text-xs text-slate-500">
        Each category becomes a filter on the public site. Add or remove categories and the templates inside them freely.
      </p>
      <ListEditor<TemplateCategory>
        items={value.categories}
        onChange={(categories) => set({ categories })}
        addLabel="Add category"
        makeNew={() => ({
          id: `cat-${Date.now()}`,
          name: "New category",
          icon: "LayoutTemplate",
          items: [],
        })}
        render={(cat, update) => (
          <div className="space-y-3">
            <Grid>
              <Field label="Category name" value={cat.name} onChange={(v) => update({ name: v })} />
              <IconSelect value={cat.icon} onChange={(v) => update({ icon: v })} />
            </Grid>
            <div className="rounded-xl border border-line bg-surface p-3">
              <span className="mb-2 block text-xs font-medium text-slate-500">Templates in “{cat.name}”</span>
              <ListEditor<TemplateItem>
                items={cat.items}
                onChange={(items) => update({ items })}
                addLabel="Add template"
                makeNew={() => ({
                  id: `tpl-${Date.now()}`,
                  name: "",
                  tag: "",
                  blurb: "",
                  cover: "linear-gradient(135deg,#0D1B2A,#14B8C4)",
                  image: "",
                  url: "",
                })}
                render={(tpl, updateTpl) => (
                  <div className="space-y-3">
                    <Grid>
                      <Field label="Name" value={tpl.name} onChange={(v) => updateTpl({ name: v })} />
                      <Field label="Tag (e.g. eCommerce)" value={tpl.tag} onChange={(v) => updateTpl({ tag: v })} />
                    </Grid>
                    <Field label="Blurb" textarea rows={2} value={tpl.blurb} onChange={(v) => updateTpl({ blurb: v })} />
                    <ImageUploadField
                      value={tpl.image ?? ""}
                      cover={tpl.cover}
                      onChange={(v) => updateTpl({ image: v })}
                    />
                    <Field
                      label="Cover gradient (shown if no image)"
                      value={tpl.cover}
                      onChange={(v) => updateTpl({ cover: v })}
                    />
                    <Field
                      label="Live preview URL (optional)"
                      value={tpl.url}
                      placeholder="https://demo.example.com"
                      onChange={(v) => updateTpl({ url: v })}
                    />
                  </div>
                )}
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

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line bg-white px-4 py-3">
      <span>
        <span className="block text-sm font-medium text-navy">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-teal" : "bg-slate-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[1.375rem]" : "left-0.5",
          )}
        />
      </button>
    </label>
  );
}

function SocialEditor({ value, onChange }: { value: SocialContent; onChange: (v: SocialContent) => void }) {
  const set = (patch: Partial<SocialContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-5">
      {/* WhatsApp direct-contact */}
      <div className="space-y-3 rounded-xl border border-line bg-white p-4">
        <h3 className="text-sm font-semibold text-navy">WhatsApp contact</h3>
        <Toggle
          label="Show WhatsApp button"
          hint="A floating chat button on every public page."
          checked={value.whatsappEnabled}
          onChange={(whatsappEnabled) => set({ whatsappEnabled })}
        />
        <Grid>
          <Field
            label="WhatsApp number (with country code)"
            value={value.whatsappNumber}
            placeholder="e.g. +20 100 123 4567"
            onChange={(whatsappNumber) => set({ whatsappNumber })}
          />
          <Field
            label="Contact email"
            value={value.email}
            placeholder="hello@strtdigital.site"
            onChange={(email) => set({ email })}
          />
        </Grid>
        <Field
          label="Prefilled message"
          textarea
          rows={2}
          value={value.whatsappMessage}
          placeholder="Hi StrtDigital! I'd love a free consultation."
          onChange={(whatsappMessage) => set({ whatsappMessage })}
        />
      </div>

      {/* Social rail + links */}
      <div className="space-y-3 rounded-xl border border-line bg-white p-4">
        <h3 className="text-sm font-semibold text-navy">Social links</h3>
        <Toggle
          label="Show the floating side rail"
          hint="Vertical icons pinned to the screen edge across the site."
          checked={value.railEnabled}
          onChange={(railEnabled) => set({ railEnabled })}
        />
        <p className="text-xs text-slate-500">
          Leave a URL empty to make that icon scroll to the contact form instead of opening a profile.
        </p>
        <ListEditor<SocialLink>
          items={value.links}
          onChange={(links) => set({ links })}
          addLabel="Add social link"
          makeNew={() => ({
            id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            platform: "Instagram",
            label: "Instagram",
            url: "",
            enabled: true,
          })}
          render={(item, update) => (
            <div className="space-y-3">
              <Grid>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">Platform</span>
                  <select
                    value={item.platform}
                    onChange={(e) => update({ platform: e.target.value })}
                    className={inputCls}
                  >
                    {SOCIAL_ICON_NAMES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <Field label="Label" value={item.label} onChange={(v) => update({ label: v })} />
              </Grid>
              <Field
                label="URL"
                value={item.url}
                placeholder="https://instagram.com/strtdigital"
                onChange={(v) => update({ url: v })}
              />
              <Toggle
                label="Visible"
                checked={item.enabled}
                onChange={(enabled) => update({ enabled })}
              />
            </div>
          )}
        />
      </div>
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
  "templates",
  "process",
  "testimonials",
  "faqs",
  "cta",
  "social",
  "custom",
];

// Icon + one-line description for each section, shown in the nav rail and panel header.
const SECTION_META: Record<SiteContentKey, { icon: ComponentType<{ className?: string }>; description: string }> = {
  hero: { icon: Sparkles, description: "The headline, intro, and call-to-action at the very top of the page." },
  services: { icon: LayoutGrid, description: "The grid of services you offer, each with an icon and blurb." },
  whyUs: { icon: Award, description: "Your differentiators and the standout stat that builds trust." },
  portfolio: { icon: Images, description: "Case-study cards (legacy section — hidden from the live site)." },
  templates: { icon: LayoutTemplate, description: "Industry template categories and the templates inside each." },
  process: { icon: ListChecks, description: "The step-by-step of how you work with clients." },
  testimonials: { icon: Quote, description: "Client quotes, names, and star ratings." },
  faqs: { icon: HelpCircle, description: "Frequently asked questions and their answers." },
  cta: { icon: Mail, description: "The closing contact band and its lead-capture form copy." },
  social: { icon: Share2, description: "WhatsApp, email, and the floating social link rail." },
  custom: { icon: Puzzle, description: "Your own extra labelled cards, shown near the bottom of the page." },
};

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
      case "templates":
        return <TemplatesEditor value={draft as TemplatesContent} onChange={setDraft} />;
      case "process":
        return <ProcessEditor value={draft as ProcessContent} onChange={setDraft} />;
      case "testimonials":
        return <TestimonialsEditor value={draft as TestimonialsContent} onChange={setDraft} />;
      case "faqs":
        return <FaqEditor value={draft as FaqContent} onChange={setDraft} />;
      case "cta":
        return <CtaEditor value={draft as CtaContent} onChange={setDraft} />;
      case "social":
        return <SocialEditor value={draft as SocialContent} onChange={setDraft} />;
      case "custom":
        return <CustomEditor value={draft as CustomContent} onChange={setDraft} />;
    }
  };

  const dirty = JSON.stringify(draft) !== JSON.stringify(source);
  const meta = SECTION_META[section];
  const SectionIcon = meta.icon;

  return (
    <div>
      <PageHeader
        title="Site Content"
        subtitle="Edit the public website. Changes publish to all visitors."
        actions={
          <>
            {dirty && status !== "saving" && (
              <span className="hidden items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Unsaved changes
              </span>
            )}
            <a href="#/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" icon={ExternalLink}>
                View site
              </Button>
            </a>
            <Button size="sm" onClick={save} disabled={status === "saving" || !dirty}>
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

      <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
        {/* section nav rail */}
        <nav className="rounded-2xl border border-line bg-white p-2 lg:sticky lg:top-20">
          {SECTION_ORDER.map((k) => {
            const Icon = SECTION_META[k].icon;
            const active = section === k;
            return (
              <button
                key={k}
                onClick={() => setSection(k)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "mb-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-gradient text-white shadow-card"
                    : "text-slate-600 hover:bg-surface hover:text-navy",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                    active ? "bg-white/20 text-white" : "bg-surface text-teal-dark",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {SECTION_LABELS[k]}
              </button>
            );
          })}
        </nav>

        {/* editor panel */}
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <header className="mb-5 flex items-start gap-3 border-b border-line pb-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-gradient-soft text-teal-dark">
              <SectionIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-navy">{SECTION_LABELS[section]}</h2>
              <p className="mt-0.5 text-sm text-slate-500">{meta.description}</p>
            </div>
          </header>

          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : (
            renderEditor()
          )}
        </div>
      </div>
    </div>
  );
}
