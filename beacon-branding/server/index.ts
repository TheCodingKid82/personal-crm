import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

type GenerateImageRequest = {
  prompt: string
  seed?: number
  aspect?: '1:1' | '4:5' | '3:2' | '16:9'
  model?: string
  n?: number
}

type GenerateImageResponse = {
  model: string
  images: Array<{
    mimeType: string
    base64: string
  }>
}

const PORT = Number(process.env.NANO_BANANA_SERVER_PORT ?? 8787)
const API_KEY = process.env.NANO_BANANA_API_KEY
const DEFAULT_MODEL = process.env.NANO_BANANA_MODEL_DEFAULT ?? 'gemini-2.5-flash-image'

if (!API_KEY) {
  // Intentionally do NOT log env content.
  console.warn('[nano-banana] Missing NANO_BANANA_API_KEY. Image generation will fail until you set it.')
}

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

// Basic per-IP rate limiting so we don't accidentally hammer the API.
app.use(
  '/api/',
  rateLimit({
    windowMs: 60_000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
  })
)

// Super simple in-memory queue: only 1 request in-flight at a time.
let queueTail: Promise<unknown> = Promise.resolve()
function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = async () => fn()
  const next = queueTail.then(run, run)
  // keep tail alive regardless of success/failure
  queueTail = next.then(
    () => undefined,
    () => undefined
  )
  return next
}

async function geminiGenerateImage(args: {
  prompt: string
  model: string
  seed?: number
  aspect?: string
  n?: number
}): Promise<GenerateImageResponse> {
  if (!API_KEY) throw new Error('Server missing NANO_BANANA_API_KEY')

  const n = Math.max(1, Math.min(args.n ?? 2, 4))
  const aspect = args.aspect ?? '1:1'

  // Gemini REST API (v1beta) generateContent
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    args.model
  )}:generateContent?key=${encodeURIComponent(API_KEY)}`

  // Many image-capable Gemini models accept responseModalities.
  const body: Record<string, unknown> = {
    contents: [
      {
        role: 'user',
        parts: [{ text: args.prompt }],
      },
    ],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      // Best-effort hints. If unsupported by the model, API ignores/errs.
      candidateCount: n,
    },
  }

  const generationConfig = body.generationConfig as Record<string, unknown>

  if (typeof args.seed === 'number' && Number.isFinite(args.seed)) {
    generationConfig.seed = Math.trunc(args.seed)
  }

  // Some models understand aspect ratio hints best via prompt; still include a structured hint when supported.
  generationConfig.imageConfig = { aspectRatio: aspect }

  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 60_000)

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: ctrl.signal,
  }).finally(() => clearTimeout(t))

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Gemini error ${res.status}: ${text.slice(0, 400)}`)
  }

  type GeminiInlineData = { mimeType?: string; data?: string }
  type GeminiPart = { inlineData?: GeminiInlineData }
  type GeminiCandidate = { content?: { parts?: GeminiPart[] } }
  type GeminiResponse = { candidates?: GeminiCandidate[] }

  const json = (await res.json()) as GeminiResponse
  const images: GenerateImageResponse['images'] = []

  for (const cand of json.candidates ?? []) {
    const parts = cand?.content?.parts ?? []
    for (const p of parts) {
      const inline = p?.inlineData
      const mimeType = inline?.mimeType
      const data = inline?.data
      if (data && mimeType && mimeType.startsWith('image/')) {
        images.push({ mimeType, base64: data })
      }
    }
  }

  if (!images.length) {
    // Include a small snippet for debugging but avoid dumping massive payloads.
    throw new Error('No image data returned by Gemini for this prompt.')
  }

  return { model: args.model, images }
}

app.post('/api/generate-image', async (req, res) => {
  const body = (req.body ?? {}) as GenerateImageRequest
  const prompt = (body.prompt ?? '').toString().trim()

  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  const model = (body.model ?? DEFAULT_MODEL).toString().trim()

  try {
    const out = await enqueue(() =>
      geminiGenerateImage({
        prompt,
        model,
        seed: body.seed,
        aspect: body.aspect,
        n: body.n,
      })
    )

    return res.json(out)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: message })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`[nano-banana] server listening on http://localhost:${PORT}`)
})
