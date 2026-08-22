import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { format } from 'prettier'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const write = process.argv.includes('--write')

function quoteList(values) {
  return values.map((value) => `  ${value},`).join('\n')
}

function renderReactEntry(entry) {
  const importedTypes = [
    ...new Set(
      entry.elements.flatMap((element) =>
        element.events.map((event) => event.typeName),
      ),
    ),
  ]
  const elementImports = entry.elements.map(
    ({ className }) => `${className} as ${className}Element`,
  )
  const imports = [
    ...elementImports,
    ...importedTypes.map((name) => `type ${name}`),
  ]
  const hasEvents = importedTypes.length > 0
  const litReactImport = hasEvents
    ? "import { createComponent, type EventName } from '@lit/react'"
    : "import { createComponent } from '@lit/react'"
  const components = entry.elements
    .map((element) => {
      const eventLines = element.events.map(
        (event) =>
          `    ${event.propName}: '${event.eventName}' as EventName<${event.typeName}>,`,
      )
      const events =
        eventLines.length > 0
          ? `\n  events: {\n${eventLines.join('\n')}\n  },`
          : ''
      return `export const ${element.className} = createComponent({\n  displayName: '${element.className}',\n  elementClass: ${element.className}Element,${events}\n  react: React,\n  tagName: '${element.tagName}',\n})`
    })
    .join('\n\n')
  const typeExports =
    entry.typeExports.length > 0
      ? `\n\nexport type {\n${quoteList(entry.typeExports)}\n} from '@caderno-ui/elements/${entry.name}'`
      : ''

  return `import {\n${quoteList(imports)}\n} from '@caderno-ui/elements/${entry.name}'\n${litReactImport}\nimport React from 'react'\n\n${components}${typeExports}\n`
}

function renderIndex(entries) {
  return `${entries
    .filter(({ rootExport }) => rootExport !== false)
    .map(({ name }) => `export * from './${name}.js'`)
    .join('\n')}\n`
}

function tagNames(source) {
  return new Set(
    Array.from(source.matchAll(/<\/?(cad-[\w-]+)/g), ([, tagName]) => tagName),
  )
}

const inventory = JSON.parse(
  await readFile(path.join(root, 'config/components.json'), 'utf8'),
)
const expected = new Map(
  await Promise.all(
    inventory.entries.map(async (entry) => [
      path.join(root, `packages/react/src/${entry.name}.ts`),
      await format(renderReactEntry(entry), {
        filepath: path.join(root, `packages/react/src/${entry.name}.ts`),
        semi: false,
        singleQuote: true,
      }),
    ]),
  ),
)
expected.set(
  path.join(root, 'packages/react/src/index.ts'),
  await format(renderIndex(inventory.entries), {
    filepath: path.join(root, 'packages/react/src/index.ts'),
    semi: false,
    singleQuote: true,
  }),
)

const errors = []
for (const [file, source] of expected) {
  if (write) {
    await writeFile(file, source)
    continue
  }
  const actual = await readFile(file, 'utf8').catch(() => '')
  if (actual !== source) errors.push(`${path.relative(root, file)} is stale`)
}

const elementPackage = JSON.parse(
  await readFile(path.join(root, 'packages/elements/package.json'), 'utf8'),
)
const reactPackage = JSON.parse(
  await readFile(path.join(root, 'packages/react/package.json'), 'utf8'),
)
const astroPackage = JSON.parse(
  await readFile(path.join(root, 'packages/astro/package.json'), 'utf8'),
)

for (const entry of inventory.entries) {
  if (!elementPackage.exports[`./${entry.name}`]) {
    errors.push(`@caderno-ui/elements is missing export ./${entry.name}`)
  }
  if (!reactPackage.exports[`./${entry.name}`]) {
    errors.push(`@caderno-ui/react is missing export ./${entry.name}`)
  }

  const docs = path.join(root, 'apps/docs/src/pages/components', entry.docsPage)
  await readFile(docs).catch(() =>
    errors.push(`Missing docs page ${entry.docsPage}`),
  )

  const facadeTags = new Set()
  for (const facade of entry.astroFacades) {
    if (!astroPackage.exports[`./${facade}`]) {
      errors.push(`@caderno-ui/astro is missing export ./${facade}`)
      continue
    }
    const source = await readFile(
      path.join(root, 'packages/astro/src', facade),
      'utf8',
    ).catch(() => '')
    for (const tagName of tagNames(source)) facadeTags.add(tagName)
  }
  for (const { tagName } of entry.elements) {
    if (!facadeTags.has(tagName)) {
      errors.push(`Astro facades for ${entry.name} do not render <${tagName}>`)
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  console.error(
    'Run pnpm adapters:generate after reviewing config/components.json.',
  )
  process.exitCode = 1
} else {
  console.log(
    write
      ? `Generated ${expected.size} React adapter files.`
      : `Adapter inventory passed for ${inventory.entries.length} entry points.`,
  )
}
