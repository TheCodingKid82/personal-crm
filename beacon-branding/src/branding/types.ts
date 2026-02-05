export type ConceptId =
  | 'beacon-waves'
  | 'lighthouse-min'
  | 'lantern-page'
  | 'b-beam'
  | 'radar-sweep'
  | 'compass-star'
  | 'book-beam'

export type StrokeWeightId = 'thin' | 'regular' | 'bold'
export type StrokeStyleId = 'mono' | 'duo'

export type BgMode = 'light' | 'dark'

export type ColorwayId =
  | 'graphite-cyan'
  | 'navy-electric'
  | 'black-lime'
  | 'charcoal-amber'
  | 'slate-violet'

export type Colorway = {
  id: ColorwayId
  name: string
  // Background swatches used for the preview canvas
  bgLight: string
  bgDark: string
  // Foreground + accent used in SVG
  fgLight: string
  fgDark: string
  accent: string
}

export type VariantSpec = {
  id: string
  concept: ConceptId
  conceptName: string
  colorway: ColorwayId
  colorwayName: string
  weight: StrokeWeightId
  style: StrokeStyleId
}
