import type { Config } from "tailwindcss";

// Design tokens: docs/DESIGN.md ("Serene Restorative Sanctuary" light theme,
// "Evening Pine" dark theme). The actual color values live as RGB triplets in
// src/app/globals.css so the two themes can be swapped at the CSS level;
// every scale below only points at those variables. `<alpha-value>` keeps
// opacity modifiers (bg-stone-25/90 etc.) working.
const scale = (name: string, steps: readonly number[]) =>
  Object.fromEntries(
    steps.map((step) => [step, `rgb(var(--${name}-${step}) / <alpha-value>)`])
  );

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary interactive color — sage/forest green in light, soft pine in dark.
        brand: scale("brand", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        // Neutrals — warm linen in light, deep pine in dark. 25 = card surface, 50 = canvas.
        stone: scale("stone", [25, 50, 100, 200, 300, 600, 700, 800, 900]),
        // Warm action color — soft coral in light, desaturated clay in dark.
        // Reserved for the booking CTA and crisis resources; never decorative.
        clay: scale("clay", [50, 100, 400, 500, 600]),
        // Positive / progress states.
        sage: scale("sage", [50, 100, 500, 600]),
        // Errors and the highest severity band — muted terracotta, deliberately not alarm red.
        brick: scale("brick", [50, 100, 500, 600]),
        // Text colors that sit on the filled brand / clay buttons in each theme.
        "on-brand": "rgb(var(--on-brand) / <alpha-value>)",
        "on-clay": "rgb(var(--on-clay) / <alpha-value>)",
        frost: "rgb(var(--frost) / <alpha-value>)",
      },
      fontFamily: {
        // Both reference CSS variables set by next/font/google in src/app/layout.tsx.
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // DESIGN.md type scale. Body sizes keep Tailwind defaults; these are the display roles.
        "display": ["48px", { lineHeight: "58px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-sm": ["34px", { lineHeight: "42px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.005em", fontWeight: "500" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "500" }],
        "label-lg": ["15px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }],
        "label-md": ["13px", { lineHeight: "18px", letterSpacing: "0.02em", fontWeight: "600" }],
        "label-sm": ["11px", { lineHeight: "16px", letterSpacing: "0.03em", fontWeight: "600" }],
      },
      borderRadius: {
        // DESIGN.md shape vocabulary: soft everywhere, pills for buttons and chips.
        sm: "4px", // badges
        md: "12px", // inputs, small tiles
        lg: "16px", // action tiles, list rows
        xl: "20px", // cards and large containers
        "2xl": "24px",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        float: "var(--shadow-float)",
        coral: "var(--shadow-coral)",
      },
      maxWidth: {
        container: "1160px",
      },
      keyframes: {
        in: {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        out: {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(-4px)" },
        },
        // Breathing pacer: 4 s in, 4 s hold, 6 s out (the aromatherapy
        // "lavender" pace in app/coping/aromatherapy/aromatherapyData.ts).
        breathe: {
          "0%": { transform: "scale(0.82)" },
          "28%": { transform: "scale(1)" },
          "57%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.82)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        // Defusion game: a leaf crossing the stream. Duration is set inline
        // per leaf (games/defusionData.ts DRIFT_SECONDS).
        drift: {
          from: { left: "-45%" },
          to: { left: "105%" },
        },
      },
      animation: {
        in: "in 220ms ease-out",
        out: "out 160ms ease-in",
        breathe: "breathe 14s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2.8s ease-in-out infinite",
        drift: "drift 11s linear forwards",
      },
      transitionTimingFunction: {
        gentle: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
