import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padded?: boolean;
}

export function Card({ hover, padded = true, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white shadow-card",
        padded && "p-6",
        hover && "transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
