import { readFile } from 'node:fs/promises'
const manifestPath = new URL(
  '../packages/elements/custom-elements.json',
  import.meta.url,
)
const packagePath = new URL(
  '../packages/elements/package.json',
  import.meta.url,
)

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const packageJson = JSON.parse(await readFile(packagePath, 'utf8'))
const errors = []

const sorted = (values) =>
  [...values].sort((left, right) => left.localeCompare(right))
const difference = (left, right) =>
  sorted(left).filter((value) => !right.has(value))
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function compareSets(label, actual, expected, sourcePath) {
  const missing = difference(expected, actual)
  const stale = difference(actual, expected)

  if (missing.length > 0) {
    errors.push(
      `${sourcePath}: ${label} missing from the manifest: ${missing.join(', ')}`,
    )
  }
  if (stale.length > 0) {
    errors.push(
      `${sourcePath}: ${label} declared but not rendered: ${stale.join(', ')}`,
    )
  }
}

if (manifest.schemaVersion !== '1.0.0' || !Array.isArray(manifest.modules)) {
  errors.push(
    'custom-elements.json must use CEM schemaVersion 1.0.0 and contain modules',
  )
}

for (const module of manifest.modules ?? []) {
  if (
    typeof module.path !== 'string' ||
    module.path.startsWith('/') ||
    module.path.includes('\\') ||
    module.path.includes('..')
  ) {
    errors.push(`Manifest module path is not portable: ${String(module.path)}`)
    continue
  }

  const declarations = (module.declarations ?? []).filter(
    (declaration) => declaration.customElement,
  )

  for (const declaration of declarations) {
    const tagName = declaration.tagName
    const sourcePath = module.path
    const source = await readFile(
      new URL(`../${sourcePath}`, import.meta.url),
      'utf8',
    )

    if (
      typeof tagName !== 'string' ||
      !/^cad-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tagName)
    ) {
      errors.push(`${sourcePath}: invalid public tag name ${String(tagName)}`)
    }
    if (!declaration.description?.trim()) {
      errors.push(`${sourcePath}: ${tagName} needs a public description`)
    }

    const packageSubpath = `./${sourcePath.split('/src/')[1]?.split('/')[0] ?? ''}`
    if (!(packageSubpath in packageJson.exports)) {
      errors.push(
        `${sourcePath}: ${tagName} has no package export at ${packageSubpath}`,
      )
    }

    const renderedParts = new Set(
      [...source.matchAll(/\bpart=["']([^"']+)["']/g)].flatMap((match) =>
        match[1].split(/\s+/).filter(Boolean),
      ),
    )
    const declaredParts = new Set(
      (declaration.cssParts ?? []).map((part) => part.name),
    )
    compareSets('CSS parts', declaredParts, renderedParts, sourcePath)

    const renderedSlots = new Set(
      [...source.matchAll(/<slot(?:\s+name=["']([^"']+)["'])?/g)].map(
        (match) => match[1] ?? '',
      ),
    )
    const declaredSlots = new Set(
      (declaration.slots ?? []).map((slot) => slot.name ?? ''),
    )
    compareSets('slots', declaredSlots, renderedSlots, sourcePath)

    const annotatedProperties = new Set(
      [...source.matchAll(/@cssprop\s+(--cad-[\w-]+)/g)].map(
        (match) => match[1],
      ),
    )
    const declaredProperties = new Set(
      (declaration.cssProperties ?? []).map((property) => property.name),
    )
    compareSets(
      'CSS custom properties',
      declaredProperties,
      annotatedProperties,
      sourcePath,
    )
    for (const property of annotatedProperties) {
      if (!new RegExp(`var\\(\\s*${escapeRegExp(property)}\\b`).test(source)) {
        errors.push(
          `${sourcePath}: ${property} is documented but never consumed`,
        )
      }
    }

    const implementedEvents = new Map()
    for (const match of source.matchAll(
      /new (?:Custom)?Event(?:<[^>]+>)?\(['"]([^'"]+)['"]\s*,([\s\S]*?)\n\s*}\),/g,
    )) {
      implementedEvents.set(match[1], match[2])
    }
    const declaredEvents = new Set(
      (declaration.events ?? []).map((event) => event.name),
    )
    compareSets(
      'events',
      declaredEvents,
      new Set(implementedEvents.keys()),
      sourcePath,
    )
    for (const event of declaration.events ?? []) {
      if (!event.description?.trim()) {
        errors.push(`${sourcePath}: event ${event.name} needs a description`)
      }
      const options = implementedEvents.get(event.name)
      if (
        options &&
        (!/\bbubbles:\s*true\b/.test(options) ||
          !/\bcomposed:\s*true\b/.test(options))
      ) {
        errors.push(
          `${sourcePath}: public state event ${event.name} must bubble and be composed`,
        )
      }
    }

    const propertyBlock = source.match(
      /static override properties\s*=\s*{([\s\S]*?)\n\s*}/,
    )?.[1]
    for (const attribute of declaration.attributes ?? []) {
      if (
        !attribute.fieldName ||
        !propertyBlock?.includes(`${attribute.fieldName}:`)
      ) {
        errors.push(
          `${sourcePath}: attribute ${attribute.name} is not backed by a declared reactive property`,
        )
      }
    }

    for (const member of declaration.members ?? []) {
      if (member.privacy !== 'public' || member.kind !== 'field') continue
      if (!member.attribute) {
        errors.push(
          `${sourcePath}: public field ${member.name} has no attribute mapping`,
        )
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Public contract validation failed (${errors.length}):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  const count = manifest.modules.reduce(
    (total, module) =>
      total +
      (module.declarations ?? []).filter(
        (declaration) => declaration.customElement,
      ).length,
    0,
  )
  console.log(`Public contract valid for ${count} custom elements.`)
}
