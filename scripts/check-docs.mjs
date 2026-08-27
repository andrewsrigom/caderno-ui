import { readdir, readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const docsRoot = join(root, 'apps/docs/src')
const manifest = JSON.parse(
  await readFile(join(root, 'packages/elements/custom-elements.json'), 'utf8'),
)
const errors = []
const inventory = JSON.parse(
  await readFile(join(root, 'config/components.json'), 'utf8'),
)
const entryForTag = new Map(
  inventory.entries.flatMap((entry) =>
    entry.elements.map((element) => [element.tagName, entry.name]),
  ),
)

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
  const source = (await readFile(file, 'utf8')).replaceAll('\r\n', '\n')
  const displayPath = file.slice(root.length)
  const frontmatterEnd = source.indexOf('\n---\n', 4)
  // Page frontmatter may itself contain an Astro example with --- delimiters.
  const pageStart = source.search(/\n<(?:!doctype|DocsLayout|DemoLayout)\b/i)
  const templateSource =
    pageStart >= 0
      ? source.slice(pageStart)
      : frontmatterEnd === -1
        ? source
        : source.slice(frontmatterEnd + 5)

  if (
    displayPath.includes('/layouts/') &&
    /import\s+['"]@caderno-ui\/elements['"]/.test(templateSource)
  ) {
    errors.push(
      `${displayPath}: runtime imports must use selective component entry points`,
    )
  }
  if (/from\s+['"][^'"]*packages\/(elements|tokens|astro)\//.test(source)) {
    errors.push(
      `${displayPath}: consume published package exports, not workspace internals`,
    )
  }
  if (extname(file) === '.astro') {
    const runtimeImports = new Set(
      Array.from(
        templateSource
          .replace(/import\s+type\s+[\s\S]*?from\s+['"][^'"]+['"]/g, '')
          .matchAll(
            /(?:from\s+|import\s*)['"]@caderno-ui\/elements\/([^'"]+)['"]/g,
          ),
        (match) => match[1],
      ),
    )
    const requiredEntries = new Set(
      Array.from(templateSource.matchAll(/<cad-[a-z0-9-]+/g), (match) =>
        entryForTag.get(match[0].slice(1)),
      ).filter(Boolean),
    )
    for (const entry of requiredEntries) {
      if (!runtimeImports.has(entry))
        errors.push(
          `${displayPath}: add runtime import @caderno-ui/elements/${entry}`,
        )
    }
  }

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

  if (
    templateSource.includes('<cad-chart') &&
    !templateSource.includes("import '@caderno-ui/elements/chart'") &&
    !templateSource.includes('import "@caderno-ui/elements/chart"')
  ) {
    errors.push(
      `${displayPath}: renders cad-chart without loading the optional @caderno-ui/elements/chart entry point`,
    )
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
