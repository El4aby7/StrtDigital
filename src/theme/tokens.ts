// Brand tokens — single source of truth for values that JS/SVG/recharts need
// (recharts cannot read Tailwind classes). Keep in sync with tailwind.config.js.

export const colors = {
  navy: "#0D1B2A",
  navy700: "#1B3147",
  teal: "#14B8C4",
  tealLight: "#5AD3DB",
  tealDark: "#0E96A0",
  cyan: "#2EE6C5",
  surface: "#F6F9FB",
  line: "#E6EDF2",
  white: "#FFFFFF",
  // semantic
  success: "#16A34A",
  danger: "#DC2626",
  warning: "#D97706",
  muted: "#64748B",
} as const;

// Ordered palette for charts (leads-by-source, etc.)
export const chartPalette = [
  colors.teal,
  colors.navy,
  colors.cyan,
  colors.tealDark,
  colors.navy700,
  colors.tealLight,
];

export const brandGradient = "linear-gradient(135deg, #0D1B2A 0%, #14B8C4 55%, #2EE6C5 100%)";
