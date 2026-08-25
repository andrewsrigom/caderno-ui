import { afterEach, describe, expect, it } from 'vitest'

import '../src/pagination/cad-pagination.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-pagination', () => {
  it('creates stable collection URLs and a current-page marker', async () => {
    expectRegistered('cad-pagination')
    const element = document.createElement('cad-pagination')
    element.baseHref = '/notes?filter=ready'
    element.page = 5
    element.total = 12
    document.body.append(element)
    await element.updateComplete

    const current = element.shadowRoot?.querySelector('[aria-current="page"]')
    expect(current?.textContent?.trim()).toBe('5')
    expect(current?.getAttribute('href')).toBe('/notes?filter=ready&page=5')
    expect(element.shadowRoot?.querySelectorAll('a').length).toBeGreaterThan(3)
  })
})
