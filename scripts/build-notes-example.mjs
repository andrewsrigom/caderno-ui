import { execFileSync } from 'node:child_process'
import { cp, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
const root = fileURLToPath(new URL('../', import.meta.url))
execFileSync('pnpm', ['--filter', '@caderno-ui/react', 'build'], {
  cwd: root,
  stdio: 'inherit',
})
execFileSync('pnpm', ['--filter', '@caderno-ui/notes-example', 'build'], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    CADERNO_NOTES_SERVER: '0',
    CADERNO_NOTES_BASE_PATH: '/caderno-ui/examples/react',
  },
})
const destination = join(root, 'apps/docs/dist/examples/react')
await mkdir(destination, { recursive: true })
await cp(join(root, 'apps/notes/out'), destination, { recursive: true })
console.log('Static Next.js example included in the documentation artifact.')
