import { Star, Quote } from "lucide-react";
import { Reveal } from "../Reveal";
import { useSiteContent } from "../../store/SiteContentProvider";

export function Testimonials() {
  const { testimonials } = useSiteContent().content;
  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-teal">
            {testimonials.eyebrow}
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-navy">
            {testimonials.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.items.map((t, i) => (
            <Reveal key={`${t.name}-${i}`} delay={i * 80}>
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-7 shadow-card">
                <Quote className="h-8 w-8 text-teal/30" />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">
                  "{t.quote}"
                </blockquote>
                <div className="mt-5 flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-navy">{t.name}</span>
                    <span className="block text-xs text-slate-500">{t.company}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
