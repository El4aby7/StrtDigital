import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "../Reveal";
import { cn } from "../../lib/cn";
import { useSiteContent } from "../../store/SiteContentProvider";

export function PortfolioCarousel() {
  const { portfolio } = useSiteContent().content;
  const caseStudies = portfolio.items;
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(caseStudies.length - 1, index));
    const card = track.children[clamped] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    setActive(clamped);
  };

  return (
    <section id="work" className="py-20 md:py-28">
      <div className="container-page">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wide text-teal">
              {portfolio.eyebrow}
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold text-navy dark:text-white">
              {portfolio.title}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollTo(active - 1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-navy transition-colors hover:border-teal hover:text-teal dark:border-white/10 dark:text-white"
              aria-label="Previous"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollTo(active + 1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-navy transition-colors hover:border-teal hover:text-teal dark:border-white/10 dark:text-white"
              aria-label="Next"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>

        <div
          ref={trackRef}
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(e) => {
            const track = e.currentTarget;
            const idx = Math.round(track.scrollLeft / (track.scrollWidth / caseStudies.length));
            setActive(Math.min(caseStudies.length - 1, idx));
          }}
        >
          {caseStudies.map((c) => (
            <article
              key={c.id}
              className="group w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[38%]"
            >
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card"
                style={{ background: c.cover }}
              >
                <div className="absolute inset-0 bg-navy/10" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy">
                  {c.category}
                </span>
                <ArrowUpRight className="absolute right-4 top-4 h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-4 backdrop-blur">
                  <p className="font-display text-lg font-bold text-navy">{c.name}</p>
                  <p className="text-sm font-semibold text-teal">{c.result}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{c.blurb}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {caseStudies.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all",
                i === active ? "w-8 bg-teal" : "w-2 bg-line hover:bg-slate-300 dark:bg-white/15",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
