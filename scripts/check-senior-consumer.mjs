import { execFileSync } from 'node:child_process'
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  stat,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
if (!process.argv[2])
  throw new Error(
    'Pass the SeniorPath checkout path. Only an isolated copy is built and tested.',
  )
const source = resolve(process.argv[2])
const candidate = await mkdtemp(join(tmpdir(), 'caderno-senior-consumer-'))
const tracked = execFileSync(
  'git',
  ['ls-files', '-co', '--exclude-standard', '-z'],
  { cwd: source, encoding: 'utf8' },
)
  .split('\0')
  .filter(Boolean)
for (const relative of new Set(tracked)) {
  const from = join(source, relative)
  if (!(await stat(from).catch(() => null))?.isFile()) continue
  const to = join(candidate, relative)
  await mkdir(dirname(to), { recursive: true })
  await copyFile(from, to)
}
const workspacePath = join(candidate, 'pnpm-workspace.yaml')
let workspace = (await readFile(workspacePath, 'utf8')).replace(
  /^\s+['"]?@caderno-ui\/[^\n]+\n/gm,
  '',
)
if (!/^overrides:/m.test(workspace)) workspace += '\noverrides:\n'
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
  workspace += `  '@caderno-ui/${name}': file:${join(root, '.artifacts/packs', `caderno-ui-${name}-${manifest.version}.tgz`)}\n`
}
await writeFile(workspacePath, workspace)
// Existing fixture generator already owns temporary content. Give this copy its own port too.
for (const relative of [
  'apps/site/playwright.config.ts',
  'apps/site/scripts/run-e2e-dev-server.mjs',
]) {
  const file = join(candidate, relative)
  await writeFile(
    file,
    (await readFile(file, 'utf8')).replaceAll('4173', '5196'),
  )
}
const env = {
  ...process.env,
  SITE_CONTENT_DIR: join(candidate, 'examples/starter-content'),
  SITE_SYNCED_CONTENT_DIR: join(candidate, 'synced-content'),
  PLAYWRIGHT_REUSE_SERVER: '0',
}
const run = (args) =>
  execFileSync('pnpm', args, { cwd: candidate, env, stdio: 'inherit' })
console.log(`SeniorPath candidate: ${candidate}`)
run(['install', '--no-frozen-lockfile', '--prefer-offline'])
run(['style:guard'])
// This is the library acceptance slice. Editorial-routing tests require the
// product's private catalogs and are not evidence for the package integration.
run([
  '--filter',
  '@template/site',
  'exec',
  'vitest',
  'run',
  'src/lib/notebook-guide-integration.test.ts',
  'src/lib/rehype-caderno-guide.test.ts',
])
run(['typecheck:site'])
run(['build:site'])
run([
  '--filter',
  '@template/site',
  'exec',
  'playwright',
  'test',
  'e2e/caderno-ui.spec.ts',
  'e2e/accessibility-flows.spec.ts',
  '--timeout=60000',
])
console.log(
  'SeniorPath candidate passed. The developer checkout and content were not changed.',
)
