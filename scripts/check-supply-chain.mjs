import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const lifecycleNames = ['install', 'postinstall', 'preinstall', 'prepare']
const rootPackage = JSON.parse(
  await readFile(path.join(root, 'package.json'), 'utf8'),
)
const allowlist = JSON.parse(
  await readFile(
    path.join(root, 'config/install-script-allowlist.json'),
    'utf8',
  ),
).packages

if (!/^pnpm@\d+\.\d+\.\d+$/.test(rootPackage.packageManager ?? '')) {
  errors.push('packageManager must pin an exact pnpm version')
}
if (rootPackage.engines?.node !== '>=20') {
  errors.push('The root Node.js support floor must remain explicit')
}

const configuredBuildDependencies = [
  ...(rootPackage.pnpm?.onlyBuiltDependencies ?? []),
].sort()
if (
  JSON.stringify(configuredBuildDependencies) !==
  JSON.stringify([...allowlist].sort())
) {
  errors.push(
    'pnpm.onlyBuiltDependencies differs from config/install-script-allowlist.json',
  )
}

for (const workspaceDirectory of ['apps', 'packages']) {
  const entries = await readdir(path.join(root, workspaceDirectory), {
    withFileTypes: true,
  })
  for (const entry of entries.filter((candidate) => candidate.isDirectory())) {
    const manifestPath = path.join(
      root,
      workspaceDirectory,
      entry.name,
      'package.json',
    )
    const manifestSource = await readFile(manifestPath, 'utf8').catch(
      () => null,
    )
    if (manifestSource === null) continue
    const manifest = JSON.parse(manifestSource)
    for (const lifecycle of lifecycleNames) {
      if (manifest.scripts?.[lifecycle]) {
        errors.push(
          `${manifest.name} declares forbidden lifecycle script ${lifecycle}`,
        )
      }
    }
  }
}

const workflowDirectory = path.join(root, '.github/workflows')
for (const entry of await readdir(workflowDirectory)) {
  if (!entry.endsWith('.yml') && !entry.endsWith('.yaml')) continue
  const source = await readFile(path.join(workflowDirectory, entry), 'utf8')
  for (const match of source.matchAll(/uses:\s*([^@\s]+)@([^\s#]+)/g)) {
    const [, action, reference] = match
    if (action.startsWith('./')) continue
    if (!/^[\da-f]{40}$/.test(reference)) {
      errors.push(
        `${entry}: ${action}@${reference} is not pinned to a commit SHA`,
      )
    }
  }
}

if (errors.length > 0) {
  console.error(`Supply-chain policy failed (${errors.length}):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(
    `Supply-chain policy passed (${allowlist.length} reviewed install-script dependencies).`,
  )
}
