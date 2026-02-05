export function downloadText(filename: string, text: string, mime = 'text/plain') {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function svgToPngBlob(
  svgText: string,
  opts: { size: number; background?: string },
): Promise<Blob> {
  const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
  const svgUrl = URL.createObjectURL(svgBlob)

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = () => reject(new Error('Failed to load SVG into Image()'))
      i.src = svgUrl
    })

    const canvas = document.createElement('canvas')
    canvas.width = opts.size
    canvas.height = opts.size
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get 2D canvas context')

    if (opts.background) {
      ctx.fillStyle = opts.background
      ctx.fillRect(0, 0, opts.size, opts.size)
    }

    ctx.drawImage(img, 0, 0, opts.size, opts.size)

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (!b) return reject(new Error('canvas.toBlob returned null'))
        resolve(b)
      }, 'image/png')
    })

    return pngBlob
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
