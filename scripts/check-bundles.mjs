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

const entrypoints = {
  'elements-alert': './packages/elements/dist/alert/cad-alert.js',
  'elements-bookmark': './packages/elements/dist/bookmark/cad-bookmark.js',
  'elements-icon': './packages/elements/dist/icon/cad-icon.js',
  'elements-root': './packages/elements/dist/index.js',
  'elements-tabs': './packages/elements/dist/tabs/index.js',
  'icons-root': './packages/icons/dist/index.js',
  'react-alert': './packages/react/dist/alert.js',
  'react-bookmark': './packages/react/dist/bookmark.js',
  'react-icon': './packages/react/dist/icon.js',
  'react-root': './packages/react/dist/index.js',
  'react-tabs': './packages/react/dist/tabs.js',
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
  'react-alert': ['/react/dist/bookmark.', '/react/dist/tabs.'],
  'react-bookmark': ['/react/dist/alert.', '/react/dist/tabs.'],
  'react-icon': [
    '/react/dist/alert.',
    '/react/dist/bookmark.',
    '/react/dist/tabs.',
  ],
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
