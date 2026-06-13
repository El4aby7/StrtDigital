import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Logo, LogoMark } from "../ui/Logo";

// Shared split-panel shell for the auth screens (login / forgot / reset). Keeps the
// existing light, on-brand look in one place so the three pages stay consistent.
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* brand panel */}
      <div className="relative hidden overflow-hidden bg-brand-gradient p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link to="/">
          <Logo tone="light" />
        </Link>
        <div>
          <ArrowUpRight className="h-16 w-16 text-white/90" strokeWidth={1.5} />
          <h1 className="mt-6 max-w-sm font-display text-4xl font-bold leading-tight">
            Run your agency's growth from one place.
          </h1>
          <p className="mt-4 max-w-sm text-white/80">
            KPIs, leads, and expenses — all connected, all in real time.
          </p>
        </div>
        <p className="text-sm text-white/60">© {new Date().getFullYear()} StrtDigital</p>
      </div>

      {/* form */}
      <div className="flex items-center justify-center bg-white px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <LogoMark className="h-12 w-12" />
          </div>
          <h2 className="mt-6 font-display text-3xl font-bold text-navy">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

// Shared input styling used across the auth forms (matches the original Login look).
export const authInputClass =
  "w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-navy outline-none transition-colors placeholder:text-slate-400 focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/20";
