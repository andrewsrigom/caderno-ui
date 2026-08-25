import { afterEach, describe, expect, it } from 'vitest'

import { enhanceCadernoProse } from '../src/prose/enhance-prose.js'

afterEach(() => document.body.replaceChildren())

describe('Caderno prose enhancement', () => {
  it('enhances semantic editorial HTML with the canonical prose contract', () => {
    const prose = document.createElement('article')
    prose.className = 'cad-prose'
    prose.innerHTML = `
      <details class="interview-question">
        <summary>Why?</summary>
        <p class="interview-answer">Because.</p>
      </details>
      <blockquote><p>A useful quote.</p></blockquote>
      <pre><code><span class="line">const value = 1</span></code></pre>
      <mark>Important</mark>
      <table><tbody><tr><td>Value</td></tr></tbody></table>
    `
    document.body.append(prose)

    enhanceCadernoProse(document)

    expect(prose.querySelector('.cad-prose-accordion')).not.toBeNull()
    expect(prose.querySelector('.cad-prose-blockquote')).not.toBeNull()
    expect(prose.querySelector('.cad-prose-code')).not.toBeNull()
    expect(prose.querySelector('.cad-prose-highlight')).not.toBeNull()
    expect(prose.querySelector('.cad-prose-table-wrap')).not.toBeNull()
  })

  it('is idempotent when a page is enhanced more than once', () => {
    const prose = document.createElement('article')
    prose.className = 'cad-prose'
    prose.innerHTML =
      '<blockquote>Once</blockquote><table><tr><td>Once</td></tr></table>'
    document.body.append(prose)

    enhanceCadernoProse(document)
    enhanceCadernoProse(document)

    expect(prose.querySelectorAll('.cad-prose-blockquote')).toHaveLength(1)
    expect(prose.querySelectorAll('.cad-prose-table-wrap')).toHaveLength(1)
  })
})
