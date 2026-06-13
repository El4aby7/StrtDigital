import { Link } from "react-router-dom";
import { Linkedin, Twitter, Instagram, Facebook, Mail } from "lucide-react";
import { Logo } from "../ui/Logo";
import { scrollToId } from "../../lib/scrollToId";

// Each footer link maps to the on-page section it should scroll to. This is a
// single-page marketing site, so every link points at one of the real section ids
// (#services, #work, #process, #why, #faq, #contact) rather than a dead "#".
const columns: { title: string; links: { label: string; target: string }[] }[] = [
  {
    title: "Services",
    links: [
      { label: "Web Design", target: "services" },
      { label: "eCommerce", target: "services" },
      { label: "SEO", target: "services" },
      { label: "Branding", target: "services" },
      { label: "Marketing", target: "services" },
      { label: "Support", target: "contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", target: "why" },
      { label: "Work", target: "work" },
      { label: "Process", target: "process" },
      { label: "Contact", target: "contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Case Studies", target: "work" },
      { label: "FAQ", target: "faq" },
      { label: "Get a quote", target: "contact" },
    ],
  },
];

// Social profiles. Replace these with the real StrtDigital handles when available;
// until then they scroll to the contact form rather than dead-ending on "#".
const socials: { Icon: typeof Linkedin; label: string; href?: string }[] = [
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Twitter, label: "X / Twitter" },
  { Icon: Instagram, label: "Instagram" },
  { Icon: Facebook, label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo tone="light" />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            For All Digital Solutions. We design and build premium digital
            experiences that start your growth.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href ?? "#contact"}
                target={href ? "_blank" : undefined}
                rel={href ? "noopener noreferrer" : undefined}
                onClick={
                  href ? undefined : (e) => { e.preventDefault(); scrollToId("contact"); }
                }
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-teal hover:text-white"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-white">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={`#${l.target}`}
                    onClick={(e) => { e.preventDefault(); scrollToId(l.target); }}
                    className="text-sm text-white/60 transition-colors hover:text-teal"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-sm text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} StrtDigital. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <a href="mailto:strtdigital.site@gmail.com" className="hover:text-teal">
              strtdigital.site@gmail.com
            </a>
          </div>
          <Link to="/admin/login" className="hover:text-teal">
            Admin sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}
