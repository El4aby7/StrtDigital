import { Reveal } from "../Reveal";
import { useSiteContent } from "../../store/SiteContentProvider";

// Renders the admin's custom fields (added from Site Content → Custom). Hidden
// entirely when there are none, so it never leaves an empty band on the page.
export function CustomBlocks() {
  const { custom } = useSiteContent().content;
  const fields = custom.fields.filter((f) => f.label.trim() || f.value.trim());
  if (fields.length === 0) return null;

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container-page">
        {custom.heading.trim() && (
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold text-navy">{custom.heading}</h2>
          </Reveal>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((f, i) => (
            <Reveal key={f.id} delay={i * 70}>
              <div className="h-full rounded-2xl border border-line bg-white p-6 shadow-card">
                <p className="text-sm font-semibold uppercase tracking-wide text-teal">{f.label}</p>
                <p className="mt-2 whitespace-pre-line text-slate-700">{f.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
