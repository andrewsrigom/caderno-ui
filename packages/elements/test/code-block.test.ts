import { afterEach, describe, expect, it, vi } from 'vitest'

import '../src/code-block/cad-code-block.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-code-block', () => {
  it('highlights semantic server-rendered code and copies its exact source', async () => {
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    const block = document.createElement('cad-code-block')
    const source = '  const count = 2\n\n  count += 1\n'
    const pre = document.createElement('pre')
    const code = document.createElement('code')
    code.textContent = source
    pre.append(code)
    block.append(pre)
    block.language = 'js'
    block.copyable = true
    document.body.append(block)
    await block.updateComplete

    expect(block.querySelector('pre > code')?.textContent).toBe(source)
    expect(block.shadowRoot?.querySelector('.token.keyword')?.textContent).toBe(
      'const',
    )
    expect(block.shadowRoot?.querySelector('code')?.textContent).toBe(
      source.trimEnd(),
    )
    expect(block.shadowRoot?.querySelector('code slot')).toBeNull()
    await block.copy()
    expect(write).toHaveBeenCalledWith(source)
  })

  it('copies exact source, announces success, and emits a composed result', async () => {
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    const block = document.createElement('cad-code-block')
    block.copyable = true
    block.code = '  first\n  second\n'
    block.showLineNumbers = true
    const copied = vi.fn()
    block.addEventListener('cad-code-copy', copied)
    document.body.append(block)
    await block.updateComplete
    expect(await block.copy()).toBe(true)
    await block.updateComplete
    expect(write).toHaveBeenCalledWith(block.code)
    expect(
      block.shadowRoot?.querySelector('[role="status"]')?.textContent,
    ).toBe('Copied')
    expect(copied.mock.calls[0]?.[0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: { success: true },
    })
  })

  it('reports clipboard denial and excludes actions from slotted source', async () => {
    const write = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockRejectedValue(new Error('denied'))
    const block = document.createElement('cad-code-block')
    block.copyable = true
    block.innerHTML =
      '<span>hello</span><button slot="actions">Open playground</button>'
    document.body.append(block)
    await block.updateComplete
    expect(await block.copy()).toBe(false)
    await block.updateComplete
    expect(write).toHaveBeenCalledWith('hello')
    expect(
      block.shadowRoot?.querySelector('[role="status"]')?.textContent,
    ).toBe('Copy failed')
    expect(block.shadowRoot?.querySelector('button')?.disabled).toBe(false)
  })

  it('does not add a copy control unless requested', async () => {
    const block = document.createElement('cad-code-block')
    document.body.append(block)
    await block.updateComplete
    expect(block.shadowRoot?.querySelector('[part="copy"]')).toBeNull()
  })
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
