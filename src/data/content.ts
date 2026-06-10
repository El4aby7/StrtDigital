// Static marketing content for the public site.
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
  type LucideIcon,
} from "lucide-react";

export interface Service {
  icon: LucideIcon;
  title: string;
  copy: string;
}

export const services: Service[] = [
  { icon: Monitor, title: "Web Design", copy: "Conversion-focused, pixel-perfect websites built to perform." },
  { icon: ShoppingCart, title: "eCommerce", copy: "Fast, scalable storefronts that turn browsers into buyers." },
  { icon: Search, title: "SEO", copy: "Rank higher and capture intent with technical, on-page SEO." },
  { icon: Palette, title: "Branding", copy: "Distinct identities — logo, system, and voice that stick." },
  { icon: Megaphone, title: "Marketing", copy: "Campaigns across search, social, and email that compound." },
  { icon: LifeBuoy, title: "Support", copy: "Ongoing maintenance, tweaks, and tech support you can rely on." },
];

export interface ValueProp {
  icon: LucideIcon;
  title: string;
  copy: string;
}

export const valueProps: ValueProp[] = [
  { icon: Sparkles, title: "Premium design", copy: "Every pixel crafted — interfaces that look and feel expensive." },
  { icon: Zap, title: "Fast delivery", copy: "Tight, predictable timelines without cutting corners." },
  { icon: TrendingUp, title: "Measurable growth", copy: "We design for outcomes and report on the numbers that matter." },
  { icon: HeartHandshake, title: "Dedicated support", copy: "A real team on your side, long after launch day." },
];

export interface CaseStudy {
  id: string;
  name: string;
  category: string;
  result: string;
  blurb: string;
  // gradient swatch used as the card's cover (no external image needed)
  cover: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "northwind",
    name: "Northwind Retail",
    category: "eCommerce",
    result: "+182% online revenue",
    blurb: "Replatformed a tired store into a fast PWA storefront.",
    cover: "linear-gradient(135deg,#0D1B2A,#14B8C4)",
  },
  {
    id: "lumen",
    name: "Lumen Health",
    category: "Corporate Website",
    result: "2.4x qualified leads",
    blurb: "A trustworthy medical brand with a booking-first design.",
    cover: "linear-gradient(135deg,#14B8C4,#2EE6C5)",
  },
  {
    id: "atlas",
    name: "Atlas Logistics",
    category: "Branding",
    result: "Full rebrand in 6 weeks",
    blurb: "New identity system rolled out across 40 touchpoints.",
    cover: "linear-gradient(135deg,#0E96A0,#2EE6C5)",
  },
  {
    id: "verde",
    name: "Verde Coffee",
    category: "Mobile App",
    result: "4.9★ launch rating",
    blurb: "A loyalty app that doubled repeat orders in a quarter.",
    cover: "linear-gradient(135deg,#1B3147,#14B8C4)",
  },
  {
    id: "skyline",
    name: "Skyline Realty",
    category: "SEO",
    result: "Top-3 for 120 keywords",
    blurb: "Technical SEO overhaul that owned the local market.",
    cover: "linear-gradient(135deg,#0D1B2A,#2EE6C5)",
  },
];

export interface ProcessStep {
  number: string;
  title: string;
  copy: string;
}

export const processSteps: ProcessStep[] = [
  { number: "01", title: "Discover", copy: "We learn your goals, audience, and what success looks like." },
  { number: "02", title: "Design", copy: "We craft the experience and interface, iterating with you." },
  { number: "03", title: "Build", copy: "We engineer it fast, responsive, and rock-solid." },
  { number: "04", title: "Grow", copy: "We launch, measure, and optimize for compounding results." },
];

export interface Testimonial {
  quote: string;
  name: string;
  company: string;
  rating: number;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "StrtDigital rebuilt our site and our pipeline in one go. Leads more than doubled within two months.",
    name: "Sara Mahmoud",
    company: "Lumen Health",
    rating: 5,
    initials: "SM",
  },
  {
    quote:
      "The most polished team we've worked with. Premium design, delivered faster than anyone promised.",
    name: "Omar Khaled",
    company: "Northwind Retail",
    rating: 5,
    initials: "OK",
  },
  {
    quote:
      "They treat our growth like their own. Clear reporting, real results, zero drama.",
    name: "Lina Farouk",
    company: "Atlas Logistics",
    rating: 5,
    initials: "LF",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: "How long does a typical project take?",
    a: "Corporate websites usually take 4–8 weeks; eCommerce builds run 8–14 weeks depending on scope. We share a clear timeline before we start.",
  },
  {
    q: "Do you work with brands outside your region?",
    a: "Yes — we work with clients globally and are comfortable across time zones, in both English and Arabic.",
  },
  {
    q: "What does a project cost?",
    a: "Every engagement is scoped to your goals. After a free consultation we send a fixed, transparent quote with no surprises.",
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Absolutely. Our Support plans cover maintenance, updates, and tech support so your site keeps performing.",
  },
  {
    q: "Can you improve an existing website instead of rebuilding?",
    a: "Often, yes. We start with an audit and recommend the highest-impact path — whether that's optimization or a rebuild.",
  },
];
