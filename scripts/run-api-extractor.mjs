import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const update = process.argv.includes('--update')
const packages = ['elements', 'icons', 'react']

for (const packageName of packages) {
  console.log(
    `${update ? 'Updating' : 'Checking'} ${packageName} API report...`,
  )
  execFileSync(
    'pnpm',
    [
      'exec',
      'api-extractor',
      'run',
      '--config',
      `packages/${packageName}/api-extractor.json`,
      ...(update ? ['--local'] : []),
    ],
    { cwd: root, stdio: 'inherit' },
  )
}
