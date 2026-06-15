/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0D1B2A",
          50: "#F2F5F8",
          100: "#E6EDF2",
          700: "#1B3147",
          900: "#0D1B2A",
        },
        // Night-mode palette (only the public marketing site opts in via `dark:`)
        darkbg: "#0B1622",
        darksurface: "#0F1E30",
        darkcard: "#16263C",
        teal: {
          DEFAULT: "#14B8C4",
          light: "#5AD3DB",
          dark: "#0E96A0",
        },
        cyan: {
          DEFAULT: "#2EE6C5",
        },
        surface: "#F6F9FB",
        line: "#E6EDF2",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #0D1B2A 0%, #14B8C4 55%, #2EE6C5 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(20,184,196,0.12) 0%, rgba(46,230,197,0.12) 100%)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(13,27,42,0.04), 0 8px 24px rgba(13,27,42,0.06)",
        "card-hover": "0 2px 4px rgba(13,27,42,0.06), 0 16px 40px rgba(13,27,42,0.10)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
