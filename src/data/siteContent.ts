// Editable marketing content model + defaults.
//
// Every section the public site renders is described here as plain JSON (icons are
// stored as string names, resolved via ICONS below, so the whole thing is
// serialisable to the Supabase `site_content` table). The defaults are the original
// hardcoded copy — they render instantly and are also what the admin editor seeds
// from on first edit, so the public site never blanks while Supabase loads.
import {
  Monitor,
  ShoppingCart,
  Search,
  Palette,
  Megaphone,
  LifeBuoy,
  Sparkles,
  Zap,
  TrendingUp,
  HeartHandshake,
  Rocket,
  ShieldCheck,
  Globe,
  Users,
  type LucideIcon,
} from "lucide-react";

// Icon registry — the set offered in the editor's icon picker.
export const ICONS: Record<string, LucideIcon> = {
  Monitor,
  ShoppingCart,
  Search,
  Palette,
  Megaphone,
  LifeBuoy,
  Sparkles,
  Zap,
  TrendingUp,
  HeartHandshake,
  Rocket,
  ShieldCheck,
  Globe,
  Users,
};
export const ICON_NAMES = Object.keys(ICONS);
export function resolveIcon(name: string): LucideIcon {
  return ICONS[name] ?? Sparkles;
}

export interface IconItem {
  icon: string;
  title: string;
  copy: string;
}
export interface CaseStudyItem {
  id: string;
  name: string;
  category: string;
  result: string;
  blurb: string;
  cover: string; // CSS background (gradient)
}
export interface ProcessStepItem {
  number: string;
  title: string;
  copy: string;
}
export interface TestimonialItem {
  quote: string;
  name: string;
  company: string;
  rating: number;
  initials: string;
}
export interface FaqItem {
  q: string;
  a: string;
}

export interface HeroContent {
  badge: string;
  titleLead: string;
  titleAccent: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ratingText: string;
  statLiftLabel: string;
  statLiftValue: string;
  statProjectsLabel: string;
  statProjectsValue: string;
}
export interface ServicesContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: IconItem[];
}
export interface WhyUsContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  statValue: string;
  statLabel: string;
  items: IconItem[];
}
export interface PortfolioContent {
  eyebrow: string;
  title: string;
  items: CaseStudyItem[];
}
export interface ProcessContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: ProcessStepItem[];
}
export interface TestimonialsContent {
  eyebrow: string;
  title: string;
  items: TestimonialItem[];
}
export interface FaqContent {
  eyebrow: string;
  title: string;
  subtitleLead: string;
  items: FaqItem[];
}
export interface CtaContent {
  title: string;
  subtitle: string;
  bullets: string[];
  successTitle: string;
  successCopy: string;
  formNote: string;
}

export interface SiteContent {
  hero: HeroContent;
  services: ServicesContent;
  whyUs: WhyUsContent;
  portfolio: PortfolioContent;
  process: ProcessContent;
  testimonials: TestimonialsContent;
  faqs: FaqContent;
  cta: CtaContent;
}

export type SiteContentKey = keyof SiteContent;

export const defaultContent: SiteContent = {
  hero: {
    badge: "For All Digital Solutions",
    titleLead: "Digital solutions that",
    titleAccent: "start your growth.",
    subtitle:
      "We design, build, and grow premium websites and brands for ambitious businesses. Strategy, design, and engineering under one roof.",
    ctaPrimary: "Get a Free Consultation",
    ctaSecondary: "View our work",
    ratingText: "Trusted by 50+ growing brands",
    statLiftLabel: "Avg. revenue lift",
    statLiftValue: "+182%",
    statProjectsLabel: "Projects delivered",
    statProjectsValue: "120+",
  },
  services: {
    eyebrow: "What we do",
    title: "Everything you need to grow online",
    subtitle:
      "One partner for design, build, and marketing — so your digital presence works as hard as you do.",
    items: [
      { icon: "Monitor", title: "Web Design", copy: "Conversion-focused, pixel-perfect websites built to perform." },
      { icon: "ShoppingCart", title: "eCommerce", copy: "Fast, scalable storefronts that turn browsers into buyers." },
      { icon: "Search", title: "SEO", copy: "Rank higher and capture intent with technical, on-page SEO." },
      { icon: "Palette", title: "Branding", copy: "Distinct identities — logo, system, and voice that stick." },
      { icon: "Megaphone", title: "Marketing", copy: "Campaigns across search, social, and email that compound." },
      { icon: "LifeBuoy", title: "Support", copy: "Ongoing maintenance, tweaks, and tech support you can rely on." },
    ],
  },
  whyUs: {
    eyebrow: "Why StrtDigital",
    title: "A premium partner, not just a vendor",
    subtitle:
      "We combine the polish of a high-end agency with the clarity and speed of a modern product team. Here's what that means for you.",
    statValue: "98%",
    statLabel: "client retention, year over year",
    items: [
      { icon: "Sparkles", title: "Premium design", copy: "Every pixel crafted — interfaces that look and feel expensive." },
      { icon: "Zap", title: "Fast delivery", copy: "Tight, predictable timelines without cutting corners." },
      { icon: "TrendingUp", title: "Measurable growth", copy: "We design for outcomes and report on the numbers that matter." },
      { icon: "HeartHandshake", title: "Dedicated support", copy: "A real team on your side, long after launch day." },
    ],
  },
  portfolio: {
    eyebrow: "Growth stories",
    title: "Work that moves the numbers",
    items: [
      { id: "northwind", name: "Northwind Retail", category: "eCommerce", result: "+182% online revenue", blurb: "Replatformed a tired store into a fast PWA storefront.", cover: "linear-gradient(135deg,#0D1B2A,#14B8C4)" },
      { id: "lumen", name: "Lumen Health", category: "Corporate Website", result: "2.4x qualified leads", blurb: "A trustworthy medical brand with a booking-first design.", cover: "linear-gradient(135deg,#14B8C4,#2EE6C5)" },
      { id: "atlas", name: "Atlas Logistics", category: "Branding", result: "Full rebrand in 6 weeks", blurb: "New identity system rolled out across 40 touchpoints.", cover: "linear-gradient(135deg,#0E96A0,#2EE6C5)" },
      { id: "verde", name: "Verde Coffee", category: "Mobile App", result: "4.9★ launch rating", blurb: "A loyalty app that doubled repeat orders in a quarter.", cover: "linear-gradient(135deg,#1B3147,#14B8C4)" },
      { id: "skyline", name: "Skyline Realty", category: "SEO", result: "Top-3 for 120 keywords", blurb: "Technical SEO overhaul that owned the local market.", cover: "linear-gradient(135deg,#0D1B2A,#2EE6C5)" },
    ],
  },
  process: {
    eyebrow: "How we work",
    title: "A simple, proven process",
    subtitle: "Four clear steps from first conversation to compounding growth.",
    steps: [
      { number: "01", title: "Discover", copy: "We learn your goals, audience, and what success looks like." },
      { number: "02", title: "Design", copy: "We craft the experience and interface, iterating with you." },
      { number: "03", title: "Build", copy: "We engineer it fast, responsive, and rock-solid." },
      { number: "04", title: "Grow", copy: "We launch, measure, and optimize for compounding results." },
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "Loved by the brands we grow",
    items: [
      { quote: "StrtDigital rebuilt our site and our pipeline in one go. Leads more than doubled within two months.", name: "Sara Mahmoud", company: "Lumen Health", rating: 5, initials: "SM" },
      { quote: "The most polished team we've worked with. Premium design, delivered faster than anyone promised.", name: "Omar Khaled", company: "Northwind Retail", rating: 5, initials: "OK" },
      { quote: "They treat our growth like their own. Clear reporting, real results, zero drama.", name: "Lina Farouk", company: "Atlas Logistics", rating: 5, initials: "LF" },
    ],
  },
  faqs: {
    eyebrow: "FAQ",
    title: "Questions, answered",
    subtitleLead: "Everything you need to know before we start. Still curious?",
    items: [
      { q: "How long does a typical project take?", a: "Corporate websites usually take 4–8 weeks; eCommerce builds run 8–14 weeks depending on scope. We share a clear timeline before we start." },
      { q: "Do you work with brands outside your region?", a: "Yes — we work with clients globally and are comfortable across time zones, in both English and Arabic." },
      { q: "What does a project cost?", a: "Every engagement is scoped to your goals. After a free consultation we send a fixed, transparent quote with no surprises." },
      { q: "Do you offer ongoing support after launch?", a: "Absolutely. Our Support plans cover maintenance, updates, and tech support so your site keeps performing." },
      { q: "Can you improve an existing website instead of rebuilding?", a: "Often, yes. We start with an audit and recommend the highest-impact path — whether that's optimization or a rebuild." },
    ],
  },
  cta: {
    title: "Let's build something that grows.",
    subtitle: "Tell us about your project and get a free, no-pressure consultation within 24 hours.",
    bullets: ["Free strategy consultation", "Fixed, transparent quote", "Senior team, fast delivery"],
    successTitle: "Thanks — we're on it!",
    successCopy: "We'll reach out within 24 hours to schedule your consultation.",
    formNote: "No spam. Reply within 24h.",
  },
};

// Human-readable labels for the editor's section tabs.
export const SECTION_LABELS: Record<SiteContentKey, string> = {
  hero: "Hero",
  services: "Services",
  whyUs: "Why Us",
  portfolio: "Portfolio",
  process: "Process",
  testimonials: "Testimonials",
  faqs: "FAQ",
  cta: "Contact / CTA",
};
