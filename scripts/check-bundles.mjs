import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { gzipSync } from 'node:zlib'

import { build } from 'esbuild'

const root = fileURLToPath(new URL('../', import.meta.url))
const update = process.argv.includes('--update')
const budgetPath = join(root, 'config/bundle-budgets.json')
const baselinePath = join(root, 'docs/baseline/bundles.json')
const reportPath = join(root, '.artifacts/bundle-report.json')
const errors = []

const elementsPackage = JSON.parse(
  await readFile(join(root, 'packages/elements/package.json'), 'utf8'),
)
const reactPackage = JSON.parse(
  await readFile(join(root, 'packages/react/package.json'), 'utf8'),
)
const motionPackage = JSON.parse(
  await readFile(join(root, 'packages/motion/package.json'), 'utf8'),
)

function publicEntrypoints(packageJson, packageDirectory, prefix) {
  return Object.fromEntries(
    Object.entries(packageJson.exports).flatMap(([key, value]) => {
      if (key === '.' || typeof value !== 'object' || !value.import) return []
      const name = key.slice(2)
      return [
        [
          `${prefix}-${name}`,
          `./packages/${packageDirectory}/${value.import.slice(2)}`,
        ],
      ]
    }),
  )
}

const entrypoints = {
  ...publicEntrypoints(elementsPackage, 'elements', 'elements'),
  ...publicEntrypoints(motionPackage, 'motion', 'motion'),
  ...publicEntrypoints(reactPackage, 'react', 'react'),
  'elements-root': './packages/elements/dist/index.js',
  'icons-root': './packages/icons/dist/index.js',
  'motion-root': './packages/motion/dist/index.js',
  'react-root': './packages/react/dist/index.js',
}

const isolationRules = {
  'elements-alert': [
    '/bookmark/cad-bookmark.',
    '/tabs/cad-tab.',
    '/tabs/cad-tabs.',
  ],
  'elements-bookmark': [
    '/alert/cad-alert.',
    '/tabs/cad-tab.',
    '/tabs/cad-tabs.',
  ],
  'elements-root': ['/chart/cad-chart.', '/roughjs/'],
  'motion-root': ['/ScrollTrigger.'],
  'react-alert': ['/react/dist/bookmark.', '/react/dist/tabs.'],
  'react-bookmark': ['/react/dist/alert.', '/react/dist/tabs.'],
  'react-icon': [
    '/react/dist/alert.',
    '/react/dist/bookmark.',
    '/react/dist/tabs.',
  ],
  'react-root': ['/react/dist/chart.', '/roughjs/'],
}

for (const name of Object.keys(entrypoints)) {
  if (
    name.startsWith('elements-') &&
    !['elements-icon', 'elements-root'].includes(name)
  ) {
    isolationRules[name] = [
      ...(isolationRules[name] ?? []),
      '/elements/dist/icon/cad-icon.',
      '/packages/icons/dist/',
    ]
  }
  if (
    name.startsWith('react-') &&
    !['react-icon', 'react-root'].includes(name)
  ) {
    isolationRules[name] = [
      ...(isolationRules[name] ?? []),
      '/elements/dist/icon/cad-icon.',
      '/packages/icons/dist/',
    ]
  }
  if (!['elements-chart', 'react-chart'].includes(name)) {
    isolationRules[name] = [...(isolationRules[name] ?? []), '/roughjs/']
  }
}

const report = {}
for (const [name, specifier] of Object.entries(entrypoints)) {
  const result = await build({
    bundle: true,
    external: ['react'],
    format: 'esm',
    logLevel: 'silent',
    metafile: true,
    minify: true,
    platform: 'browser',
    stdin: {
      contents: `export * from ${JSON.stringify(specifier)}`,
      resolveDir: root,
      sourcefile: `${name}.js`,
    },
    write: false,
  })
  const contents = result.outputFiles[0].contents
  const inputs = Object.keys(result.metafile.inputs).map((path) =>
    path.replaceAll('\\', '/'),
  )
  report[name] = {
    bytes: contents.byteLength,
    gzip: gzipSync(contents).byteLength,
    inputs,
  }

  for (const forbidden of isolationRules[name] ?? []) {
    if (inputs.some((input) => input.includes(forbidden))) {
      errors.push(`${name} unexpectedly includes ${forbidden}`)
    }
  }
}

const { cadIcons } = await import(
  pathToFileURL(join(root, 'packages/icons/dist/index.js')).href
)
const iconCount = Object.keys(cadIcons).length

if (update) {
  const budgets = {
    entrypoints: Object.fromEntries(
      Object.entries(report).map(([name, result]) => [
        name,
        { maxGzip: Math.ceil(result.gzip * 1.15 + 100) },
      ]),
    ),
    icons: { maxNames: Math.max(64, iconCount) },
  }
  const baseline = {
    entrypoints: Object.fromEntries(
      Object.entries(report).map(([name, result]) => [
        name,
        { bytes: result.bytes, gzip: result.gzip },
      ]),
    ),
    icons: { names: iconCount },
  }
  await mkdir(dirname(budgetPath), { recursive: true })
  await mkdir(dirname(baselinePath), { recursive: true })
  await writeFile(budgetPath, `${JSON.stringify(budgets, null, 2)}\n`)
  await writeFile(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`)
  console.log('Updated bundle baseline and budgets.')
} else {
  const budgets = JSON.parse(await readFile(budgetPath, 'utf8'))
  for (const [name, result] of Object.entries(report)) {
    const maximum = budgets.entrypoints[name]?.maxGzip
    if (typeof maximum !== 'number') {
      errors.push(`${name} has no gzip budget`)
    } else if (result.gzip > maximum) {
      errors.push(`${name} is ${result.gzip} B gzip; budget is ${maximum} B`)
    }
  }
  if (iconCount > budgets.icons.maxNames) {
    errors.push(
      `Icon registry contains ${iconCount} names; approved maximum is ${budgets.icons.maxNames}`,
    )
  }
}

await mkdir(dirname(reportPath), { recursive: true })
await writeFile(
  reportPath,
  `${JSON.stringify({ entrypoints: report, icons: { names: iconCount } }, null, 2)}\n`,
)

if (errors.length > 0) {
  console.error(`Bundle validation failed (${errors.length}):`)
  for (const error of errors) console.error(`- ${error}`)
  console.error(`Detailed report: ${reportPath}`)
  process.exitCode = 1
} else {
  console.log(
    `Bundle budgets passed for ${Object.keys(entrypoints).length} entrypoints.`,
  )
}
