import { forwardRef, type ButtonHTMLAttributes } from "react";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "solid" | "outline" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  /** show the brand upward-arrow accent on the right */
  arrow?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-gradient text-white shadow-card hover:shadow-card-hover hover:-translate-y-0.5",
  solid: "bg-teal text-white hover:bg-teal-dark",
  outline: "border border-line text-navy hover:border-teal hover:text-teal bg-white",
  ghost: "text-navy hover:bg-navy-100",
  white: "bg-white text-navy shadow-card hover:shadow-card-hover hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", icon: Icon, arrow, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden />}
      {children}
      {arrow && <ArrowUpRight className="h-4 w-4" aria-hidden />}
    </button>
  );
});
