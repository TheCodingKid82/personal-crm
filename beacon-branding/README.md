# Beacon Branding — Local Icon / Logo Explorer

Local-only tool to generate and review many **SVG icon variants** for the working name **Beacon**.

## What it does
- Generates data-driven variants across:
  - Concepts: beacon waves, lighthouse, lantern+page, B-with-beam, radar sweep, compass star, book+beam
  - Colorways
  - Stroke weights (thin/regular/bold)
  - Style (mono vs duo accent)
- Renders everything in a big grid with filters.
- Exports:
  - **SVG** download
  - **PNG 512 / 1024** (optionally transparent or matching preview background)
  - Copy SVG to clipboard

## Run
From `C:\Users\theul\clawd\beacon-branding`:

```bash
pnpm install
```

### (Optional) Nano Banana image generation
1) Create an env file:

```bash
copy .env.example .env
```

2) Put your Google Gemini key in `.env`:

```bash
NANO_BANANA_API_KEY=YOUR_KEY_HERE
```

3) Run web + local API server together:

```bash
pnpm dev:all
```

Vite will print the local URL (typically `http://localhost:5173`).

If you only want the SVG grid (no AI comps), you can still run just:

```bash
pnpm dev
```

## Where to edit
- Concepts / geometry: `src/branding/svg.ts`
- Variant matrix (concepts × weights × styles × colorways): `src/branding/variants.ts`
- Color palettes: `src/branding/colorways.ts`

## Generated PNGs (saved)
If you drop externally-generated PNG comps into:

`public/generated/<concept>/*.png`

…run:

```bash
pnpm gen:manifest
```

The app will show them under **Generated (Saved PNGs)**.

## Notes
These SVGs are designed on a 24×24 viewBox with consistent caps/joins for legibility.
