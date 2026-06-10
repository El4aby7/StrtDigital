import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { cn } from "../../lib/cn";

const links = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#why", label: "Why us" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled ? "border-b border-line bg-white/90 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between md:h-20">
        <a href="#top" aria-label="StrtDigital home">
          <Logo tone="dark" />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-navy/70 transition-colors hover:text-teal"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/admin/login" className="text-sm font-medium text-navy/70 hover:text-teal">
            Sign in
          </Link>
          <a href="#contact">
            <Button size="sm" arrow>
              Get a Free Consultation
            </Button>
          </a>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-navy md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-white md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-navy/80 hover:bg-surface"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-3 text-sm font-medium text-navy/80 hover:bg-surface"
            >
              Sign in
            </Link>
            <a href="#contact" onClick={() => setOpen(false)}>
              <Button className="mt-2 w-full" arrow>
                Get a Free Consultation
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
