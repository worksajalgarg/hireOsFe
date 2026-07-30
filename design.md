## Overview

HireOS's design language opens with the atmospheric **Indigo Cloud Mesh**[cite: 1, 2]. A wide horizontal band of soft lavender, electric indigo, deep violet, and sheer slate-blue occupies the upper third of marketing and platform surfaces — the platform's recognizable decision-support backdrop[cite: 1, 2]. Typography and product interface mockups float above it on `{colors.canvas}` (crisp white), with the gradient acting as both brand identity and structured anchor[cite: 1, 2]. The lower portion of the page returns to white, with feature explanations on `{colors.canvas-soft}` (a barely-tinted cool slate off-white) and candidate evaluation panels composited in deep navy[cite: 1, 2].

The color system has two primary roles. **Indigo** (`{colors.primary}` — `#533afd`) is the platform's signature CTA color, used sparingly: one filled pill per band[cite: 1, 2]. **Deep Navy** (`{colors.ink}` — `#0d253d`) is the universal body text color and the fill of featured pricing tiers, terminal chrome, and the dark dashboard panels[cite: 1, 2]. Ruby (`{colors.ruby}`) and magenta (`{colors.magenta}`) appear inside the gradient mesh and as status accent dots in product UI mockups; they are strictly prohibited from being used as button colors[cite: 1, 2].

Typography is built around **Sohne** at weight 300 with negative letter-spacing — the brand's editorial-density signature[cite: 1, 2]. Display sizes (32–56px) use -1.4px to -0.64px tracking; body sizes use 0; tabular caption sizes (where evidence scores and candidate metrics matter) use the OpenType `tnum` feature plus a tightening -0.36 to -0.42px tracking[cite: 1, 2]. The `ss01` stylistic set is enabled globally[cite: 1, 2].

**Key Characteristics:**

- Atmospheric gradient-mesh backdrop on every marketing hero and high-level workflow entrance — horizontal wash across the upper third of the page[cite: 1, 2].
- Single-indigo CTA hierarchy: filled `{colors.primary}` pill is the only filled button on primary marketing and action surfaces[cite: 1, 2].
- Sohne thin (weight 300) display tier with negative tracking from -1.4px to -0.2px depending on size[cite: 1, 2].
- Tabular-figure body type (`tnum`) for any cell rendering candidate match scores, confidence levels, or financial units — the brand's quiet data signal[cite: 1, 2].
- Dark-app dashboard track: deep navy product UI mockups sit composited above the white canvas, frequently with rendered code, transcripts, or scorecard tables inside[cite: 1, 2].
- Pill-shaped buttons (`{rounded.pill}` 9999px) with tight `8px 16px` padding — short, decisive, transactional[cite: 1, 2].
- Cream-band feature cards (`{colors.canvas-cream}`) introduce a warm interlude between blue/white sections without breaking the chromatic logic[cite: 1, 2].

---

## Colors

### Brand & Accent

- **Indigo** (`{colors.primary}` — `#533afd`): Signature CTA color[cite: 1, 2]. Filled-pill button, link emphasis, gradient anchor[cite: 1, 2].
- **Indigo Deep** (`{colors.primary-deep}` — `#4434d4`): Deeper indigo used in gradient mid-stops and as the press-state warmer alternative[cite: 1, 2].
- **Indigo Press** (`{colors.primary-press}` — `#2e2b8c`): Pressed-state lift of the primary button[cite: 1, 2].
- **Indigo Soft** (`{colors.primary-soft}` — `#665efd`): Lighter indigo used in product-UI accents and confidence highlights[cite: 1, 2].
- **Indigo Subdued** (`{colors.primary-bg-subdued-hover}` — `#b9b9f9`): Pale indigo fill used as soft tag background[cite: 1, 2].
- **Brand Dark 900** (`{colors.brand-dark-900}` — `#0d253d`): The deep navy used on the featured pricing tier, dark candidate panels, and dashboard chrome[cite: 1, 2].
- **Ruby** (`{colors.ruby}` — `#ea2261`): Gradient accent, risk indicators, and chart highlights; never a button[cite: 1, 2].
- **Magenta** (`{colors.magenta}` — `#f96bee`): Bright pink stop in gradient meshes[cite: 1, 2].
- **Lemon** (`{colors.lemon}` — `#9b6829`): Warm sherbet stop in gradient backdrops[cite: 1, 2].

### Surface

- **Canvas** (`{colors.canvas}` — `#ffffff`): Default page background[cite: 1, 2].
- **Canvas Soft** (`{colors.canvas-soft}` — `#f6f9fc`): Cool-tinted off-white used on feature bands beneath the gradient hero[cite: 1, 2].
- **Canvas Cream** (`{colors.canvas-cream}` — `#f5e9d4`): Warm cream used as a feature-band fill — the platform's chromatic interlude[cite: 1, 2].
- **Hairline** (`{colors.hairline}` — `#e3e8ee`): 1px borders on cards and evaluation tables[cite: 1, 2].
- **Hairline Input** (`{colors.hairline-input}` — `#a8c3de`): Slightly cooler hairline used on form inputs[cite: 1, 2].

### Text

- **Ink** (`{colors.ink}` — `#0d253d`): Default body text color across the brand[cite: 1, 2]. Deep navy, never pure black[cite: 1, 2].
- **Ink Secondary** (`{colors.ink-secondary}` — `#273951`): Secondary text on white[cite: 1, 2].
- **Ink Mute** (`{colors.ink-mute}` — `#64748d`): Helper text, captions, table labels[cite: 1, 2].
- **Ink Mute 2** (`{colors.ink-mute-2}` — `#61718a`): Near-equivalent to ink-mute used in navigation[cite: 1, 2].
- **On Primary** (`{colors.on-primary}` — `#ffffff`): Text on indigo / dark-navy surfaces[cite: 1, 2].

### Semantic

> **Note:** The marketing design language does not maintain a standalone semantic palette[cite: 1, 2]. Functional error, warning, and success states live exclusively within dashboard product UIs and evaluation panels[cite: 1, 2].

---

## Typography

### Font Family

The display and UI tier is **Sohne** (proprietary) at weights 300 (thin) and 400 (regular)[cite: 1, 2]. The variable font (`sohne-var`) is loaded with `font-feature-settings: "ss01"` enabled globally — substituting character variants that form the typographic signature[cite: 1, 2].

When Sohne is unavailable, fall back to **SF Pro Display** at thin weights, then system-ui[cite: 1, 2]. For open-source fidelity, **Inter** at weight 300 with `font-feature-settings: "ss01"` and `letter-spacing: -1.4px` on display sizes acts as the canonical substitute[cite: 1, 2].

### Hierarchy

| Token                       | Size | Weight | Line Height | Letter Spacing | Use                                                         |
| --------------------------- | ---- | ------ | ----------- | -------------- | ----------------------------------------------------------- |
| `{typography.display-xxl}`  | 56px | 300    | 1.03        | -1.4px         | Hero headline[cite: 1, 2]                                   |
| `{typography.display-xl}`   | 48px | 300    | 1.15        | -0.96px        | Section opener[cite: 1, 2]                                  |
| `{typography.display-lg}`   | 32px | 300    | 1.1         | -0.64px        | Card title / sub-section[cite: 1, 2]                        |
| `{typography.display-md}`   | 26px | 300    | 1.12        | -0.26px        | Compact card title[cite: 1, 2]                              |
| `{typography.heading-lg}`   | 22px | 300    | 1.1         | -0.22px        | Pricing tier name / role title[cite: 1, 2]                  |
| `{typography.heading-md}`   | 20px | 300    | 1.4         | -0.2px         | Section sub-heading[cite: 1, 2]                             |
| `{typography.heading-sm}`   | 18px | 300    | 1.4         | 0              | Mini-section label[cite: 1, 2]                              |
| `{typography.body-lg}`      | 16px | 300    | 1.4         | 0              | Marketing body lead[cite: 1, 2]                             |
| `{typography.body-md}`      | 15px | 300    | 1.4         | 0              | Default UI body[cite: 1, 2]                                 |
| `{typography.body-tabular}` | 14px | 300    | 1.4         | -0.42px        | Candidate scores & numeric tables (uses `tnum`)[cite: 1, 2] |
| `{typography.button-md}`    | 16px | 400    | 1.0         | 0              | Pill button label[cite: 1, 2]                               |
| `{typography.button-sm}`    | 14px | 400    | 1.0         | 0              | Compact pill label[cite: 1, 2]                              |
| `{typography.caption}`      | 13px | 400    | 1.4         | -0.39px        | Helper, table labels[cite: 1, 2]                            |
| `{typography.micro}`        | 11px | 300    | 1.4         | 0              | Fine print, citations[cite: 1, 2]                           |
| `{typography.micro-cap}`    | 10px | 400    | 1.15        | 0.1px          | All-caps eyebrow / tag[cite: 1, 2]                          |

### Principles

- **Thin weight is the brand.** Display tiers always render at weight 300[cite: 1, 2]. Increasing to 400+ destroys the editorial style[cite: 1, 2].
- **Negative tracking on display.** -1.4px at 56px, scaling down to -0.2px at 20px[cite: 1, 2]. Negative tracking is the typographic signature[cite: 1, 2].
- **Tabular figures for data.** Every cell rendering match percentages, scores, or candidate counts uses `font-feature-settings: "tnum"` plus tightening tracking[cite: 1, 2].
- **`ss01` globally.** Apply `font-feature-settings: "ss01"` to the body element[cite: 1, 2].

---

## Layout

### Spacing System

- **Base unit**: 8px (with 2 / 4 / 12 sub-tokens for fine layout work)[cite: 1, 2].
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.huge}` 64px[cite: 1, 2].
- **Section padding**: 64–96px on marketing surfaces; 32–48px on workspace / product surfaces[cite: 1, 2].
- **Card internal padding**: 32px on feature cards; 24px on mockups[cite: 1, 2].

### Grid & Container

- Marketing pages center in a ~1200px container with the gradient mesh extending edge-to-edge above[cite: 1, 2].
- Grid cards collapse 4-up → 2-up → 1-up at 1024 / 768 breakpoints[cite: 1, 2].
- Dashboard product mockups use internal grids (12-col tables, 3-col card grids) composited into containers[cite: 1, 2].

---

## Elevation & Depth

| Level | Treatment                                                                   | Use                                                                   |
| ----- | --------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 0     | Flat                                                                        | Default surface[cite: 1, 2]                                           |
| 1     | `box-shadow: rgba(0,55,112,0.08) 0 1px 3px`                                 | Card lift on white canvas[cite: 1, 2]                                 |
| 2     | `box-shadow: rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px` | Floating panels, mockup chrome[cite: 1, 2]                            |
| 3     | Gradient mesh backdrop                                                      | Primary depth medium — atmospheric color over hard shadow[cite: 1, 2] |

---

## Shapes

### Border Radius Scale

| Token            | Value  | Use                                                         |
| ---------------- | ------ | ----------------------------------------------------------- |
| `{rounded.xs}`   | 4px    | Hairline tags, table chrome[cite: 1, 2]                     |
| `{rounded.sm}`   | 6px    | Form inputs[cite: 1, 2]                                     |
| `{rounded.md}`   | 8px    | Compact cards, alerts[cite: 1, 2]                           |
| `{rounded.lg}`   | 12px   | Pricing cards, feature cards, candidate mockups[cite: 1, 2] |
| `{rounded.xl}`   | 16px   | Dashboard UI chrome[cite: 1, 2]                             |
| `{rounded.pill}` | 9999px | All buttons, status tag pills[cite: 1, 2]                   |

---

## Components

### Buttons

**`button-primary-pill`** — dominant CTA system-wide[cite: 1, 2].

- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-md}`, padding `{spacing.sm} {spacing.lg}` (8px 16px), rounded `{rounded.pill}` 9999px[cite: 1, 2].
- Pressed state `button-primary-pill-pressed` shifts background to `{colors.primary-press}`[cite: 1, 2].

**`button-secondary`** — outline-style alternative[cite: 1, 2].

- Background `{colors.canvas}`, text `{colors.primary}`, 1px solid `{colors.primary}` border, same pill geometry[cite: 1, 2].

**`button-on-dark`** — dark surface action[cite: 1, 2].

- Background `{colors.brand-dark-900}`, text `{colors.on-primary}`, same pill geometry[cite: 1, 2].

---

### Cards & Containers

**`card-feature-light`** — feature card on white[cite: 1, 2].

- Background `{colors.canvas}`, padding `{spacing.xxl}`, rounded `{rounded.lg}` 12px, 1px `{colors.hairline}` border, optional Level 1 shadow[cite: 1, 2].

**`card-pricing-featured`** — inverted dark featured tier[cite: 1, 2].

- Background `{colors.brand-dark-900}`, text `{colors.on-primary}`, rounded `{rounded.lg}` 12px[cite: 1, 2].

**`card-cream-band`** — warm interlude card[cite: 1, 2].

- Background `{colors.canvas-cream}`, text `{colors.ink}`, padding `{spacing.xxl}`, rounded `{rounded.lg}`[cite: 1, 2]. Breaks blue/white rhythm[cite: 1, 2].

**`card-dashboard-mockup`** — composited UI screenshot[cite: 1, 2].

- Background `{colors.canvas}`, type `{typography.body-tabular}` (with `tnum`), padding `{spacing.xl}` 24px, rounded `{rounded.lg}` 12px, Level 2 shadow[cite: 1, 2].

---

### Inputs & Forms

**`text-input`** — standard form field[cite: 1, 2].

- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, padding `{spacing.sm} {spacing.md}` (8px 12px), rounded `{rounded.sm}` 6px, 1px `{colors.hairline-input}` border[cite: 1, 2].
- Focus state `text-input-focused`: border switches to `{colors.primary}`[cite: 1, 2].

---

### Signature Components

**Gradient Mesh Backdrop** — pastel cream → orange → lavender → indigo → ruby pink stops blurred horizontally across the top third of the page[cite: 1, 2]. SVG or background image driven[cite: 1, 2].

**Tabular-Figure Money & Metric Type** — any element rendering candidate metrics, match scores, or monetary units uses `font-feature-settings: "tnum"`[cite: 1, 2].

**`pill-tag-soft`** — subdued tag[cite: 1, 2].

- Background `{colors.primary-bg-subdued-hover}`, text `{colors.primary-deep}`, type `{typography.micro-cap}`, padding `4px 8px`, rounded `{rounded.pill}`[cite: 1, 2].

---

## Do's and Don'ts

### Do

- Reserve `{colors.primary}` for filled CTAs and inline link emphasis — max one filled button per band[cite: 1, 2].
- Apply the gradient mesh to every marketing hero section[cite: 1, 2].
- Render display tiers at weight 300 with negative letter-spacing[cite: 1, 2].
- Use `font-feature-settings: "tnum"` on all numeric and evidence data cells[cite: 1, 2].
- Apply `font-feature-settings: "ss01"` globally on the body element[cite: 1, 2].

### Don't

- Don't bump display weight above 300[cite: 1, 2].
- Don't introduce accent colors outside documented gradient stops[cite: 1, 2].
- Don't use indigo `{colors.primary}` as body-text color[cite: 1, 2].
- Don't shrink button padding below `8px 16px`[cite: 1, 2].
- Don't render scores or metrics without `tnum`[cite: 1, 2].
- Don't use rounded-rectangle geometry for buttons — maintain pill shape[cite: 1, 2].

---

## Responsive Behavior

### Breakpoints

| Name    | Width       | Key Changes                                                                  |
| ------- | ----------- | ---------------------------------------------------------------------------- |
| Wide    | ≥ 1440px    | Edge-to-edge gradient mesh; full-scale dashboard composite[cite: 1, 2]       |
| Desktop | 1024–1440px | Default container max-width; 4-up cards[cite: 1, 2]                          |
| Tablet  | 768–1023px  | 2-up card layout; simplified 2-panel mockups[cite: 1, 2]                     |
| Mobile  | < 768px     | 1-up card layout; hamburger menu; display steps down 56px → 36px[cite: 1, 2] |

### Touch Targets

- Buttons hit ≥ 40×40px on mobile via padding adjustments; step up to 44×44px on compact displays for WCAG targets[cite: 1, 2].
- Form fields maintain 40px minimum height[cite: 1, 2].

---

## Iteration Guide

1. Focus on ONE component or interface section at a time[cite: 1, 2].
2. Reference component names and tokens directly (`{colors.primary}`, `{rounded.pill}`)[cite: 1, 2].
3. Run `npx @google/design.md lint DESIGN.md` after edits[cite: 1, 2].
4. Add new variants as explicit separate entries[cite: 1, 2].
5. Default body copy to `{typography.body-md}` (15px); use `{typography.body-tabular}` for numeric/evidence cells[cite: 1, 2].
6. Apply `ss01` globally on the body; apply `tnum` per-element on data values[cite: 1, 2].
7. The gradient mesh is mandatory on marketing heroes[cite: 1, 2].
