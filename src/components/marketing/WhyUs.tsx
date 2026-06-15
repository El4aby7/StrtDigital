import { Reveal } from "../Reveal";
import { useSiteContent } from "../../store/SiteContentProvider";
import { resolveIcon } from "../../data/siteContent";

export function WhyUs() {
  const { whyUs } = useSiteContent().content;
  return (
    <section id="why" className="bg-surface py-20 md:py-28 dark:bg-darksurface">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-wide text-teal">
            {whyUs.eyebrow}
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-navy dark:text-white">{whyUs.title}</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{whyUs.subtitle}</p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-brand-gradient px-6 py-4 text-white shadow-card">
            <span className="font-display text-3xl font-bold">{whyUs.statValue}</span>
            <span className="text-sm leading-tight text-white/80">{whyUs.statLabel}</span>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {whyUs.items.map((v, i) => {
            const Icon = resolveIcon(v.icon);
            return (
              <Reveal key={`${v.title}-${i}`} delay={i * 80}>
                <div className="h-full rounded-2xl border border-line bg-white p-6 shadow-card dark:border-white/10 dark:bg-darkcard">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-gradient-soft text-teal-dark">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-navy dark:text-white">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{v.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
