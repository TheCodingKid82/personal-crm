import { useMemo, useState } from 'react'
import './App.css'
import type { BgMode, ColorwayId, ConceptId, StrokeStyleId, StrokeWeightId } from './branding/types'
import { getColorway } from './branding/colorways'
import { buildVariants, COLORWAY_ORDER, CONCEPTS, STROKE_WEIGHTS, STYLES } from './branding/variants'
import { renderConceptSvg } from './branding/svg'
import { downloadBlob, downloadText, svgToPngBlob } from './branding/export'

type GeneratedComp = {
  id: string
  conceptId: ConceptId
  conceptName: string
  prompt: string
  model: string
  createdAt: number
  images: Array<{ mimeType: string; base64: string }>
}

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

  const [nanoModel, setNanoModel] = useState<'flash' | 'pro'>('flash')
  const [genBusy, setGenBusy] = useState<ConceptId | null>(null)
  const [genError, setGenError] = useState<string | null>(null)
  const [generated, setGenerated] = useState<GeneratedComp[]>([])

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

  function buildNanoBananaPrompt(c: { id: ConceptId; name: string }) {
    // Template tuned for logo comps: simple, geometric, no text, app-icon friendly.
    return [
      `Design a modern minimal logo mark / app icon for a consumer product called "Beacon".`,
      `Concept direction: ${c.name}.`,
      `Style: flat vector, clean geometry, high contrast, centered composition, simple shapes, no gradients.`,
      `Constraints: NO text, NO letters, NO words, NO watermarks, no mockups, no background scene.`,
      `Deliverable: 1:1 square PNG with transparent background, crisp edges, icon-ready.`
    ].join('\n')
  }

  function base64ToBlob(base64: string, mimeType: string) {
    const bin = atob(base64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return new Blob([bytes], { type: mimeType })
  }

  async function generateForConcept(c: { id: ConceptId; name: string }) {
    setGenError(null)
    setGenBusy(c.id)

    const prompt = buildNanoBananaPrompt(c)
    const model = nanoModel === 'pro' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image'

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspect: '1:1',
          model,
          n: 2,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json?.error ?? 'Generation failed')

      const comp: GeneratedComp = {
        id: `${c.id}__${Date.now()}__${Math.random().toString(16).slice(2)}`,
        conceptId: c.id,
        conceptName: c.name,
        prompt,
        model: json.model,
        createdAt: Date.now(),
        images: json.images,
      }

      setGenerated((prev) => [comp, ...prev])
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Generation failed'
      setGenError(msg)
    } finally {
      setGenBusy(null)
    }
  }

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
          <label className="seg">
            <span>Nano Banana</span>
            <select value={nanoModel} onChange={(e) => setNanoModel(e.target.value as 'flash' | 'pro')}>
              <option value="flash">Flash (gemini-2.5-flash-image)</option>
              <option value="pro">Pro (gemini-3-pro-image-preview)</option>
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

      <section className="filters">
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Generate AI comps (Nano Banana)</div>
            <div style={{ opacity: 0.8, fontSize: 13 }}>
              Generates fresh raster comps per concept (no text) and shows them below.
            </div>
          </div>

          {genError ? (
            <div style={{ color: '#ff8a8a', fontSize: 13, maxWidth: 520 }}>{genError}</div>
          ) : null}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
          {CONCEPTS.map((c) => (
            <button
              key={c.id}
              onClick={() => generateForConcept(c)}
              disabled={!!genBusy}
              title={buildNanoBananaPrompt(c)}
              style={{
                opacity: genBusy && genBusy !== c.id ? 0.5 : 1,
              }}
            >
              {genBusy === c.id ? `Generating ${c.name}…` : `Generate: ${c.name}`}
            </button>
          ))}
        </div>
      </section>

      {generated.length ? (
        <section className="grid" style={{ paddingTop: 0 }}>
          {generated.flatMap((g) =>
            g.images.map((img, idx) => {
              const src = `data:${img.mimeType};base64,${img.base64}`
              const filename = `beacon__nano-banana__${g.conceptId}__${g.model}__${new Date(
                g.createdAt
              )
                .toISOString()
                .replace(/[:.]/g, '-')}_${idx + 1}.png`

              return (
                <div key={`${g.id}__${idx}`} className="card" style={{ background: '#111827' }}>
                  <img
                    src={src}
                    alt={`${g.conceptName} comp ${idx + 1}`}
                    style={{ width: '100%', height: 220, objectFit: 'contain', padding: 14 }}
                  />

                  <div className="label">
                    <div className="labelTop">{g.conceptName}</div>
                    <div className="labelBottom">{g.model}</div>
                  </div>

                  <div className="actions">
                    <button
                      onClick={() => {
                        const blob = base64ToBlob(img.base64, img.mimeType)
                        downloadBlob(filename, blob)
                      }}
                    >
                      Download PNG
                    </button>

                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(g.prompt)
                      }}
                    >
                      Copy prompt
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </section>
      ) : null}

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
