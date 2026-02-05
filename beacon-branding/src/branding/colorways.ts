import type { Colorway } from './types'

export const COLORWAYS: Colorway[] = [
  {
    id: 'graphite-cyan',
    name: 'Graphite / Cyan',
    bgLight: '#F7F8FA',
    bgDark: '#0E1116',
    fgLight: '#0B1220',
    fgDark: '#E9EEF7',
    accent: '#2DE2FF',
  },
  {
    id: 'navy-electric',
    name: 'Navy / Electric Blue',
    bgLight: '#F6F8FF',
    bgDark: '#070B19',
    fgLight: '#08112B',
    fgDark: '#EAF0FF',
    accent: '#2D5BFF',
  },
  {
    id: 'black-lime',
    name: 'Black / Lime',
    bgLight: '#FBFBFB',
    bgDark: '#060709',
    fgLight: '#05060A',
    fgDark: '#F0F2F7',
    accent: '#7CFF6B',
  },
  {
    id: 'charcoal-amber',
    name: 'Charcoal / Amber',
    bgLight: '#FAF7F0',
    bgDark: '#101214',
    fgLight: '#111318',
    fgDark: '#EEF0F3',
    accent: '#FFC857',
  },
  {
    id: 'slate-violet',
    name: 'Slate / Violet',
    bgLight: '#F7F7FE',
    bgDark: '#0F1022',
    fgLight: '#121826',
    fgDark: '#EDEFFF',
    accent: '#7C4DFF',
  },
]

export function getColorway(id: Colorway['id']): Colorway {
  const cw = COLORWAYS.find((c) => c.id === id)
  if (!cw) throw new Error(`Unknown colorway: ${id}`)
  return cw
}
