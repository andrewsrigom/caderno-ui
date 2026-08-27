import { cp, mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { preview } from 'astro'

// Own the output, port and lifecycle. The CLI's project-wide preview lock must
// never require stopping or replacing a developer's preview.
const root = await mkdtemp(join(tmpdir(), 'caderno-docs-preview-'))
await cp(new URL('../dist/', import.meta.url), join(root, 'dist'), {
  recursive: true,
})
const server = await preview({
  root,
  configFile: false,
  base: '/caderno-ui/',
  output: 'static',
  trailingSlash: 'always',
  server: { host: '127.0.0.1', port: 5187, open: false },
})
if (server.port !== 5187) {
  await server.stop()
  throw new Error('The isolated documentation port 5187 is already in use.')
}
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await server.stop()
    process.exit(0)
  })
}
