import { useState } from "react";
import { cn } from "../../lib/cn";

// SD monogram with an upward-arrow growth motif. If a Main_Logo.png is dropped
// into /public it is used automatically; otherwise this on-brand SVG renders.

interface LogoProps {
  /** "light" for dark backgrounds (navbar over gradient), "dark" for white bg. */
  tone?: "light" | "dark";
  withWordmark?: boolean;
  className?: string;
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="StrtDigital logo">
      <defs>
        <linearGradient id="sd-logo-grad" x1="0" y1="64" x2="64" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0D1B2A" />
          <stop offset="0.55" stopColor="#14B8C4" />
          <stop offset="1" stopColor="#2EE6C5" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#sd-logo-grad)" />
      {/* upward arrow */}
      <path d="M32 15 L45 30 H38 V49 H26 V30 H19 Z" fill="#fff" />
    </svg>
  );
}

export function Logo({ tone = "dark", withWordmark = true, className }: LogoProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {imgFailed ? (
        <LogoMark className="h-9 w-9 shrink-0" />
      ) : (
        <img
          src="./Main%20Logo.svg"
          alt="StrtDigital"
          className="h-9 w-9 shrink-0 rounded-lg object-contain"
          onError={() => setImgFailed(true)}
        />
      )}
      {withWordmark && (
        <span className="font-display text-lg font-bold leading-none">
          <span className={tone === "light" ? "text-white" : "text-navy"}>Strt</span>
          <span className="text-teal">Digital</span>
        </span>
      )}
    </span>
  );
}
