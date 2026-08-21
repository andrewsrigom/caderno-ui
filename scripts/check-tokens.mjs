import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoots = ['apps', 'packages']
const sourceExtensions = new Set(['.astro', '.css', '.ts', '.tsx'])
const skippedDirectories = new Set([
  '.artifacts',
  '.astro',
  'coverage',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
])

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.isDirectory() && skippedDirectories.has(entry.name)) continue
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(absolute)))
    else if (sourceExtensions.has(path.extname(entry.name)))
      files.push(absolute)
  }

  return files
}

function declarations(source) {
  return Array.from(
    source.matchAll(/(--[\w-]+)\s*:\s*([\s\S]*?);/g),
    ([, name, value]) => ({ name, value: value.trim() }),
  )
}

function references(value) {
  return Array.from(
    value.matchAll(/var\(\s*(--cad-[\w-]+)/g),
    ([, name]) => name,
  )
}

function themeBlock(source, theme) {
  const blocks = Array.from(source.matchAll(/([^{}]+)\{([^{}]*)\}/gs))
  const match = blocks.find(([, selector]) => {
    if (theme === 'light') return selector.includes(":root[data-theme='light']")
    return (
      selector.includes(':root') &&
      selector.includes(":root[data-theme='dark']")
    )
  })

  if (!match) throw new Error(`Missing ${theme} theme block in semantic.css`)
  return match[2]
}

function mapDeclarations(source) {
  return new Map(
    declarations(source)
      .filter(({ name }) => name.startsWith('--cad-'))
      .map(({ name, value }) => [name, value]),
  )
}

function detectCycles(graph) {
  const visiting = new Set()
  const visited = new Set()
  const cycles = []

  function visit(node, trail) {
    if (visiting.has(node)) {
      const start = trail.indexOf(node)
      cycles.push([...trail.slice(start), node])
      return
    }
    if (visited.has(node)) return

    visiting.add(node)
    for (const next of graph.get(node) ?? []) visit(next, [...trail, node])
    visiting.delete(node)
    visited.add(node)
  }

  for (const node of graph.keys()) visit(node, [])
  return cycles
}

function resolveColor(name, values, trail = []) {
  if (trail.includes(name))
    throw new Error(`Token cycle while resolving ${name}`)
  const value = values.get(name)
  if (!value) throw new Error(`Cannot resolve missing color token ${name}`)

  const variable = value.match(/^var\(\s*(--cad-[\w-]+)\s*(?:,[^)]+)?\)$/)
  if (variable) return resolveColor(variable[1], values, [...trail, name])

  const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i)
  if (!hex)
    throw new Error(`${name} must resolve to a hex color, received ${value}`)
  const expanded =
    hex[1].length === 3
      ? Array.from(hex[1], (character) => character.repeat(2)).join('')
      : hex[1]
  return [0, 2, 4].map((index) =>
    Number.parseInt(expanded.slice(index, index + 2), 16),
  )
}

function luminance(rgb) {
  const linear = rgb.map((channel) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function contrast(first, second) {
  const [lighter, darker] = [luminance(first), luminance(second)].sort(
    (left, right) => right - left,
  )
  return (lighter + 0.05) / (darker + 0.05)
}

const contract = JSON.parse(
  await readFile(path.join(root, 'config/token-contract.json'), 'utf8'),
)
const manifest = JSON.parse(
  await readFile(
    path.join(root, 'packages/elements/custom-elements.json'),
    'utf8',
  ),
)
const semanticSource = await readFile(
  path.join(root, 'packages/tokens/src/semantic.css'),
  'utf8',
)
const primitiveSource = await readFile(
  path.join(root, 'packages/tokens/src/primitives.css'),
  'utf8',
)

const files = (
  await Promise.all(
    sourceRoots.map((directory) => walk(path.join(root, directory))),
  )
).flat()
const definitions = new Map()
const usages = new Map()
const invalidTokenDefinitions = []

for (const file of files) {
  const relative = path.relative(root, file).replaceAll(path.sep, '/')
  const source = await readFile(file, 'utf8')

  for (const { name, value } of declarations(source)) {
    if (relative.startsWith('packages/tokens/') && !name.startsWith('--cad-')) {
      invalidTokenDefinitions.push(`${relative}: ${name}`)
    }
    if (!name.startsWith('--cad-')) continue
    const entries = definitions.get(name) ?? []
    entries.push({ file: relative, value })
    definitions.set(name, entries)
  }

  for (const name of references(source)) {
    const entries = usages.get(name) ?? new Set()
    entries.add(relative)
    usages.set(name, entries)
  }
}

const optionalComponentTokens = new Set(
  manifest.modules.flatMap((module) =>
    (module.declarations ?? []).flatMap((declaration) =>
      (declaration.cssProperties ?? []).map(({ name }) => name),
    ),
  ),
)
const undefinedTokens = [...usages.keys()].filter(
  (name) => !definitions.has(name) && !optionalComponentTokens.has(name),
)

const graph = new Map(
  [...definitions].map(([name, entries]) => [
    name,
    new Set(entries.flatMap(({ value }) => references(value))),
  ]),
)
const cycles = detectCycles(graph)
const primitives = mapDeclarations(primitiveSource)
const themes = {}
const errors = []

for (const theme of ['dark', 'light']) {
  const block = themeBlock(semanticSource, theme)
  const themeValues = mapDeclarations(block)
  const colorScheme = block.match(/color-scheme\s*:\s*([\w-]+)/)?.[1]
  const missing = contract.semanticRequired.filter(
    (name) => !themeValues.has(name),
  )
  if (colorScheme !== theme) {
    errors.push(`${theme} theme must declare color-scheme: ${theme}`)
  }
  if (missing.length > 0) {
    errors.push(`${theme} theme is missing: ${missing.join(', ')}`)
  }

  const values = new Map([...primitives, ...themeValues])
  const contrastResults = contract.contrastPairs.map(
    ({ background, foreground, minimum }) => {
      const ratio = contrast(
        resolveColor(background, values),
        resolveColor(foreground, values),
      )
      if (ratio < minimum) {
        errors.push(
          `${theme} ${foreground} on ${background} is ${ratio.toFixed(2)}:1; expected at least ${minimum}:1`,
        )
      }
      return {
        background,
        foreground,
        minimum,
        ratio: Number(ratio.toFixed(2)),
      }
    },
  )

  themes[theme] = { colorScheme, contrast: contrastResults }
}

if (invalidTokenDefinitions.length > 0) {
  errors.push(
    `Non-cad custom properties in tokens package:\n${invalidTokenDefinitions.join('\n')}`,
  )
}
if (undefinedTokens.length > 0) {
  errors.push(`Undefined tokens: ${undefinedTokens.join(', ')}`)
}
if (cycles.length > 0) {
  errors.push(
    `Token cycles: ${cycles.map((cycle) => cycle.join(' -> ')).join('; ')}`,
  )
}

const report = {
  defined: [...definitions.keys()].sort(),
  optionalComponentTokens: [...optionalComponentTokens].sort(),
  themes,
  undefined: undefinedTokens.sort(),
  unused: [...definitions.keys()].filter((name) => !usages.has(name)).sort(),
  used: Object.fromEntries(
    [...usages]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([name, sourceFiles]) => [name, [...sourceFiles].sort()]),
  ),
}

await mkdir(path.join(root, '.artifacts'), { recursive: true })
await writeFile(
  path.join(root, '.artifacts/tokens-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
)

if (errors.length > 0) {
  console.error(errors.join('\n\n'))
  process.exitCode = 1
} else {
  console.log(
    `Token contract passed (${definitions.size} defined, ${usages.size} used, ${report.unused.length} currently unused).`,
  )
}
