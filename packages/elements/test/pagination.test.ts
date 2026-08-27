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

  it('uses explicit hrefs for path-based routers', async () => {
    const pagination = document.createElement('cad-pagination')
    pagination.hrefs = ['/notes', '/notes/page/2', '/notes/page/3']
    pagination.page = 2
    pagination.total = 3
    document.body.append(pagination)
    await pagination.updateComplete

    const links =
      pagination.shadowRoot?.querySelectorAll<HTMLAnchorElement>('a')
    expect(
      Array.from(links ?? [], (link) => link.getAttribute('href')),
    ).toContain('/notes/page/3')
  })

  it('collapses a long range and keeps the current neighborhood visible', async () => {
    const pagination = document.createElement('cad-pagination')
    pagination.baseHref = '/notes'
    pagination.page = 5
    pagination.total = 12
    document.body.append(pagination)
    await pagination.updateComplete

    const pages = Array.from(
      pagination.shadowRoot?.querySelectorAll<HTMLAnchorElement>('.page') ?? [],
      (link) => link.textContent?.trim(),
    )
    expect(pages).toEqual(['1', '4', '5', '6', '12'])
    expect(
      pagination.shadowRoot?.querySelectorAll('[part="ellipsis"]'),
    ).toHaveLength(2)
  })

  it('supports first/last controls and visible text directions', async () => {
    const pagination = document.createElement('cad-pagination')
    pagination.baseHref = '/notes'
    pagination.page = 2
    pagination.previousText = 'Back'
    pagination.nextText = 'Forward'
    pagination.showFirstLast = true
    pagination.total = 5
    pagination.variant = 'text'
    document.body.append(pagination)
    await pagination.updateComplete

    const first = pagination.shadowRoot?.querySelector('.first')
    const last = pagination.shadowRoot?.querySelector('.last')
    const text = pagination.shadowRoot?.textContent ?? ''
    expect(first?.getAttribute('aria-label')).toBe('First page')
    expect(last?.getAttribute('aria-label')).toBe('Last page')
    expect(text).toContain('Back')
    expect(text).toContain('Forward')
  })
})
