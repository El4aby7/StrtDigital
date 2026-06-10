import { Hero } from "../../components/marketing/Hero";
import { Services } from "../../components/marketing/Services";
import { WhyUs } from "../../components/marketing/WhyUs";
import { PortfolioCarousel } from "../../components/marketing/PortfolioCarousel";
import { Process } from "../../components/marketing/Process";
import { Testimonials } from "../../components/marketing/Testimonials";
import { FAQ } from "../../components/marketing/FAQ";
import { CTABand } from "../../components/marketing/CTABand";

export function Home() {
  return (
    <>
      <Hero />
      <Services />
      <WhyUs />
      <PortfolioCarousel />
      <Process />
      <Testimonials />
      <FAQ />
      <CTABand />
    </>
  );
}
