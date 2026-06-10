import { processSteps } from "../../data/content";
import { Reveal } from "../Reveal";

export function Process() {
  return (
    <section id="process" className="bg-navy py-20 text-white md:py-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-cyan">
            How we work
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-white">
            A simple, proven process
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Four clear steps from first conversation to compounding growth.
          </p>
        </Reveal>

        <div className="relative mt-16 grid gap-8 md:grid-cols-4">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-teal/0 via-teal/50 to-cyan/0 md:block" />
          {processSteps.map((step, i) => (
            <Reveal key={step.number} delay={i * 90}>
              <div className="relative">
                <div className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient font-display text-lg font-bold text-white shadow-card-hover">
                  {step.number}
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{step.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
