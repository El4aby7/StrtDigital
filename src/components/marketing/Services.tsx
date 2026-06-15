import { ArrowUpRight } from "lucide-react";
import { Reveal } from "../Reveal";
import { useSiteContent } from "../../store/SiteContentProvider";
import { resolveIcon } from "../../data/siteContent";

export function Services() {
  const { services } = useSiteContent().content;
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-teal">
            {services.eyebrow}
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-navy dark:text-white">
            {services.title}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{services.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((s, i) => {
            const Icon = resolveIcon(s.icon);
            return (
              <Reveal key={`${s.title}-${i}`} delay={i * 70}>
                <article className="group h-full rounded-2xl border border-line bg-white p-7 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover dark:border-white/10 dark:bg-darkcard">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-gradient-soft text-teal-dark transition-colors group-hover:bg-brand-gradient group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-slate-300 transition-colors group-hover:text-teal" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-navy dark:text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{s.copy}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
