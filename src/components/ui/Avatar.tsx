import { cn } from "../../lib/cn";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Shows the uploaded avatar image when present, otherwise initials on the
// member's brand colour. `className` controls size (h-/w-) and text size.
export function Avatar({
  name,
  color,
  url,
  className,
}: {
  name: string;
  color: string;
  url?: string | null;
  className?: string;
}) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-full font-bold text-white", className)}
      style={{ background: color }}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}
