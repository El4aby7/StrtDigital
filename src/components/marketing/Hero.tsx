import { ArrowUpRight, TrendingUp, Star } from "lucide-react";
import { Button } from "../ui/Button";
import { scrollToId } from "../../lib/scrollToId";
import { useSiteContent } from "../../store/SiteContentProvider";

export function Hero() {
  const { hero } = useSiteContent().content;
  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      {/* soft brand glow */}
      <div className="pointer-events-none absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-brand-gradient opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full bg-cyan/20 blur-3xl" />

      <div className="container-page relative grid items-center gap-12 pb-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-teal-dark">
            <TrendingUp className="h-3.5 w-3.5" />
            {hero.badge}
          </span>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-navy sm:text-6xl">
            {hero.titleLead} <span className="text-gradient">{hero.titleAccent}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">{hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}>
              <Button size="lg" arrow>
                {hero.ctaPrimary}
              </Button>
            </a>
            <a href="#work" onClick={(e) => { e.preventDefault(); scrollToId("work"); }}>
              <Button size="lg" variant="outline">
                {hero.ctaSecondary}
              </Button>
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <div className="flex -space-x-3">
              {["#14B8C4", "#0D1B2A", "#2EE6C5", "#0E96A0"].map((c) => (
                <span
                  key={c}
                  className="h-9 w-9 rounded-full border-2 border-white"
                  style={{ background: c }}
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-500">{hero.ratingText}</p>
            </div>
          </div>
        </div>

        {/* visual */}
        <div className="relative animate-fade-up">
          <div className="relative aspect-square rounded-3xl bg-brand-gradient p-1 shadow-card-hover">
            <div className="grid h-full w-full place-items-center rounded-[1.35rem] bg-navy/95">
              <ArrowUpRight className="h-40 w-40 text-cyan" strokeWidth={1.5} />
            </div>
          </div>
          {/* floating stat cards */}
          <div className="absolute -left-6 top-10 rounded-2xl border border-line bg-white p-4 shadow-card">
            <p className="text-xs text-slate-400">{hero.statLiftLabel}</p>
            <p className="font-display text-2xl font-bold text-navy">{hero.statLiftValue}</p>
          </div>
          <div className="absolute -bottom-6 right-2 rounded-2xl border border-line bg-white p-4 shadow-card">
            <p className="text-xs text-slate-400">{hero.statProjectsLabel}</p>
            <p className="font-display text-2xl font-bold text-navy">{hero.statProjectsValue}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
