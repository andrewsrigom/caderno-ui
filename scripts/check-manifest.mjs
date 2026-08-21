import { execFileSync } from 'node:child_process'
import { mkdir, readFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const artifactRoot = path.join(root, '.artifacts')
const outputDirectory = path.join(artifactRoot, 'manifest')
const generatedManifest = path.join(outputDirectory, 'custom-elements.json')
const committedManifest = path.join(
  root,
  'packages/elements/custom-elements.json',
)

if (
  !outputDirectory.startsWith(`${artifactRoot}${path.sep}`) ||
  path.basename(outputDirectory) !== 'manifest'
) {
  throw new Error(`Refusing to replace unexpected path: ${outputDirectory}`)
}

await rm(outputDirectory, { force: true, recursive: true })
await mkdir(outputDirectory, { recursive: true })
execFileSync(
  'pnpm',
  [
    'exec',
    'cem',
    'analyze',
    '--litelement',
    '--globs',
    'packages/elements/src/**/*.ts',
    '--outdir',
    path.relative(root, outputDirectory),
  ],
  { cwd: root, stdio: 'inherit' },
)
execFileSync('node', ['scripts/normalize-manifest.mjs', generatedManifest], {
  cwd: root,
  stdio: 'inherit',
})

const [generated, committed] = await Promise.all([
  readFile(generatedManifest, 'utf8'),
  readFile(committedManifest, 'utf8'),
])

if (generated !== committed) {
  console.error(
    'Custom Elements Manifest is stale. Run `pnpm manifest`, review the public contract, and commit the result.',
  )
  process.exitCode = 1
} else {
  console.log('Custom Elements Manifest matches source.')
}
