import { execFileSync, spawn } from 'node:child_process'
import { cp, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { verifyFrameworks } from '../tests/frameworks/verify.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const versions = JSON.parse(
  await readFile(join(root, 'config/framework-versions.json'), 'utf8'),
)
const react = process.env.REACT_VERSION ?? versions.react
const reactMajor = react.split('.')[0]
if (!['18', '19'].includes(reactMajor))
  throw new Error('Only the declared React 18/19 matrix is supported.')
// A real external installation: no workspace discovery, aliases or source links.
const artifact = await mkdtemp(
  join(tmpdir(), `caderno-framework-react${reactMajor}-`),
)
const evidence = join(
  root,
  '.artifacts',
  `framework-react${reactMajor}`,
  'evidence',
)
console.log(`Isolated consumer: ${artifact}`)
const run = (args, cwd = artifact, env = {}) =>
  execFileSync('pnpm', args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1', ...env },
  })
const deps = {}
for (const name of [
  'astro',
  'elements',
  'icons',
  'motion',
  'react',
  'tokens',
]) {
  const manifest = JSON.parse(
    await readFile(join(root, 'packages', name, 'package.json'), 'utf8'),
  )
  deps[manifest.name] =
    `file:${join(root, '.artifacts/packs', `caderno-ui-${name}-${manifest.version}.tgz`)}`
}

await mkdir(evidence, { recursive: true })
await cp(join(root, 'fixtures/frameworks'), artifact, { recursive: true })
const dependencies = {
  ...deps,
  react,
  'react-dom': react,
  'react-router': '7.18.2',
  '@types/react': reactMajor === '18' ? '^18.3.0' : '^19.2.0',
  '@types/react-dom': reactMajor === '18' ? '^18.3.0' : '^19.2.0',
  '@types/node': '^24.0.0',
  typescript: '^6.0.3',
  vite: versions.vite,
  vue: versions.vue,
  svelte: versions.svelte,
  '@vitejs/plugin-vue': versions.vuePlugin,
  '@sveltejs/vite-plugin-svelte': versions.sveltePlugin,
}
if (reactMajor === '19')
  Object.assign(dependencies, {
    next: versions.next,
    '@fontsource/caveat': '^5.3.0',
  })
await writeFile(
  join(artifact, 'package.json'),
  JSON.stringify(
    {
      name: 'caderno-packed-frameworks',
      private: true,
      type: 'module',
      dependencies,
      pnpm: { overrides: deps, onlyBuiltDependencies: ['esbuild', 'sharp'] },
    },
    null,
    2,
  ),
)
run([
  'install',
  '--ignore-workspace',
  '--no-frozen-lockfile',
  '--prefer-offline',
])
run(['exec', 'vite', 'build'])
run(['exec', 'tsc', '--project', 'tsconfig.json'])

if (reactMajor === '19') {
  await cp(join(root, 'apps/notes'), join(artifact, 'next'), {
    recursive: true,
    filter: (source) =>
      ![
        'node_modules',
        '.next',
        'out',
        'package.json',
        'next-env.d.ts',
        'tsconfig.tsbuildinfo',
      ].includes(basename(source)),
  })
  await cp(join(artifact, 'next'), join(artifact, 'next-static'), {
    recursive: true,
  })
  run(['exec', 'next', 'build', 'next-static'], artifact, {
    CADERNO_NOTES_SERVER: '0',
    CADERNO_NOTES_BASE_PATH: '/caderno-ui/examples/react',
  })
  await cp(
    join(root, 'fixtures/frameworks/server-check'),
    join(artifact, 'next/app/server-check'),
    { recursive: true },
  )
  run(['exec', 'next', 'build', 'next'], artifact, {
    CADERNO_NOTES_SERVER: '1',
  })
}

const children = []
function start(args, cwd, env = {}) {
  const child = spawn('pnpm', args, {
    cwd,
    stdio: 'inherit',
    detached: process.platform !== 'win32',
    env: { ...process.env, ...env },
  })
  children.push(child)
  return child
}
async function ready(url, child) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null)
      throw new Error(`Fixture server exited: ${url}`)
    try {
      if ((await fetch(url)).ok) return
    } catch {
      /* starting */
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error(`Fixture server did not start: ${url}`)
}
try {
  const vite = start(
    [
      'exec',
      'vite',
      'preview',
      '--host',
      '127.0.0.1',
      '--port',
      '5192',
      '--strictPort',
    ],
    artifact,
  )
  await ready('http://127.0.0.1:5192/react/', vite)
  if (reactMajor === '19') {
    const next = start(
      [
        'exec',
        'next',
        'start',
        'next',
        '--hostname',
        '127.0.0.1',
        '--port',
        '5193',
      ],
      artifact,
      { CADERNO_NOTES_SERVER: '1' },
    )
    await ready('http://127.0.0.1:5193/', next)
    const staticSite = start(
      [
        'exec',
        'vite',
        'preview',
        '--host',
        '127.0.0.1',
        '--port',
        '5194',
        '--strictPort',
        '--outDir',
        'next-static/out',
        '--base',
        '/caderno-ui/examples/react/',
      ],
      artifact,
    )
    await ready('http://127.0.0.1:5194/caderno-ui/examples/react/', staticSite)
  }
  await verifyFrameworks({ evidence, next: reactMajor === '19' })
} finally {
  for (const child of children) {
    if (child.exitCode !== null) continue
    try {
      if (process.platform !== 'win32') process.kill(-child.pid, 'SIGTERM')
      else child.kill('SIGTERM')
    } catch {
      /* already stopped */
    }
  }
}
console.log(`Packed framework interactions passed with React ${react}.`)
