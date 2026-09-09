import type { Config } from "tailwindcss";

// Design tokens merged from .references/UI Library/brightermind-ui-lib/src/tailwind.tokens.ts
// See that file's comments for the reasoning behind the palette choices.
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary interactive color — deep pine teal. Calm without reading
        // clinical-cold (avoid pure blue) or cliché-wellness (avoid mint/lavender).
        brand: {
          50: "#EEF4F2",
          100: "#D3E4DF",
          200: "#A8C9C0",
          300: "#7CAE9F",
          400: "#549384",
          500: "#3A7A6B",
          600: "#2F6F62", // primary
          700: "#255950",
          800: "#1C433C",
          900: "#132C27",
        },
        // Background/text neutrals — warm off-white, not stark white.
        stone: {
          25: "#FDFCFA",
          50: "#FAF9F6",
          100: "#F2F0EB",
          200: "#E4E1D9",
          300: "#CBC6B9",
          600: "#6B6659",
          700: "#4A463C",
          800: "#332F28",
          900: "#2B2A28", // primary text
        },
        // Sparing warm accent — desaturated clay, not saturated terracotta.
        clay: {
          50: "#FBF3EE",
          100: "#F3DECF",
          400: "#D2A183",
          500: "#C08B6B",
          600: "#A66F51",
        },
        // Positive/success states — muted sage, not a bright green.
        sage: {
          50: "#F1F5EE",
          100: "#DCE7D3",
          500: "#7FA37A",
          600: "#658362",
        },
        // Errors/severity — muted brick, deliberately not alarm-red. Used per
        // the migration plan's note: avoid alarming red on screening results.
        brick: {
          50: "#FBF0EE",
          100: "#F0D3CC",
          500: "#B65C4B",
          600: "#98483A",
        },
      },
      fontFamily: {
        // References the CSS variable set by next/font/google in the root
        // layout (see src/app/layout.tsx) rather than the bare "Inter" string
        // the source tokens file used, so the font actually loads via Next's
        // font optimization instead of relying on the family name matching
        // a system-installed font.
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // Vary radius by hierarchy rather than one value everywhere.
        sm: "4px", // inputs, badges
        md: "8px", // buttons
        lg: "14px", // cards, modals
      },
      // Backs the `animate-in` / `animate-out` utilities that Disclosure and
      // Toast already reference on Radix `data-[state]` attributes. Without
      // these the classes were no-ops and collapsibles snapped open — the
      // migration plan's REDESIGN notes (module 10) ask for a soft fade-in on
      // comment-thread expansion instead. Short and gentle on purpose.
      keyframes: {
        in: {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        out: {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(-4px)" },
        },
      },
      animation: {
        in: "in 220ms ease-out",
        out: "out 160ms ease-in",
      },
    },
  },
  plugins: [],
};

export default config;
