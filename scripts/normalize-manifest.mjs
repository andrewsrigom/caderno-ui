import { readFile, writeFile } from 'node:fs/promises'

const manifestPath = new URL(
  '../packages/elements/custom-elements.json',
  import.meta.url,
)
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))

manifest.modules.sort((left, right) => {
  if (left.path < right.path) return -1
  if (left.path > right.path) return 1
  return 0
})

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
