import { useMemo, useState } from 'react'
import './App.css'
import type { BgMode, ColorwayId, ConceptId, StrokeStyleId, StrokeWeightId } from './branding/types'
import { getColorway } from './branding/colorways'
import { buildVariants, COLORWAY_ORDER, CONCEPTS, STROKE_WEIGHTS, STYLES } from './branding/variants'
import { renderConceptSvg } from './branding/svg'
import { downloadBlob, downloadText, svgToPngBlob } from './branding/export'

type FilterAll<T extends string> = T | 'all'

function App() {
  const variants = useMemo(() => buildVariants(), [])

  const [bgMode, setBgMode] = useState<BgMode>('dark')
  const [concept, setConcept] = useState<FilterAll<ConceptId>>('all')
  const [colorway, setColorway] = useState<FilterAll<ColorwayId>>('all')
  const [weight, setWeight] = useState<FilterAll<StrokeWeightId>>('regular')
  const [style, setStyle] = useState<FilterAll<StrokeStyleId>>('duo')
  const [query, setQuery] = useState('')
  const [pngBg, setPngBg] = useState<'transparent' | 'match'>('match')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return variants.filter((v) => {
      if (concept !== 'all' && v.concept !== concept) return false
      if (colorway !== 'all' && v.colorway !== colorway) return false
      if (weight !== 'all' && v.weight !== weight) return false
      if (style !== 'all' && v.style !== style) return false
      if (!q) return true
      return (
        v.id.toLowerCase().includes(q) ||
        v.conceptName.toLowerCase().includes(q) ||
        v.colorway.toLowerCase().includes(q)
      )
    })
  }, [variants, concept, colorway, weight, style, query])

  const pageBg = bgMode === 'dark' ? '#0B0E14' : '#F6F7FB'
  const pageFg = bgMode === 'dark' ? '#EAEFFC' : '#0B1220'

  return (
    <div className="page" style={{ background: pageBg, color: pageFg }}>
      <header className="header">
        <div>
          <div className="kicker">Beacon</div>
          <h1 className="title">Local Logo / Icon Explorer</h1>
          <div className="sub">Data-driven SVG variants • 24px geometry • export SVG/PNG</div>
        </div>

        <div className="toolbar">
          <label className="seg">
            <span>Background</span>
            <select value={bgMode} onChange={(e) => setBgMode(e.target.value as BgMode)}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
          <label className="seg">
            <span>PNG BG</span>
            <select value={pngBg} onChange={(e) => setPngBg(e.target.value as 'transparent' | 'match')}>
              <option value="match">Match preview</option>
              <option value="transparent">Transparent</option>
            </select>
          </label>
        </div>
      </header>

      <section className="filters">
        <div className="filtersRow">
          <label>
            <span>Concept</span>
            <select value={concept} onChange={(e) => setConcept(e.target.value as FilterAll<ConceptId>)}>
              <option value="all">All</option>
              {CONCEPTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Colorway</span>
            <select
              value={colorway}
              onChange={(e) => setColorway(e.target.value as FilterAll<ColorwayId>)}
            >
              <option value="all">All</option>
              {COLORWAY_ORDER.map((id) => (
                <option key={id} value={id}>
                  {getColorway(id).name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Stroke</span>
            <select value={weight} onChange={(e) => setWeight(e.target.value as FilterAll<StrokeWeightId>)}>
              <option value="all">All</option>
              {STROKE_WEIGHTS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Style</span>
            <select value={style} onChange={(e) => setStyle(e.target.value as FilterAll<StrokeStyleId>)}>
              <option value="all">All</option>
              {STYLES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className="search">
            <span>Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="beacon, lime, compass…"
            />
          </label>
        </div>

        <div className="meta">
          Showing <b>{filtered.length}</b> / {variants.length} variants
        </div>
      </section>

      <main className="grid">
        {filtered.map((v) => {
          const cw = getColorway(v.colorway)
          const tileBg = bgMode === 'dark' ? cw.bgDark : cw.bgLight
          const svg = renderConceptSvg({
            concept: v.concept,
            colorway: cw,
            bgMode,
            weight: v.weight,
            style: v.style,
            size: 96,
          })

          const baseName = `beacon__${v.concept}__${v.style}__${v.weight}__${cw.id}__${bgMode}`

          return (
            <div key={v.id + bgMode} className="card" style={{ background: tileBg }}>
              <div
                className="icon"
                aria-label={v.id}
                title={v.id}
                dangerouslySetInnerHTML={{ __html: svg }}
              />

              <div className="label">
                <div className="labelTop">{v.conceptName}</div>
                <div className="labelBottom">
                  {cw.name} • {v.style} • {v.weight}
                </div>
              </div>

              <div className="actions">
                <button
                  onClick={() => {
                    const fullSvg = renderConceptSvg({
                      concept: v.concept,
                      colorway: cw,
                      bgMode,
                      weight: v.weight,
                      style: v.style,
                      size: 24,
                    })
                    downloadText(`${baseName}.svg`, fullSvg, 'image/svg+xml')
                  }}
                >
                  SVG
                </button>

                <button
                  onClick={async () => {
                    const fullSvg = renderConceptSvg({
                      concept: v.concept,
                      colorway: cw,
                      bgMode,
                      weight: v.weight,
                      style: v.style,
                      size: 1024,
                    })
                    const bg = pngBg === 'match' ? tileBg : undefined
                    const blob = await svgToPngBlob(fullSvg, { size: 1024, background: bg })
                    downloadBlob(`${baseName}__1024.png`, blob)
                  }}
                >
                  PNG 1024
                </button>

                <button
                  onClick={async () => {
                    const fullSvg = renderConceptSvg({
                      concept: v.concept,
                      colorway: cw,
                      bgMode,
                      weight: v.weight,
                      style: v.style,
                      size: 512,
                    })
                    const bg = pngBg === 'match' ? tileBg : undefined
                    const blob = await svgToPngBlob(fullSvg, { size: 512, background: bg })
                    downloadBlob(`${baseName}__512.png`, blob)
                  }}
                >
                  PNG 512
                </button>

                <button
                  onClick={async () => {
                    const fullSvg = renderConceptSvg({
                      concept: v.concept,
                      colorway: cw,
                      bgMode,
                      weight: v.weight,
                      style: v.style,
                      size: 24,
                    })
                    await navigator.clipboard.writeText(fullSvg)
                  }}
                >
                  Copy SVG
                </button>
              </div>
            </div>
          )
        })}
      </main>

      <footer className="footer">
        <div>
          Tip: start with a single concept + duo regular, then flip background and colorways.
        </div>
      </footer>
    </div>
  )
}

export default App
