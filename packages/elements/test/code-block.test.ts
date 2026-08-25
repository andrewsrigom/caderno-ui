import { afterEach, describe, expect, it } from 'vitest'

import '../src/code-block/cad-code-block.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-code-block', () => {
  it('renders native preformatted code with optional metadata', async () => {
    expectRegistered('cad-code-block')
    const block = document.createElement('cad-code-block')
    block.filename = 'review.ts'
    block.language = 'ts'
    block.code = "import '@caderno-ui/elements/card'"
    document.body.append(block)
    await block.updateComplete

    expect(
      block.shadowRoot?.querySelector('figure pre code')?.textContent,
    ).toBe(block.code)
    expect(
      block.shadowRoot?.querySelector('figcaption')?.textContent,
    ).toContain('review.ts')
  })

  it('adds line numbers without placing them in the accessible code text', async () => {
    const block = document.createElement('cad-code-block')
    block.code = 'first\nsecond'
    block.showLineNumbers = true
    document.body.append(block)
    await block.updateComplete

    const numbers = block.shadowRoot?.querySelectorAll('.number')
    expect(numbers).toHaveLength(2)
    expect(numbers?.[0]?.getAttribute('aria-hidden')).toBe('true')
  })

  it('formats recognized syntax without changing the copied source text', async () => {
    const block = document.createElement('cad-code-block')
    block.code = "import { html } from 'lit' // browser template"
    block.language = 'ts'
    document.body.append(block)
    await block.updateComplete

    expect(block.shadowRoot?.querySelectorAll('.token.keyword')).toHaveLength(2)
    expect(block.shadowRoot?.querySelector('.token.string')?.textContent).toBe(
      "'lit'",
    )
    expect(block.shadowRoot?.querySelector('.token.comment')?.textContent).toBe(
      '// browser template',
    )
    expect(block.shadowRoot?.querySelector('code')?.textContent).toBe(
      block.code,
    )
  })
})
