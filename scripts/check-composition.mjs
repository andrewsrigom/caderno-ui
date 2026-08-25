import { readFile, readdir } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const elementsRoot = join(root, 'packages/elements/src')
const errors = []

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (
    await Promise.all(
      entries.map((entry) => {
        const path = join(directory, entry.name)
        return entry.isDirectory() ? collect(path) : [path]
      }),
    )
  ).flat()
}

for (const file of (await collect(elementsRoot)).filter(
  (path) => extname(path) === '.ts',
)) {
  const source = await readFile(file, 'utf8')
  const displayPath = relative(root, file).replaceAll('\\', '/')
  const isPublicIconBoundary =
    displayPath.endsWith('/icon/cad-icon.ts') ||
    displayPath === 'packages/elements/src/index.ts'

  if (!isPublicIconBoundary && source.includes("/icon/cad-icon.js'")) {
    errors.push(`${displayPath} imports the optional public icon registry`)
  }
  if (!isPublicIconBoundary && source.includes("from '@caderno-ui/icons'")) {
    errors.push(`${displayPath} imports the complete icon package`)
  }
}

if (errors.length > 0) {
  console.error(`Composition boundary validation failed (${errors.length}):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log('Composition boundaries keep optional artwork out of primitives.')
}
