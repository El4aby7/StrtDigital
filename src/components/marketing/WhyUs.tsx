import { valueProps } from "../../data/content";
import { Reveal } from "../Reveal";

export function WhyUs() {
  return (
    <section id="why" className="bg-surface py-20 md:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-wide text-teal">
            Why StrtDigital
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-navy">
            A premium partner, not just a vendor
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            We combine the polish of a high-end agency with the clarity and speed
            of a modern product team. Here's what that means for you.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-brand-gradient px-6 py-4 text-white shadow-card">
            <span className="font-display text-3xl font-bold">98%</span>
            <span className="text-sm leading-tight text-white/80">
              client retention,
              <br /> year over year
            </span>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {valueProps.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-line bg-white p-6 shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-gradient-soft text-teal-dark">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-navy">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
