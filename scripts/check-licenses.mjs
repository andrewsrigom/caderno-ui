import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const policy = JSON.parse(
  await readFile(path.join(root, 'config/license-policy.json'), 'utf8'),
)

function inventory(production) {
  const output = execFileSync(
    'pnpm',
    ['licenses', 'list', '--json', ...(production ? ['--prod'] : [])],
    { cwd: root, encoding: 'utf8' },
  )
  return JSON.parse(output)
}

function validate(scope, licenses, allowed) {
  const encountered = Object.keys(licenses).sort()
  const unexpected = encountered.filter((license) => !allowed.includes(license))
  if (unexpected.length > 0) {
    throw new Error(
      `${scope} dependencies introduced unreviewed licenses: ${unexpected.join(', ')}`,
    )
  }
  return {
    licenses: encountered,
    packages: Object.fromEntries(
      encountered.map((license) => [
        license,
        licenses[license]
          .map(({ name, versions }) => ({ name, versions }))
          .sort((left, right) => left.name.localeCompare(right.name)),
      ]),
    ),
  }
}

const report = {
  development: validate(
    'Development',
    inventory(false),
    policy.developmentAllowed,
  ),
  production: validate('Production', inventory(true), policy.productionAllowed),
}

await mkdir(path.join(root, '.artifacts'), { recursive: true })
await writeFile(
  path.join(root, '.artifacts/licenses.json'),
  `${JSON.stringify(report, null, 2)}\n`,
)
console.log(
  `License policy passed (${report.production.licenses.length} production and ${report.development.licenses.length} development license expressions).`,
)
