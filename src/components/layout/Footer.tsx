import { Link } from "react-router-dom";
import { Linkedin, Twitter, Instagram, Facebook, Mail } from "lucide-react";
import { Logo } from "../ui/Logo";

const columns = [
  {
    title: "Services",
    links: ["Web Design", "eCommerce", "SEO", "Branding", "Marketing", "Support"],
  },
  {
    title: "Company",
    links: ["About", "Work", "Process", "Careers", "Contact"],
  },
  {
    title: "Resources",
    links: ["Blog", "Case Studies", "FAQ", "Privacy", "Terms"],
  },
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
            {[Linkedin, Twitter, Instagram, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-teal hover:text-white"
                aria-label="Social link"
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
                <li key={l}>
                  <a href="#" className="text-sm text-white/60 transition-colors hover:text-teal">
                    {l}
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
