import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { cn } from "../../lib/cn";
import { scrollToId } from "../../lib/scrollToId";
import { useTheme } from "../../store/ThemeProvider";

const links = [
  { href: "#services", label: "Services" },
  { href: "#templates", label: "Templates" },
  { href: "#process", label: "Process" },
  { href: "#why", label: "Why us" },
  { href: "#faq", label: "FAQ" },
];

function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to night mode"}
      title={dark ? "Light mode" : "Night mode"}
      className={cn(
        "relative grid h-10 w-10 place-items-center rounded-full border border-line text-navy transition-colors hover:border-teal hover:text-teal dark:border-white/10 dark:text-white/80 dark:hover:border-teal dark:hover:text-teal",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute h-5 w-5 transition-all duration-300",
          dark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "absolute h-5 w-5 transition-all duration-300",
          dark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0",
        )}
      />
    </button>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

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
        scrolled
          ? "border-b border-line bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-darkbg/90"
          : "bg-transparent",
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between md:h-20">
        <a
          href="#top"
          aria-label="StrtDigital home"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("top");
          }}
        >
          <Logo tone={theme === "dark" ? "light" : "dark"} />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(l.href);
              }}
              className="text-sm font-medium text-navy/70 transition-colors hover:text-teal dark:text-white/70 dark:hover:text-teal"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            to="/admin/login"
            className="text-sm font-medium text-navy/70 hover:text-teal dark:text-white/70 dark:hover:text-teal"
          >
            Sign in
          </Link>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("contact");
            }}
          >
            <Button size="sm" arrow>
              Get a Free Consultation
            </Button>
          </a>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            className="grid h-10 w-10 place-items-center rounded-lg text-navy dark:text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-white md:hidden dark:border-white/10 dark:bg-darkbg">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  scrollToId(l.href);
                }}
                className="rounded-lg px-2 py-3 text-sm font-medium text-navy/80 hover:bg-surface dark:text-white/80 dark:hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-3 text-sm font-medium text-navy/80 hover:bg-surface dark:text-white/80 dark:hover:bg-white/5"
            >
              Sign in
            </Link>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                scrollToId("contact");
              }}
            >
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
