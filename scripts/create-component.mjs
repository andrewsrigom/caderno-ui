import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const defaultRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

function pascalCase(name) {
  return name
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')
}

function assertName(name) {
  if (
    !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name) ||
    name.startsWith('cad-')
  ) {
    throw new Error(
      'Use a lowercase kebab-case name without the cad- prefix (for example: sticky-note).',
    )
  }
}

function elementSource(name, className, tagName) {
  return `import { css, html, LitElement } from 'lit'

/**
 * Describe the component's purpose and interaction contract.
 *
 * @slot - Component content.
 * @csspart base - Component container.
 */
export class ${className} extends LitElement {
  static override styles = css\`
    :host {
      display: block;
    }

    .base {
      color: var(--cad-ink, currentColor);
      background: var(--cad-surface, transparent);
    }
  \`

  override render() {
    return html\`<div class="base" part="base"><slot></slot></div>\`
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('${tagName}')) {
  customElements.define('${tagName}', ${className})
}

declare global {
  interface HTMLElementTagNameMap {
    '${tagName}': ${className}
  }
}
`
}

function testSource(name, tagName) {
  return `import { afterEach, describe, expect, it } from 'vitest'

import '../src/${name}/cad-${name}.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('${tagName}', () => {
  it('registers individually and renders its public part and slot', async () => {
    expectRegistered('${tagName}')
    const element = document.createElement('${tagName}')
    element.textContent = 'Content'
    document.body.append(element)
    await element.updateComplete

    expect(element.shadowRoot?.querySelector('[part="base"]')).not.toBeNull()
    expect(element.shadowRoot?.querySelector('slot')).not.toBeNull()
  })
})
`
}

function reactSource(name, className, tagName) {
  return `import { ${className} as ${className}Element } from '@caderno-ui/elements/${name}'
import { createComponent } from '@lit/react'
import React from 'react'

export const ${className} = createComponent({
  displayName: '${className}',
  elementClass: ${className}Element,
  react: React,
  tagName: '${tagName}',
})
`
}

function astroSource(name, tagName) {
  return `---
import '@caderno-ui/elements/fallback.css'

type Props = {
  class?: string
}

const { class: className } = Astro.props
---

<${tagName} class={className}><slot /></${tagName}>

<script>
  import '@caderno-ui/elements/${name}'
</script>
`
}

function docsSource(name, className, tagName) {
  return `---
import ApiReference from '../../components/ApiReference.astro'
import CodeBlock from '../../components/CodeBlock.astro'
import DemoFrame from '../../components/DemoFrame.astro'
import DocsLayout from '../../layouts/DocsLayout.astro'

const usage = \`<${tagName}>Content</${tagName}>

<script type="module">
  import '@caderno-ui/elements/${name}'
</script>\`
---

<DocsLayout description="Document ${className}." title="${className.slice(3)}">
  <header class="page-header">
    <p class="eyebrow">&lt;${tagName}&gt;</p>
    <h1>Replace with the component promise.</h1>
    <p>Explain when to use this component and when not to use it.</p>
  </header>

  <DemoFrame title="${className.slice(3)}">
    <${tagName}>Content</${tagName}>
  </DemoFrame>
  <CodeBlock code={usage} language="html" />

  <ApiReference tagName="${tagName}" />

  <section class="content-section" aria-labelledby="accessibility-title">
    <h2 id="accessibility-title">Accessibility</h2>
    <p>Document semantics, naming, keyboard behavior, and known constraints.</p>
  </section>
</DocsLayout>
`
}

function appendExport(source, exportLine) {
  const normalized = source.endsWith('\n') ? source : `${source}\n`
  return normalized.includes(exportLine)
    ? normalized
    : `${normalized}${exportLine}\n`
}

function withExport(packageJson, key, value) {
  return {
    ...packageJson,
    exports: {
      ...packageJson.exports,
      [key]: value,
    },
  }
}

async function exists(file) {
  return access(file).then(
    () => true,
    () => false,
  )
}

export async function createComponent({
  dryRun = false,
  name,
  workspaceRoot = defaultRoot,
}) {
  assertName(name)
  const className = `Cad${pascalCase(name)}`
  const tagName = `cad-${name}`
  const facade = `${className.slice(3)}.astro`
  const relativeFiles = [
    `packages/elements/src/${name}/cad-${name}.ts`,
    `packages/elements/test/${name}.test.ts`,
    `packages/react/src/${name}.ts`,
    `packages/astro/src/${facade}`,
    `apps/docs/src/pages/components/${name}.astro`,
  ]

  if (dryRun) return { className, files: relativeFiles, name, tagName }

  const conflicts = []
  for (const file of relativeFiles) {
    if (await exists(path.join(workspaceRoot, file))) conflicts.push(file)
  }
  if (conflicts.length > 0) {
    throw new Error(
      `Refusing to overwrite existing files:\n${conflicts.join('\n')}`,
    )
  }

  const elementsPackagePath = path.join(
    workspaceRoot,
    'packages/elements/package.json',
  )
  const reactPackagePath = path.join(
    workspaceRoot,
    'packages/react/package.json',
  )
  const astroPackagePath = path.join(
    workspaceRoot,
    'packages/astro/package.json',
  )
  const inventoryPath = path.join(workspaceRoot, 'config/components.json')
  const elementsIndexPath = path.join(
    workspaceRoot,
    'packages/elements/src/index.ts',
  )
  const reactIndexPath = path.join(workspaceRoot, 'packages/react/src/index.ts')
  const [
    elementsPackage,
    reactPackage,
    astroPackage,
    inventory,
    elementsIndex,
    reactIndex,
  ] = await Promise.all([
    readFile(elementsPackagePath, 'utf8').then(JSON.parse),
    readFile(reactPackagePath, 'utf8').then(JSON.parse),
    readFile(astroPackagePath, 'utf8').then(JSON.parse),
    readFile(inventoryPath, 'utf8').then(JSON.parse),
    readFile(elementsIndexPath, 'utf8'),
    readFile(reactIndexPath, 'utf8'),
  ])

  if (inventory.entries.some((entry) => entry.name === name)) {
    throw new Error(`${name} already exists in config/components.json`)
  }

  const sources = new Map([
    [relativeFiles[0], elementSource(name, className, tagName)],
    [relativeFiles[1], testSource(name, tagName)],
    [relativeFiles[2], reactSource(name, className, tagName)],
    [relativeFiles[3], astroSource(name, tagName)],
    [relativeFiles[4], docsSource(name, className, tagName)],
  ])

  for (const [relative, source] of sources) {
    const destination = path.join(workspaceRoot, relative)
    await mkdir(path.dirname(destination), { recursive: true })
    await writeFile(destination, source)
  }

  inventory.entries.push({
    astroFacades: [facade],
    docsPage: `${name}.astro`,
    elements: [{ className, events: [], tagName }],
    name,
    typeExports: [],
  })
  const elementsExport = {
    types: `./dist/${name}/cad-${name}.d.ts`,
    import: `./dist/${name}/cad-${name}.js`,
  }
  const reactExport = {
    types: `./dist/${name}.d.ts`,
    import: `./dist/${name}.js`,
  }

  await Promise.all([
    writeFile(
      elementsPackagePath,
      `${JSON.stringify(withExport(elementsPackage, `./${name}`, elementsExport), null, 2)}\n`,
    ),
    writeFile(
      reactPackagePath,
      `${JSON.stringify(withExport(reactPackage, `./${name}`, reactExport), null, 2)}\n`,
    ),
    writeFile(
      astroPackagePath,
      `${JSON.stringify(withExport(astroPackage, `./${facade}`, `./src/${facade}`), null, 2)}\n`,
    ),
    writeFile(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`),
    writeFile(
      elementsIndexPath,
      appendExport(elementsIndex, `export * from './${name}/cad-${name}.js'`),
    ),
    writeFile(
      reactIndexPath,
      appendExport(reactIndex, `export * from './${name}.js'`),
    ),
  ])

  return { className, files: relativeFiles, name, tagName }
}

function argument(name) {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}

const isMain =
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url

if (isMain) {
  const name =
    argument('--name') ??
    process.argv.find((value, index) => index > 1 && !value.startsWith('--'))
  if (!name) {
    console.error(
      'Usage: pnpm create:component --name sticky-note [--dry-run] [--json]',
    )
    process.exitCode = 1
  } else {
    try {
      const result = await createComponent({
        dryRun: process.argv.includes('--dry-run'),
        name,
      })
      if (process.argv.includes('--json')) console.log(JSON.stringify(result))
      else {
        console.log(
          `${process.argv.includes('--dry-run') ? 'Would create' : 'Created'} ${result.tagName}:`,
        )
        for (const file of result.files) console.log(`- ${file}`)
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error)
      process.exitCode = 1
    }
  }
}
