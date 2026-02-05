import type {
  BgMode,
  Colorway,
  ConceptId,
  StrokeStyleId,
  StrokeWeightId,
} from './types'

export type SvgParams = {
  concept: ConceptId
  colorway: Colorway
  bgMode: BgMode
  weight: StrokeWeightId
  style: StrokeStyleId
  size?: number // output px, only for convenience
}

function sw(weight: StrokeWeightId): number {
  switch (weight) {
    case 'thin':
      return 1.5
    case 'regular':
      return 2
    case 'bold':
      return 2.5
  }
}

function strokeFor({ style, colorway, bgMode }: SvgParams): { fg: string; accent: string } {
  const fg = bgMode === 'dark' ? colorway.fgDark : colorway.fgLight
  return {
    fg,
    accent: style === 'duo' ? colorway.accent : fg,
  }
}

function svgWrap(inner: string, opts: { size?: number } = {}): string {
  const size = opts.size ?? 24
  // shape-rendering: geometricPrecision helps keep curves clean when scaled.
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" shape-rendering="geometricPrecision">` +
    inner +
    `</svg>`
}

export function renderConceptSvg(params: SvgParams): string {
  switch (params.concept) {
    case 'beacon-waves':
      return renderBeaconWaves(params)
    case 'lighthouse-min':
      return renderLighthouseMin(params)
    case 'lantern-page':
      return renderLanternPage(params)
    case 'b-beam':
      return renderBBeam(params)
    case 'radar-sweep':
      return renderRadarSweep(params)
    case 'compass-star':
      return renderCompassStar(params)
    case 'book-beam':
      return renderBookBeam(params)
  }
}

// --- Concepts (24px optimized, consistent stroke caps/joins)

function commonStroke({ weight, style, colorway, bgMode }: SvgParams) {
  const { fg, accent } = strokeFor({
    concept: 'beacon-waves',
    colorway,
    bgMode,
    weight,
    style,
  })
  const strokeWidth = sw(weight)
  return { fg, accent, strokeWidth }
}

function renderBeaconWaves(p: SvgParams): string {
  const { fg, accent, strokeWidth } = commonStroke(p)
  // Beacon dot + two wave rings, with a small "beam" notch for energy.
  return svgWrap(
    [
      `<path d="M12 6.6v1.5" stroke="${accent}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
      `<circle cx="12" cy="9.2" r="1.15" stroke="${accent}" stroke-width="${strokeWidth}"/>`,
      `<path d="M7.8 12.1c1.1-1.15 2.55-1.75 4.2-1.75s3.1.6 4.2 1.75" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
      `<path d="M5.6 14.8c1.8-1.9 4-2.85 6.4-2.85s4.6.95 6.4 2.85" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
      `<path d="M9.1 18h5.8" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
    ].join(''),
    { size: p.size },
  )
}

function renderLighthouseMin(p: SvgParams): string {
  const { fg, accent, strokeWidth } = commonStroke(p)
  // A compact lighthouse: base + tower + top cap, with two light beams.
  return svgWrap(
    [
      `<path d="M9.2 20h5.6" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
      `<path d="M10 20l.9-8.2h2.2L14 20" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
      `<path d="M10.6 9.9h2.8" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
      `<path d="M11.05 8.2l.95-1.35.95 1.35" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
      `<path d="M6.1 11.2l2.2.9" stroke="${accent}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
      `<path d="M17.9 11.2l-2.2.9" stroke="${accent}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
    ].join(''),
    { size: p.size },
  )
}

function renderLanternPage(p: SvgParams): string {
  const { fg, accent, strokeWidth } = commonStroke(p)
  // A page/book with a lantern above (study + guidance). Keeps silhouette strong.
  return svgWrap(
    [
      `<path d="M7.2 19.2c1.3-.7 2.9-1.05 4.8-1.05s3.5.35 4.8 1.05V7.6c-1.3-.7-2.9-1.05-4.8-1.05S8.5 6.9 7.2 7.6v11.6Z" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`,
      `<path d="M12 5.1v1.45" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
      `<path d="M10.6 5.1h2.8" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
      `<path d="M10.55 5.1c.2-1.05.9-1.65 1.45-1.65s1.25.6 1.45 1.65" stroke="${accent}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
      `<path d="M10.1 9.8h3.8" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linecap="round" opacity="0.9"/>`,
      `<path d="M10.1 12h3.3" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linecap="round" opacity="0.7"/>`,
    ].join(''),
    { size: p.size },
  )
}

function renderBBeam(p: SvgParams): string {
  const { fg, accent, strokeWidth } = commonStroke(p)
  // Monoline "B" with a beam wedge to the right. Readable at 24px.
  return svgWrap(
    [
      `<path d="M7.4 6.6v10.8" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
      `<path d="M7.4 6.6h4.15c1.55 0 2.8 1.1 2.8 2.45s-1.25 2.45-2.8 2.45H7.4" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
      `<path d="M7.4 12h4.35c1.7 0 3.05 1.2 3.05 2.7s-1.35 2.7-3.05 2.7H7.4" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
      `<path d="M16.4 9.2l4.2 2.8-4.2 2.8" stroke="${accent}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
    ].join(''),
    { size: p.size },
  )
}

function renderRadarSweep(p: SvgParams): string {
  const { fg, accent, strokeWidth } = commonStroke(p)
  // Radar ring + sweep line + target blip.
  return svgWrap(
    [
      `<circle cx="12" cy="12" r="7.3" stroke="${fg}" stroke-width="${strokeWidth}"/>`,
      `<path d="M12 12V5.2" stroke="${accent}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
      `<path d="M12 12l5.6 3.2" stroke="${accent}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>`,
      `<circle cx="16.9" cy="15.2" r="0.95" fill="${accent}"/>`,
      `<path d="M8.2 12a3.8 3.8 0 0 1 3.8-3.8" stroke="${fg}" stroke-width="${Math.max(1.25, strokeWidth - 0.5)}" stroke-linecap="round" opacity="0.65"/>`,
    ].join(''),
    { size: p.size },
  )
}

function renderCompassStar(p: SvgParams): string {
  const { fg, accent, strokeWidth } = commonStroke(p)
  // Compass: outer ring + 4-point star, accent on north tip.
  return svgWrap(
    [
      `<circle cx="12" cy="12" r="7.4" stroke="${fg}" stroke-width="${strokeWidth}"/>`,
      `<path d="M12 6.3l1.7 4.2 4.2 1.7-4.2 1.7L12 18l-1.7-4.1-4.2-1.7 4.2-1.7L12 6.3Z" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`,
      `<path d="M12 6.3l1.7 4.2" stroke="${accent}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
       <path d="M13.7 10.5l4.2 1.7" stroke="${accent}" stroke-width="${Math.max(1.25, strokeWidth - 0.5)}" stroke-linecap="round" opacity="0.9"/>`,
      `<circle cx="12" cy="12" r="0.9" fill="${accent}"/>`,
    ].join(''),
    { size: p.size },
  )
}

function renderBookBeam(p: SvgParams): string {
  const { fg, accent, strokeWidth } = commonStroke(p)
  // Open book + upward beam (learning -> signal). Simple geometry.
  return svgWrap(
    [
      `<path d="M7.3 17.8c1.25-.65 2.85-.95 4.7-.95s3.45.3 4.7.95V7.7c-1.25-.65-2.85-.95-4.7-.95s-3.45.3-4.7.95v10.1Z" stroke="${fg}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`,
      `<path d="M12 16.85V6.75" stroke="${fg}" stroke-width="${Math.max(1.25, strokeWidth - 0.5)}" stroke-linecap="round" opacity="0.7"/>`,
      `<path d="M12 5.2v4.1" stroke="${accent}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
      `<path d="M9.7 6.3l2.3-2.3 2.3 2.3" stroke="${accent}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
    ].join(''),
    { size: p.size },
  )
}
