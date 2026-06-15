import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Logo } from "../ui/Logo";
import { scrollToId } from "../../lib/scrollToId";
import { useSiteContent } from "../../store/SiteContentProvider";
import { resolveSocialIcon } from "../../data/siteContent";

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
      { label: "Templates", target: "templates" },
      { label: "Process", target: "process" },
      { label: "Contact", target: "contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Templates", target: "templates" },
      { label: "FAQ", target: "faq" },
      { label: "Get a quote", target: "contact" },
    ],
  },
];

export function Footer() {
  const { social } = useSiteContent().content;
  const socials = (social?.links ?? []).filter((l) => l.enabled);
  const email = social?.email?.trim() || "strtdigital.site@gmail.com";

  return (
    <footer className="bg-navy text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo tone="light" />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            For All Digital Solutions. We design and build premium digital
            experiences that start your growth.
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socials.map((s) => {
                const Icon = resolveSocialIcon(s.platform);
                const external = s.url.trim().length > 0;
                return (
                  <a
                    key={s.id}
                    href={external ? s.url : "#contact"}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    onClick={
                      external ? undefined : (e) => { e.preventDefault(); scrollToId("contact"); }
                    }
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-teal hover:text-white"
                    aria-label={s.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
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
            <a href={`mailto:${email}`} className="hover:text-teal">
              {email}
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
