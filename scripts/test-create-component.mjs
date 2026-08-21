import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { createComponent } from './create-component.mjs'

const temporaryRoot = await mkdtemp(
  path.join(os.tmpdir(), 'caderno-ui-generator-'),
)
const resolvedTemporaryRoot = path.resolve(temporaryRoot)
const temporaryBase = `${path.resolve(os.tmpdir())}${path.sep}`

if (
  !resolvedTemporaryRoot.startsWith(temporaryBase) ||
  !path.basename(resolvedTemporaryRoot).startsWith('caderno-ui-generator-')
) {
  throw new Error(
    `Refusing to use unexpected temporary path: ${resolvedTemporaryRoot}`,
  )
}

try {
  const files = {
    'config/components.json': '{"entries":[]}',
    'packages/astro/package.json': '{"exports":{}}',
    'packages/elements/package.json': '{"exports":{}}',
    'packages/elements/src/index.ts': '',
    'packages/react/package.json': '{"exports":{}}',
    'packages/react/src/index.ts': '',
  }
  for (const [relative, source] of Object.entries(files)) {
    const destination = path.join(temporaryRoot, relative)
    await mkdir(path.dirname(destination), { recursive: true })
    await writeFile(destination, source)
  }

  const preview = await createComponent({
    dryRun: true,
    name: 'sticky-note',
    workspaceRoot: temporaryRoot,
  })
  assert.equal(preview.className, 'CadStickyNote')
  assert.equal(preview.tagName, 'cad-sticky-note')
  assert.equal(preview.files.length, 5)

  await createComponent({ name: 'sticky-note', workspaceRoot: temporaryRoot })
  const element = await readFile(
    path.join(
      temporaryRoot,
      'packages/elements/src/sticky-note/cad-sticky-note.ts',
    ),
    'utf8',
  )
  assert.match(element, /customElements\.define\('cad-sticky-note'/)

  const inventory = JSON.parse(
    await readFile(path.join(temporaryRoot, 'config/components.json'), 'utf8'),
  )
  assert.equal(inventory.entries[0].name, 'sticky-note')

  await assert.rejects(
    createComponent({ name: 'sticky-note', workspaceRoot: temporaryRoot }),
    /Refusing to overwrite/,
  )
  await assert.rejects(
    createComponent({ name: 'cad-invalid', workspaceRoot: temporaryRoot }),
    /without the cad- prefix/,
  )

  console.log(
    'Component generator passed dry-run, scaffold, and overwrite checks.',
  )
} finally {
  await rm(resolvedTemporaryRoot, { force: true, recursive: true })
}
