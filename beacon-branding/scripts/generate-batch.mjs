import fs from 'node:fs/promises'
import path from 'node:path'

const API_URL = process.env.NANO_BANANA_LOCAL_URL ?? 'http://localhost:8787/api/generate-image'
const OUT_ROOT = path.resolve('public', 'generated')

const CONCEPTS = [
  { id: 'beacon-waves', name: 'Beacon Waves' },
  { id: 'lighthouse-min', name: 'Lighthouse (Minimal)' },
  { id: 'lantern-page', name: 'Lantern + Page' },
  { id: 'b-beam', name: 'B + Beam' },
  { id: 'radar-sweep', name: 'Radar Sweep' },
  { id: 'compass-star', name: 'Compass Star' },
  { id: 'book-beam', name: 'Book + Beam' },
]

function buildNanoBananaPrompt(c) {
  return [
    'Design a modern minimal logo mark / app icon for a consumer product called "Beacon".',
    `Concept direction: ${c.name}.`,
    'Style: flat vector, clean geometry, high contrast, centered composition, simple shapes, no gradients.',
    'Constraints: NO text, NO letters, NO words, NO watermarks, no mockups, no background scene.',
    'Deliverable: 1:1 square PNG with transparent background, crisp edges, icon-ready.',
  ].join('\n')
}

function safeIsoTimestamp(d = new Date()) {
  return d.toISOString().replace(/[:.]/g, '-')
}

function dataToBuffer(base64) {
  return Buffer.from(base64, 'base64')
}

async function generateForConceptOnce({ prompt, model, n }) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      aspect: '1:1',
      model,
      n,
    }),
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json?.error ?? `Generation failed (${res.status})`)
  }

  return {
    model: json.model ?? model,
    images: Array.isArray(json.images) ? json.images : [],
  }
}

async function generateForConcept({ conceptId, conceptName, prompt, model, n }) {
  // Some Gemini image models don't support multiple candidates per request.
  // To be robust, we generate n single-candidate requests and concatenate.
  const images = []
  let actualModel = model

  for (let i = 0; i < n; i++) {
    const out = await generateForConceptOnce({ prompt, model, n: 1 })
    actualModel = out.model ?? actualModel
    if (out.images?.[0]) images.push(out.images[0])
    // light pacing
    await new Promise((r) => setTimeout(r, 250))
  }

  return {
    conceptId,
    conceptName,
    prompt,
    model: actualModel,
    images,
  }
}

async function main() {
  const createdAt = Date.now()
  const stamp = safeIsoTimestamp(new Date(createdAt))

  const batch = {
    batchId: `batch__${stamp}`,
    createdAt,
    apiUrl: API_URL,
    keepFirstN: 2,
    requestedN: 4,
    model: process.env.NANO_BANANA_MODEL ?? 'gemini-3-pro-image-preview',
    concepts: [],
  }

  await fs.mkdir(OUT_ROOT, { recursive: true })

  for (const c of CONCEPTS) {
    const prompt = buildNanoBananaPrompt(c)
    const result = await generateForConcept({
      conceptId: c.id,
      conceptName: c.name,
      prompt,
      model: batch.model,
      n: 4,
    })

    const conceptDir = path.join(OUT_ROOT, c.id)
    await fs.mkdir(conceptDir, { recursive: true })

    const kept = result.images.slice(0, 2)
    const files = []

    for (let i = 0; i < kept.length; i++) {
      const img = kept[i]
      const ext = img.mimeType === 'image/jpeg' ? 'jpg' : img.mimeType === 'image/webp' ? 'webp' : 'png'
      const filename = `${stamp}-${i + 1}.${ext}`
      const filePath = path.join(conceptDir, filename)
      await fs.writeFile(filePath, dataToBuffer(img.base64))
      files.push(`/generated/${c.id}/${filename}`)
    }

    batch.concepts.push({
      conceptId: c.id,
      conceptName: c.name,
      prompt,
      model: result.model,
      files,
    })

    // Basic pacing: server is already queued, but a tiny pause helps avoid client-side bursts.
    await new Promise((r) => setTimeout(r, 250))
  }

  const indexPath = path.join(OUT_ROOT, 'index.json')
  await fs.writeFile(indexPath, JSON.stringify(batch, null, 2) + '\n', 'utf8')

  console.log(`Wrote ${indexPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
