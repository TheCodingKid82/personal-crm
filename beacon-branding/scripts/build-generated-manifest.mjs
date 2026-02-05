import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.cwd(), 'public', 'generated')

/**
 * Output shape:
 * {
 *   generatedAt: string,
 *   concepts: Array<{ id: string, items: Array<{ src: string, filename: string }> }>
 * }
 */

function listDirs(p) {
  if (!fs.existsSync(p)) return []
  return fs
    .readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

function listPngs(p) {
  if (!fs.existsSync(p)) return []
  return fs
    .readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((n) => n.toLowerCase().endsWith('.png'))
    .sort((a, b) => a.localeCompare(b))
}

const concepts = []
for (const id of listDirs(root)) {
  const dir = path.join(root, id)
  const items = listPngs(dir).map((filename) => ({
    src: `/generated/${encodeURIComponent(id)}/${encodeURIComponent(filename)}`,
    filename,
  }))

  concepts.push({ id, items })
}

concepts.sort((a, b) => a.id.localeCompare(b.id))

const out = {
  generatedAt: new Date().toISOString(),
  concepts,
}

fs.mkdirSync(root, { recursive: true })
fs.writeFileSync(path.join(root, 'manifest.json'), JSON.stringify(out, null, 2) + '\n', 'utf8')
console.log(`[generated] wrote ${path.join(root, 'manifest.json')} with ${concepts.reduce((n, c) => n + c.items.length, 0)} images`) 
