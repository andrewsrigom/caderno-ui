import { execFileSync } from 'node:child_process'
import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const fixtures = join(root, 'fixtures/consumers')
const packsDirectory = join(root, '.artifacts/packs')
const reactVersion = process.env.REACT_VERSION ?? '19.2.8'
const astroVersion = process.env.ASTRO_VERSION ?? '7.2.4'
const nodeMajor = process.versions.node.split('.')[0]
const reactMajor = reactVersion.split('.')[0]
const artifact = join(
  root,
  '.artifacts',
  `consumer-node${nodeMajor}-react${reactMajor}-astro${astroVersion.split('.')[0]}`,
)

const run = (command, args) =>
  execFileSync(command, args, { cwd: artifact, stdio: 'inherit' })

const packedFiles = await readdir(packsDirectory)
const packageTarball = (name) => {
  const filename = packedFiles.find((file) =>
    file.startsWith(`caderno-ui-${name}-`),
  )
  if (!filename)
    throw new Error(`Missing packed tarball for @caderno-ui/${name}`)
  return `file:${join(packsDirectory, filename)}`
}

const packedDependencies = Object.fromEntries(
  ['astro', 'elements', 'icons', 'react', 'tokens'].map((name) => [
    `@caderno-ui/${name}`,
    packageTarball(name),
  ]),
)

await rm(artifact, { force: true, recursive: true })
await mkdir(artifact, { recursive: true })
for (const directory of ['astro', 'node', 'react', 'typescript', 'vite']) {
  await cp(join(fixtures, directory), join(artifact, directory), {
    recursive: true,
  })
}

const packageJson = {
  name: 'caderno-ui-packed-consumer',
  private: true,
  type: 'module',
  dependencies: {
    ...packedDependencies,
    '@types/react': reactMajor === '18' ? '^18.3.0' : '^19.2.0',
    '@types/react-dom': reactMajor === '18' ? '^18.3.0' : '^19.2.0',
    astro: astroVersion,
    react: reactVersion,
    'react-dom': reactVersion,
    typescript: astroVersion.startsWith('5.') ? '^5.9.3' : '^6.0.3',
    vite: '^8.2.2',
  },
  pnpm: {
    overrides: packedDependencies,
  },
}
await writeFile(
  join(artifact, 'package.json'),
  `${JSON.stringify(packageJson, null, 2)}\n`,
)

run('pnpm', [
  'install',
  '--ignore-workspace',
  '--no-frozen-lockfile',
  '--prefer-offline',
])
run('pnpm', ['exec', 'vite', 'build', '--config', 'vite/vite.config.mjs'])
run('node', ['react/ssr.mjs'])
run('pnpm', ['exec', 'astro', 'build', '--root', 'astro'])
run('pnpm', ['exec', 'tsc', '-p', 'typescript/tsconfig.bundler.json'])
run('pnpm', ['exec', 'tsc', '-p', 'typescript/tsconfig.nodenext.json'])
run('node', ['node/imports.mjs'])

console.log(
  `Packed consumers passed on Node ${process.versions.node}, React ${reactVersion}, and Astro ${astroVersion}.`,
)
