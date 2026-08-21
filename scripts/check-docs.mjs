import { readdir, readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const docsRoot = join(root, 'apps/docs/src')
const manifest = JSON.parse(
  await readFile(join(root, 'packages/elements/custom-elements.json'), 'utf8'),
)
const errors = []

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? collectFiles(path) : [path]
    }),
  )
  return files.flat()
}

const packageDirectories = await readdir(join(root, 'packages'), {
  withFileTypes: true,
})
const packages = new Map()
for (const directory of packageDirectories.filter((entry) =>
  entry.isDirectory(),
)) {
  const path = join(root, 'packages', directory.name, 'package.json')
  const packageJson = JSON.parse(await readFile(path, 'utf8'))
  packages.set(packageJson.name, packageJson)
}

const publicTags = new Set(
  manifest.modules.flatMap((module) =>
    (module.declarations ?? [])
      .filter((declaration) => declaration.customElement)
      .map((declaration) => declaration.tagName),
  ),
)

for (const file of (await collectFiles(docsRoot)).filter((path) =>
  ['.astro', '.ts'].includes(extname(path)),
)) {
  const source = await readFile(file, 'utf8')
  const displayPath = file.slice(root.length)

  for (const match of source.matchAll(
    /(?:from\s+|import\s*(?:\(|))['"](@caderno-ui\/[^'"]+)['"]/g,
  )) {
    const specifier = match[1]
    const [scope, name, ...subpathParts] = specifier.split('/')
    const packageName = `${scope}/${name}`
    const packageJson = packages.get(packageName)
    if (!packageJson) {
      errors.push(`${displayPath}: unknown workspace import ${specifier}`)
      continue
    }

    const exportKey =
      subpathParts.length === 0 ? '.' : `./${subpathParts.join('/')}`
    if (!packageJson.exports || !(exportKey in packageJson.exports)) {
      errors.push(
        `${displayPath}: ${specifier} is not a published export (${exportKey})`,
      )
    }
  }

  for (const match of source.matchAll(/(?:<|&lt;)(cad-[a-z0-9-]+)/g)) {
    if (!publicTags.has(match[1])) {
      errors.push(
        `${displayPath}: references unknown custom element ${match[1]}`,
      )
    }
  }
}

if (errors.length > 0) {
  console.error(`Documentation contract validation failed (${errors.length}):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(
    `Documentation imports and custom-element references match ${publicTags.size} public tags.`,
  )
}
