import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, LayoutTemplate } from "lucide-react";
import { Reveal } from "../Reveal";
import { cn } from "../../lib/cn";
import { scrollToId } from "../../lib/scrollToId";
import { useSiteContent } from "../../store/SiteContentProvider";
import { resolveIcon, type TemplateItem } from "../../data/siteContent";

const ALL = "__all__";

export function Templates() {
  const { templates } = useSiteContent().content;
  const categories = templates?.categories ?? [];
  const [active, setActive] = useState<string>(ALL);

  // Flatten the active selection into the cards to show, tagging each with the
  // category it came from so the "All" view can still label them.
  const visible = useMemo(() => {
    const list: { item: TemplateItem; category: string }[] = [];
    for (const cat of categories) {
      if (active !== ALL && cat.id !== active) continue;
      for (const item of cat.items) list.push({ item, category: cat.name });
    }
    return list;
  }, [categories, active]);

  if (categories.length === 0) return null;

  return (
    <section id="templates" className="py-20 md:py-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-teal">
            {templates.eyebrow}
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-navy dark:text-white">
            {templates.title}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{templates.subtitle}</p>
        </Reveal>

        {/* category filter pills */}
        <Reveal className="mt-10 flex flex-wrap justify-center gap-2.5">
          <FilterPill
            active={active === ALL}
            onClick={() => setActive(ALL)}
            icon={LayoutTemplate}
            label="All"
            count={categories.reduce((n, c) => n + c.items.length, 0)}
          />
          {categories.map((cat) => (
            <FilterPill
              key={cat.id}
              active={active === cat.id}
              onClick={() => setActive(cat.id)}
              icon={resolveIcon(cat.icon)}
              label={cat.name}
              count={cat.items.length}
            />
          ))}
        </Reveal>

        {/* template grid */}
        {visible.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map(({ item, category }, i) => (
              <Reveal key={item.id} delay={(i % 3) * 80}>
                <TemplateCard item={item} category={category} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
            No templates in this category yet — check back soon.
          </p>
        )}

        {/* tail CTA */}
        <Reveal className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Don't see your industry? We build custom templates too.
          </p>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:underline"
          >
            Request a custom template <ArrowUpRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReturnType<typeof resolveIcon>;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
        active
          ? "bg-brand-gradient text-white shadow-card"
          : "border border-line text-slate-600 hover:border-teal hover:text-teal dark:border-white/10 dark:text-slate-300",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 text-xs",
          active ? "bg-white/20 text-white" : "bg-surface text-slate-500 dark:bg-white/10 dark:text-slate-400",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function TemplateCard({ item, category }: { item: TemplateItem; category: string }) {
  const hasImage = !!item.image && item.image.trim().length > 0;
  return (
    <Link
      to={`/templates/${item.id}`}
      className="group block h-full cursor-pointer overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover dark:border-white/10 dark:bg-darkcard"
    >
      {/* cover */}
      <div className="relative aspect-[16/10] overflow-hidden" style={{ background: item.cover }}>
        {hasImage && (
          <img
            src={item.image}
            alt={`${item.name} template preview`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-navy/10 transition-colors group-hover:bg-navy/0" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy backdrop-blur">
          {category}
        </span>
        {/* hover preview overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-navy/40 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy shadow-card">
            View template
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* body */}
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-navy dark:text-white">{item.name}</h3>
          {item.tag.trim() && (
            <span className="shrink-0 rounded-full bg-brand-gradient-soft px-2.5 py-1 text-xs font-semibold text-teal-dark dark:text-teal-light">
              {item.tag}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.blurb}</p>
      </div>
    </Link>
  );
}
