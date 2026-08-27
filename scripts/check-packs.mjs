import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, posix } from 'node:path'
import { fileURLToPath } from 'node:url'

import { t, x } from 'tar'

const root = fileURLToPath(new URL('../', import.meta.url))
const artifacts = join(root, '.artifacts')
const packsDirectory = join(artifacts, 'packs')
const baselinePath = join(root, 'docs/baseline/tarballs.json')
const update = process.argv.includes('--update')
const packageDirectories = [
  'astro',
  'elements',
  'icons',
  'motion',
  'react',
  'tokens',
]
const typedPackages = new Set(['elements', 'icons', 'motion', 'react'])
const errors = []
const baseline = {}

const run = (command, args, options = {}) =>
  execFileSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit',
    ...options,
  })

const exportedTargets = (exports) => {
  if (typeof exports === 'string') return [exports]
  if (!exports || typeof exports !== 'object') return []
  return Object.values(exports).flatMap(exportedTargets)
}

await rm(packsDirectory, { force: true, recursive: true })
await mkdir(packsDirectory, { recursive: true })

for (const packageDirectory of packageDirectories) {
  const directory = join(root, 'packages', packageDirectory)
  const packed = JSON.parse(
    run('pnpm', ['pack', '--json', '--pack-destination', packsDirectory], {
      capture: true,
      cwd: directory,
    }),
  )
  const tarball = packed.filename
  const files = new Set()

  await t({
    file: tarball,
    onentry: (entry) => files.add(entry.path),
  })

  for (const required of [
    'package/package.json',
    'package/README.md',
    'package/LICENSE',
  ]) {
    if (!files.has(required)) {
      errors.push(`${packed.name}: tarball is missing ${required.slice(8)}`)
    }
  }

  if (
    packageDirectory === 'elements' &&
    !files.has('package/custom-elements.json')
  ) {
    errors.push(`${packed.name}: tarball is missing custom-elements.json`)
  }

  const extractionDirectory = await mkdtemp(join(artifacts, 'pack-inspect-'))
  try {
    await x({ cwd: extractionDirectory, file: tarball })
    const packageJson = JSON.parse(
      await readFile(join(extractionDirectory, 'package/package.json'), 'utf8'),
    )
    const serializedPackage = JSON.stringify(packageJson)
    if (serializedPackage.includes('workspace:')) {
      errors.push(
        `${packed.name}: package.json still contains a workspace: protocol`,
      )
    }

    for (const target of exportedTargets(packageJson.exports)) {
      const archivePath = `package/${target.replace(/^\.\//, '')}`
      if (!files.has(archivePath)) {
        errors.push(`${packed.name}: export target does not exist: ${target}`)
      }
      if (
        packageDirectory === 'react' &&
        target.endsWith('.js') &&
        !target.endsWith('/index.js') &&
        files.has(archivePath)
      ) {
        const source = await readFile(
          join(extractionDirectory, archivePath),
          'utf8',
        )
        if (!/^['"]use client['"];?/.test(source.trimStart()))
          errors.push(`${packed.name}: ${target} lost its client boundary`)
      }
    }

    for (const mapPath of [...files].filter((path) => path.endsWith('.map'))) {
      const sourceMap = JSON.parse(
        await readFile(join(extractionDirectory, mapPath), 'utf8'),
      )
      for (const source of sourceMap.sources ?? []) {
        if (/^(?:[a-z]+:|\/)/i.test(source)) continue
        const resolvedSource = posix.normalize(
          posix.join(posix.dirname(mapPath), source),
        )
        if (!files.has(resolvedSource)) {
          errors.push(
            `${packed.name}: ${mapPath.slice(8)} points to absent source ${source}`,
          )
        }
      }
    }
  } finally {
    await rm(extractionDirectory, { force: true, recursive: true })
  }

  try {
    run('pnpm', ['exec', 'publint', tarball, '--strict'])
  } catch {
    errors.push(`${packed.name}: publint rejected the packed tarball`)
  }

  if (typedPackages.has(packageDirectory)) {
    try {
      run('pnpm', [
        'exec',
        'attw',
        tarball,
        '--profile',
        'esm-only',
        '--no-emoji',
        '--no-color',
        ...(packageDirectory === 'elements'
          ? [
              '--exclude-entrypoints',
              './fallback.css',
              './navigation.css',
              './prose.css',
              './scrollbar.css',
              './typography.css',
            ]
          : []),
      ])
    } catch {
      errors.push(
        `${packed.name}: Are the Types Wrong rejected the packed tarball`,
      )
    }
  }

  baseline[packed.name] = [...files]
    .map((path) => path.replace(/^package\//, ''))
    .sort()
}

if (update) {
  await mkdir(dirname(baselinePath), { recursive: true })
  await writeFile(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`)
  console.log(`Updated tarball baseline at ${baselinePath}`)
} else {
  try {
    const expected = JSON.parse(await readFile(baselinePath, 'utf8'))
    if (JSON.stringify(baseline) !== JSON.stringify(expected)) {
      errors.push(
        'Tarball contents differ from docs/baseline/tarballs.json; inspect and run `pnpm pack:baseline` for an intentional change.',
      )
    }
  } catch (error) {
    errors.push(`Unable to read tarball baseline: ${error.message}`)
  }
}

if (errors.length > 0) {
  console.error(`Tarball validation failed (${errors.length}):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Validated ${packageDirectories.length} packed packages.`)
}
