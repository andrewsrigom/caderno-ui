import { afterEach, describe, expect, it } from 'vitest'

import '../src/blockquote/cad-blockquote.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-blockquote', () => {
  it('renders a semantic quote and linked attribution', async () => {
    expectRegistered('cad-blockquote')
    const quote = document.createElement('cad-blockquote')
    quote.author = 'Architecture review'
    quote.source = 'Decision record'
    quote.cite = '/decisions/search-index'
    quote.textContent = 'Keep the contract smaller than the implementation.'
    document.body.append(quote)
    await quote.updateComplete

    const blockquote = quote.shadowRoot?.querySelector('blockquote')
    const link = quote.shadowRoot?.querySelector('figcaption a')
    expect(blockquote?.getAttribute('cite')).toBe('/decisions/search-index')
    expect(link?.getAttribute('href')).toBe('/decisions/search-index')
    expect(link?.textContent).toContain('Decision record')
  })

  it('omits an empty caption', async () => {
    const quote = document.createElement('cad-blockquote')
    quote.textContent = 'A standalone quotation.'
    document.body.append(quote)
    await quote.updateComplete
    expect(quote.shadowRoot?.querySelector('figcaption')).toBeNull()
  })
})
