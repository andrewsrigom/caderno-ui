import { execFileSync } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dryRun = process.argv.includes('--dry-run')
const packageDirectories = ['astro', 'elements', 'icons', 'react', 'tokens']

function run(command, arguments_) {
  execFileSync(command, arguments_, { cwd: root, stdio: 'inherit' })
}

function isPublished(name, version) {
  try {
    const result = execFileSync(
      'npm',
      ['view', `${name}@${version}`, 'version', '--json'],
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    )
    return JSON.parse(result) === version
  } catch {
    return false
  }
}

run('pnpm', ['verify'])

const packsDirectory = path.join(root, '.artifacts/packs')
const packedFiles = (await readdir(packsDirectory))
  .filter((file) => file.endsWith('.tgz'))
  .sort()
const expected = []

for (const directory of packageDirectories) {
  const manifest = JSON.parse(
    await readFile(
      path.join(root, 'packages', directory, 'package.json'),
      'utf8',
    ),
  )
  const filename = `${manifest.name.replace('@', '').replace('/', '-')}-${manifest.version}.tgz`
  expected.push({ filename, name: manifest.name, version: manifest.version })
}

if (
  JSON.stringify(packedFiles) !==
  JSON.stringify(expected.map(({ filename }) => filename).sort())
) {
  throw new Error(
    'Release tarballs do not exactly match the public package set',
  )
}

// npm otherwise rejects a dry run when the fixture version already exists.
// --force is deliberately confined to this non-publishing preflight.
for (const { filename } of expected) {
  run('npm', [
    'publish',
    path.join(packsDirectory, filename),
    '--access',
    'public',
    '--dry-run',
    '--force',
    '--ignore-scripts',
  ])
}

if (dryRun) {
  console.log(`Release dry-run passed for ${expected.length} exact tarballs.`)
  process.exit(0)
}

if (process.env.CI !== 'true' || process.env.GITHUB_ACTIONS !== 'true') {
  throw new Error(
    'Publishing is restricted to the trusted GitHub Actions release workflow. Use pnpm release:dry-run locally.',
  )
}

for (const { filename, name, version } of expected) {
  if (isPublished(name, version)) {
    console.log(
      `Skipping ${name}@${version}; npm already contains this version.`,
    )
    continue
  }
  run('npm', [
    'publish',
    path.join(packsDirectory, filename),
    '--access',
    'public',
    '--ignore-scripts',
    '--provenance',
  ])
}

console.log(`Published ${expected.length} previously validated tarballs.`)
