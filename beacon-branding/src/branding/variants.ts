import type {
  ColorwayId,
  ConceptId,
  StrokeStyleId,
  StrokeWeightId,
  VariantSpec,
} from './types'

export const CONCEPTS: Array<{ id: ConceptId; name: string }> = [
  { id: 'beacon-waves', name: 'Beacon Waves' },
  { id: 'lighthouse-min', name: 'Lighthouse (Minimal)' },
  { id: 'lantern-page', name: 'Lantern + Page' },
  { id: 'b-beam', name: 'B + Beam' },
  { id: 'radar-sweep', name: 'Radar Sweep' },
  { id: 'compass-star', name: 'Compass Star' },
  { id: 'book-beam', name: 'Book + Beam' },
]

export const STROKE_WEIGHTS: Array<{ id: StrokeWeightId; name: string }> = [
  { id: 'thin', name: 'Thin' },
  { id: 'regular', name: 'Regular' },
  { id: 'bold', name: 'Bold' },
]

export const STYLES: Array<{ id: StrokeStyleId; name: string }> = [
  { id: 'mono', name: 'Mono' },
  { id: 'duo', name: 'Duo (Accent)' },
]

// Order matters: this ordering becomes your visual review flow.
export const COLORWAY_ORDER: ColorwayId[] = [
  'graphite-cyan',
  'navy-electric',
  'black-lime',
  'charcoal-amber',
  'slate-violet',
]

function idFor(v: {
  concept: ConceptId
  colorway: ColorwayId
  weight: StrokeWeightId
  style: StrokeStyleId
}): string {
  return `${v.concept}__${v.style}__${v.weight}__${v.colorway}`
}

export function buildVariants(): VariantSpec[] {
  const variants: VariantSpec[] = []

  for (const c of CONCEPTS) {
    for (const style of STYLES) {
      for (const weight of STROKE_WEIGHTS) {
        for (const colorway of COLORWAY_ORDER) {
          variants.push({
            id: idFor({
              concept: c.id,
              colorway,
              weight: weight.id,
              style: style.id,
            }),
            concept: c.id,
            conceptName: c.name,
            colorway,
            colorwayName: colorway,
            weight: weight.id,
            style: style.id,
          })
        }
      }
    }
  }

  return variants
}
