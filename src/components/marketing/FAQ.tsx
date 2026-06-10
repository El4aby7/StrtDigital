import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faqs } from "../../data/content";
import { Reveal } from "../Reveal";
import { cn } from "../../lib/cn";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-surface py-20 md:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-wide text-teal">FAQ</span>
          <h2 className="mt-3 font-display text-4xl font-bold text-navy">
            Questions, answered
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to know before we start. Still curious?{" "}
            <a href="#contact" className="font-semibold text-teal hover:underline">
              Talk to us
            </a>
            .
          </p>
        </Reveal>

        <Reveal>
          <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-base font-semibold text-navy">{f.q}</span>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-gradient-soft text-teal-dark">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid overflow-hidden transition-all duration-300",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
