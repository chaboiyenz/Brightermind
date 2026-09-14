---
name: Serene Restorative Sanctuary
colors:
  surface: '#f8faf7'
  surface-dim: '#d8dbd8'
  surface-bright: '#f8faf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f1'
  surface-container: '#eceeeb'
  surface-container-high: '#e7e9e6'
  surface-container-highest: '#e1e3e0'
  on-surface: '#191c1b'
  on-surface-variant: '#424842'
  inverse-surface: '#2e312f'
  inverse-on-surface: '#eff1ee'
  outline: '#727971'
  outline-variant: '#c2c8c0'
  surface-tint: '#45664d'
  primary: '#45664d'
  on-primary: '#ffffff'
  primary-container: '#88ab8e'
  on-primary-container: '#203f29'
  inverse-primary: '#abcfb1'
  secondary: '#506358'
  on-secondary: '#ffffff'
  secondary-container: '#d0e5d8'
  on-secondary-container: '#54675d'
  tertiary: '#9a442d'
  on-tertiary: '#ffffff'
  tertiary-container: '#ef866a'
  on-tertiary-container: '#69200c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c7eccc'
  primary-fixed-dim: '#abcfb1'
  on-primary-fixed: '#01210e'
  on-primary-fixed-variant: '#2e4e36'
  secondary-fixed: '#d3e7db'
  secondary-fixed-dim: '#b7cbbf'
  on-secondary-fixed: '#0d1f17'
  on-secondary-fixed-variant: '#384b41'
  tertiary-fixed: '#ffdbd2'
  tertiary-fixed-dim: '#ffb4a1'
  on-tertiary-fixed: '#3c0800'
  on-tertiary-fixed-variant: '#7c2e19'
  background: '#f8faf7'
  on-background: '#191c1b'
  surface-variant: '#e1e3e0'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 58px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 34px
    fontWeight: '600'
    lineHeight: 42px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.005em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  space-4xl: 6rem
  gutter-mobile: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin-mobile: 1.25rem
  margin-tablet: 2.5rem
  margin-desktop: 3.5rem
  max-container-width: 1160px
---

## Brand & Style

This design system establishes a restorative, tranquil environment engineered for individuals navigating burnout, heightened stress, and sensory overwhelm. The digital experience acts as an emotional sanctuary—instilling calm, clarity, and safety through warm organic tones, generous breathing space, and low cognitive friction.

### Design Movement & Aesthetic
The system blends **Warm Organic Minimalism** with soft **Frosted Ambient Layering**:
- **Atmospheric Warmth:** Replacing clinical cool grays and harsh stark whites with linen, warm parchment, and sun-softened earthen tones.
- **Low Cognitive Load:** Interfaces prioritize restful visual pacing, gentle typographic hierarchy, and deliberate omission of frantic badges, high-saturation alerts, or abrasive micro-interactions.
- **Organic Softness:** Generous corner radii, tactile card containers, and whisper-soft shadows mimic physical, reassuring touchpoints like thick watercolor paper and river-smoothed stones.

## Colors

The palette is rooted in grounding botanicals, earthen clay, and unbleached fiber. All text and interactive pairings conform strictly to WCAG 2.1 AA contrast requirements.

### Palette Roles
- **Background (`#F7F9F6`):** Warm Linen. Provides an eye-resting baseline canvas that mitigates glare and blue-light strain.
- **Primary Accent (`#88AB8E`):** Soft Sage Green. Evokes quiet renewal and presence. Used for primary focus indicators, active states, progress indicators, and gentle graphic highlights.
- **Secondary Support (`#2C3E35`):** Muted Slate Green. Acts as the primary ink for headlines, body copy, and high-emphasis interface chrome. Delivers grounding contrast without the severe sharpness of pure `#000000`.
- **Tertiary Action (`#E07A5F`):** Warm Soft Coral. A restorative terracotta-tinted coral reserved for mindful calls-to-action, reflective commitments, and gentle milestone acknowledgments. Never used aggressively.
- **Surfaces (`#FFFFFF` / `rgba(255, 255, 255, 0.85)`):** Pure white to translucent milk-glass panels framed by subtle stone borders (`#E5EAE3`) to structure wellness insights without visual clutter.

## Typography

The type system balances the friendly, open geometric terminals of **Plus Jakarta Sans** for headings and interactive triggers with the neutral, hyper-legible cadence of **Inter** for reflective reading and self-guided exercises.

- **Generous Leading:** Line heights are calibrated wider than standard applications (1.6–1.68x on body text) to accommodate users processing stress or sensory fatigue.
- **Gentle Weights:** Restrict typography to regular (400), medium (500), and semi-bold (600). Heavy black weights are avoided to prevent visual aggression.
- **Rhythm:** Line lengths for meditative guides and therapeutic logs must be capped between 55–70 characters to avoid reading exhaustion.

## Layout & Spacing

The layout philosophy follows a calm, bounded rhythm that values uncluttered breathing room over information density.

### Grid & Breakpoints
- **Mobile (< 640px):** 4-column layout with `1.25rem` screen margins and `1rem` gutters. Stacks interactive cards sequentially; bottom-sheet drawers replace nested menus.
- **Tablet (640px – 1024px):** 8-column layout with `2.5rem` margins and `1.5rem` gutters. Content splits into relaxed split-views (e.g., mood check-in alongside calming prompts).
- **Desktop (> 1024px):** 12-column layout with `3.5rem` margins and `2rem` gutters, constrained to a maximum content width of `1160px` to maintain focused visual paths and prevent eye drift.

### Spatial Discipline
Whitespace is an active therapeutic component. Content clusters rely on large structural padding (`space-xl` and `space-2xl`) within cards and modules, avoiding micro-cramming and multi-tiered toolbars.

## Elevation & Depth

Visual hierarchy is communicated through calm tonal layering and soft, diffused ambient light. Harsh dropshadows and dense dark silhouettes are strictly avoided.

### Atmospheric Surface Stack
1. **Canvas (Base):** Warm Linen (`#F7F9F6`), matte and flat.
2. **Restorative Card Surface:** Pure white (`#FFFFFF`) or frosted glass (`rgba(255, 255, 255, 0.85)` with `backdrop-filter: blur(12px)`), bounded by a hairline stroke of `#E5EAE3`.
3. **Gentle Float (Active / Floating State):** A dual-layer ambient shadow tinted with slate green:
   - `box-shadow: 0 4px 16px -2px rgba(44, 62, 53, 0.04), 0 8px 28px -4px rgba(44, 62, 53, 0.06);`
4. **Focused Modals & Sheets:**
   - `box-shadow: 0 16px 40px -8px rgba(44, 62, 53, 0.08), 0 24px 64px -12px rgba(44, 62, 53, 0.05);`
   - Paired with an ambient backdrop overlay in `#2C3E35` at 25% opacity with a `4px` blur.

## Shapes

The shape vocabulary emphasizes softness, safety, and comfort. Sharp, acute geometry is eliminated to avoid inducing tension.

### Corner Curvature Tokens
- **Standard Cards & Large Containers:** Fixed `20px` (`1.25rem`) corner radius, crafting a friendly, pebble-like silhouette.
- **Interactive Elements (Inputs, Action Tiles):** `12px` to `16px` curvature for intuitive touchability.
- **Pill Badges, Chips & Primary Buttons:** Fully rounded pill silhouette (`9999px`) to communicate softness and approachable interaction.

## Components

### Buttons
- **Primary CTA:** Background `#E07A5F`, text `#FFFFFF`, rounded pill (`9999px`), `14px 28px` padding, `label-lg`. Soft hover transition that gently deepens the coral tone (`#D46B50`) with an organic `0 4px 12px rgba(224, 122, 95, 0.25)` glow.
- **Secondary Restorative:** Background `#88AB8E`, text `#FFFFFF`, rounded pill (`9999px`), gentle hover transition to `#799D7F`.
- **Tertiary / Ghost:** Transparent background, text `#2C3E35`, border `1.5px solid #E5EAE3`, hover background `rgba(136, 171, 142, 0.1)`.

### Chips & Pill Badges
- **Status / Mood Chips:** Full pill radius (`9999px`), height `32px`, padding `0 14px`, `label-md`. Background `#FFFFFF`, border `1px solid #E5EAE3`, text `#2C3E35`.
- **Selected Chip State:** Background `rgba(136, 171, 142, 0.2)`, border `1px solid #88AB8E`, text `#2C3E35`.

### Input Fields & Reflection Areas
- **Text Inputs & Textareas:** Background `#FFFFFF`, border `1.5px solid #E5EAE3`, radius `14px`, text `#2C3E35`, placeholder `#8A9A90`. Focused state softly transitions the border to `#88AB8E` accompanied by a gentle outer ring of `0 0 0 3px rgba(136, 171, 142, 0.2)`. Never use aggressive error reds; use a muted terracotta tint with explanatory supportive copy.

### Wellness Cards
- **Structure:** Surface background `rgba(255, 255, 255, 0.88)`, backdrop blur `12px`, border `1px solid #E5EAE3`, rounded corners `20px`, internal padding `24px` (desktop: `32px`).
- **Interactive State:** Hover elevates cards smoothly by `-2px` with the gentle float ambient shadow.

### Checkboxes & Radio Selectors
- **Form Selectors:** `22px` diameter. Unchecked: `#FFFFFF` with `1.5px solid #CBD5C8`. Checked: solid `#88AB8E` fill with a smooth white checkmark or inner dot. Transitions utilize a gentle ease-out curve (`240ms cubic-bezier(0.16, 1, 0.3, 1)`).

### Breathing & Pacing Guide Component
- **Circular Pacer:** Concentric rings transitioning between `#88AB8E` (at 15% opacity) and solid `#88AB8E` through a continuous, smooth `4s–4s` inhalation/exhalation scale animation to assist down-regulation of the nervous system.

---

## Implementation notes (apps/web)

- **Coral CTA ink.** White on `#E07A5F` measures about 2.9:1, below WCAG AA. The implementation keeps the
  soft coral fill and sets the label in `on-tertiary-fixed` (`#3C0800`, about 5.8:1) via the `--on-clay`
  token. In dark mode the fill is desaturated clay `#C08B6B` with the same dark ink.
- **Mood swatches** are literal colors shared with the mood tracker; each carries its own AA-safe ink
  (`MOOD_LEVELS` in `components/home/homeContent.ts`).
- **`.theme-dark`** scopes the dark token set to a subtree in either theme, for surfaces that are dark by
  design: the video call room and the landing page's counselling section.

## Dark mode: Evening Pine

The dark theme is the pine palette from the September 2026 landing redesign. It is not an inversion of the
light palette; it is a second set with the same roles. Both sets live in `apps/web/src/app/globals.css` as
RGB-triplet CSS variables, and `apps/web/tailwind.config.ts` maps every color scale onto them, so any page
written with `brand-*`, `stone-*`, `clay-*`, `sage-*` or `brick-*` classes is theme-aware with no changes.

Theme resolution: the bare `:root` is light; `@media (prefers-color-scheme: dark)` applies dark unless
`<html data-theme="light">`; `<html data-theme="dark">` forces dark. The header toggle stores the choice in
`localStorage` under `bm-theme`.

### Palette roles (dark)
- **Ground:** `#121A18` deep pine-black. Cards lift to `#172220`; hairlines `#22312D`.
- **Ink:** `#F2F0EB` warm stone for headlines and body; `#D7D3C9` secondary; `#A39E90` muted.
- **Primary accent:** `#7CAE9F` soft pine, on it dark ink `#0F1A17`. Hover lightens to `#A8C9C0`.
- **Warm action (coral role):** `#C08B6B` desaturated clay with dark ink, used only for the booking CTA and crisis strip.
- **Positive:** `#7FA37A` sage. **Severity high band:** `#C97A6A` muted brick, never alarm red.
- **Shadows:** near-black, low spread. Frosted panels use `rgba(23, 34, 32, 0.9)` with the same 12px blur.
