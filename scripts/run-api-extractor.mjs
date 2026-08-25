import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const update = process.argv.includes('--update')
const reports = [
  { config: 'packages/elements/api-extractor.json', label: 'elements' },
  {
    config: 'packages/elements/api-extractor.chart.json',
    label: 'elements chart',
  },
  { config: 'packages/icons/api-extractor.json', label: 'icons' },
  { config: 'packages/motion/api-extractor.json', label: 'motion' },
  {
    config: 'packages/motion/api-extractor.scroll.json',
    label: 'motion scroll',
  },
  { config: 'packages/react/api-extractor.json', label: 'react' },
  {
    config: 'packages/react/api-extractor.chart.json',
    label: 'react chart',
  },
]

for (const report of reports) {
  console.log(
    `${update ? 'Updating' : 'Checking'} ${report.label} API report...`,
  )
  execFileSync(
    'pnpm',
    [
      'exec',
      'api-extractor',
      'run',
      '--config',
      report.config,
      ...(update ? ['--local'] : []),
    ],
    { cwd: root, stdio: 'inherit' },
  )
}
