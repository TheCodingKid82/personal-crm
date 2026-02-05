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

function isImagenModel(model: string) {
  return model.toLowerCase().startsWith('imagen-')
}

function safeEndpointForLog(url: string) {
  try {
    const u = new URL(url)
    if (u.searchParams.has('key')) u.searchParams.set('key', 'REDACTED')
    return u.toString()
  } catch {
    return url
  }
}

async function fetchJsonWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal })
    return res
  } finally {
    clearTimeout(t)
  }
}

async function geminiGenerateImage(args: {
  prompt: string
  model: string
  seed?: number
  aspect?: string
  n?: number
}): Promise<GenerateImageResponse> {
  if (!API_KEY) throw new Error('Server missing NANO_BANANA_API_KEY')

  const requestedN = Math.max(1, Math.min(args.n ?? 2, 4))
  const aspect = args.aspect ?? '1:1'

  // Gemini REST API (v1beta) generateContent
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    args.model
  )}:generateContent?key=${encodeURIComponent(API_KEY)}`

  const looksLikeMultipleCandidatesNotEnabled = (text: string) => {
    const t = text.toLowerCase()
    return (
      (t.includes('multiple') && t.includes('candidate')) ||
      t.includes('candidatecount') ||
      t.includes('candidate count') ||
      t.includes('only one candidate')
    )
  }

  const extractInlineData = (part: unknown): { mimeType?: string; data?: string } | null => {
    if (!part || typeof part !== 'object') return null
    const p = part as Record<string, unknown>

    const inline =
      (p.inlineData as unknown) ??
      (p.inline_data as unknown) ??
      // Some SDKs flatten/rename.
      (p.data ? p : undefined)

    if (!inline || typeof inline !== 'object') return null
    const i = inline as Record<string, unknown>

    const mimeType =
      (i.mimeType as string | undefined) ??
      (i.mime_type as string | undefined) ??
      (p.mimeType as string | undefined) ??
      (p.mime_type as string | undefined)

    const data =
      (i.data as string | undefined) ??
      (i.bytesBase64Encoded as string | undefined) ??
      (i.bytes_base64_encoded as string | undefined) ??
      (p.data as string | undefined)

    if (!data) return null
    return { mimeType, data }
  }

  const doRequest = async (candidateCount: number) => {
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
        // Best-effort hint; may be rejected by some models.
        candidateCount,
      },
    }

    const generationConfig = body.generationConfig as Record<string, unknown>

    if (typeof args.seed === 'number' && Number.isFinite(args.seed)) {
      generationConfig.seed = Math.trunc(args.seed)
    }

    // Some models understand aspect ratio hints best via prompt; still include a structured hint when supported.
    generationConfig.imageConfig = { aspectRatio: aspect }

    const res = await fetchJsonWithTimeout(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
      60_000
    )

    const text = res.ok ? '' : await res.text().catch(() => '')
    return { res, text }
  }

  // First try requested candidateCount. If the API says multi-candidates aren't enabled,
  // automatically retry with candidateCount=1.
  let attemptCandidateCount = requestedN
  let { res, text } = await doRequest(attemptCandidateCount)

  if (!res.ok && attemptCandidateCount > 1 && looksLikeMultipleCandidatesNotEnabled(text)) {
    attemptCandidateCount = 1
    ;({ res, text } = await doRequest(attemptCandidateCount))
  }

  if (!res.ok) {
    console.error('[nano-banana] Gemini generateContent error', {
      model: args.model,
      status: res.status,
      endpoint: safeEndpointForLog(url),
      body: text.slice(0, 800),
    })
    throw new Error(`Gemini error ${res.status}: ${text.slice(0, 400)}`)
  }

  type GeminiCandidate = { content?: { parts?: unknown[] } }
  type GeminiResponse = { candidates?: GeminiCandidate[] }

  const json = (await res.json()) as GeminiResponse
  const images: GenerateImageResponse['images'] = []

  for (const cand of json.candidates ?? []) {
    const parts = cand?.content?.parts ?? []
    for (const part of parts) {
      const inline = extractInlineData(part)
      if (!inline) continue

      const mimeType = inline.mimeType ?? 'image/png'
      const data = inline.data
      if (data && mimeType.startsWith('image/')) {
        images.push({ mimeType, base64: data })
      }
    }
  }

  if (!images.length) {
    throw new Error('No image data returned by Gemini for this prompt.')
  }

  return { model: args.model, images }
}

async function imagenPredict(args: {
  prompt: string
  model: string
  aspect?: string
  n?: number
}): Promise<GenerateImageResponse> {
  if (!API_KEY) throw new Error('Server missing NANO_BANANA_API_KEY')

  const sampleCount = Math.max(1, Math.min(args.n ?? 2, 4))
  const aspectRatio = args.aspect ?? '1:1'

  // Imagen REST API (v1beta) predict
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    args.model
  )}:predict?key=${encodeURIComponent(API_KEY)}`

  // Per Andrew:
  // { instances:[{prompt}], parameters:{ sampleCount, aspectRatio } }
  const body = {
    instances: [{ prompt: args.prompt }],
    parameters: {
      sampleCount,
      aspectRatio,
    },
  }

  const res = await fetchJsonWithTimeout(
    url,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    90_000
  )

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('[nano-banana] Imagen predict error', {
      model: args.model,
      status: res.status,
      endpoint: safeEndpointForLog(url),
      body: text.slice(0, 800),
    })
    throw new Error(`Imagen error ${res.status}: ${text.slice(0, 400)}`)
  }

  type ImagenPrediction = {
    mimeType?: string
    bytesBase64Encoded?: string
    image?: { mimeType?: string; bytesBase64Encoded?: string }
  }
  type ImagenResponse = { predictions?: ImagenPrediction[] }

  const json = (await res.json()) as ImagenResponse

  const images: GenerateImageResponse['images'] = []
  for (const pred of json.predictions ?? []) {
    const base64 = pred?.bytesBase64Encoded ?? pred?.image?.bytesBase64Encoded
    if (!base64) continue

    const mimeType = pred?.mimeType ?? pred?.image?.mimeType ?? 'image/png'
    images.push({ mimeType, base64 })
  }

  if (!images.length) {
    console.error('[nano-banana] Imagen predict returned no images', {
      model: args.model,
      predictionsCount: Array.isArray(json.predictions) ? json.predictions.length : 0,
    })
    throw new Error('No image data returned by Imagen for this prompt.')
  }

  return { model: args.model, images }
}

app.post('/api/generate-image', async (req, res) => {
  const body = (req.body ?? {}) as GenerateImageRequest
  const prompt = (body.prompt ?? '').toString().trim()

  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  const model = (body.model ?? DEFAULT_MODEL).toString().trim()
  const aspect = body.aspect
  const n = body.n

  try {
    const out = await enqueue(() => {
      if (isImagenModel(model)) {
        return imagenPredict({ prompt, model, aspect, n })
      }
      return geminiGenerateImage({ prompt, model, seed: body.seed, aspect, n })
    })

    return res.json(out)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[nano-banana] /api/generate-image failed', {
      model,
      aspect,
      n,
      promptLen: prompt.length,
      error: message,
    })
    return res.status(500).json({ error: message })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`[nano-banana] server listening on http://localhost:${PORT}`)
})
