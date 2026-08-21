import { execFileSync } from 'node:child_process'
import { readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))

const isVersionPullRequest =
  process.env.GITHUB_EVENT_NAME === 'pull_request' &&
  process.env.GITHUB_HEAD_REF?.startsWith('changeset-release/')

if (isVersionPullRequest) {
  console.log('Version pull request contains already-consumed Changesets.')
  process.exit(0)
}

function git(...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
}

const changed = new Set()
const baseBranch = process.env.GITHUB_BASE_REF

if (baseBranch) {
  for (const path of git(
    'diff',
    '--name-only',
    `origin/${baseBranch}...HEAD`,
  ).split('\n')) {
    if (path) changed.add(path)
  }
} else if (!process.env.GITHUB_ACTIONS) {
  for (const args of [
    ['diff', '--name-only'],
    ['diff', '--cached', '--name-only'],
    ['ls-files', '--others', '--exclude-standard'],
  ]) {
    for (const path of git(...args).split('\n')) {
      if (path) changed.add(path)
    }
  }
}

const affectsPublishedArtifact = (path) =>
  /^packages\/[^/]+\/(?:src\/|package\.json$|README\.md$|LICENSE$|custom-elements\.json$)/.test(
    path,
  ) &&
  !/(?:^|\/)(?:test|tests|__tests__)\//.test(path) &&
  !/\.(?:test|spec)\.[cm]?[jt]sx?$/.test(path)

const publicChanges = [...changed].filter(affectsPublishedArtifact).sort()
if (publicChanges.length === 0) {
  console.log('No published package artifacts changed; no Changeset required.')
  process.exit(0)
}

const changesets = (
  await readdir(new URL('../.changeset/', import.meta.url))
).filter((name) => name.endsWith('.md') && name !== 'README.md')

if (changesets.length === 0) {
  console.error('A Changeset is required for these published package changes:')
  for (const path of publicChanges) console.error(`- ${path}`)
  console.error(
    'Run `pnpm changeset`. Purely internal work should stay outside published src/ and package metadata.',
  )
  process.exitCode = 1
} else {
  console.log(
    `Changeset policy satisfied by ${changesets.length} file(s) for ${publicChanges.length} public change(s).`,
  )
}
