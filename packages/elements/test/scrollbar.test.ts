import { afterEach, describe, expect, it } from 'vitest'

import '../src/table/cad-table.js'
import '../src/code-block/cad-code-block.js'
import '../src/drawer/cad-drawer.js'
import '../src/modal/cad-modal.js'
import '../src/popover/cad-popover.js'
import '../src/kanban/cad-kanban.js'
import '../src/textarea/cad-textarea.js'
import '../src/tabs/index.js'
import '../src/styles/scrollbar.css'

afterEach(() => document.body.replaceChildren())

describe('shared native scrollbars', () => {
  for (const [tag, part] of [
    ['cad-table', 'base'],
    ['cad-code-block', 'pre'],
    ['cad-drawer', 'body'],
    ['cad-modal', 'body'],
    ['cad-popover', 'body'],
    ['cad-kanban', 'board'],
    ['cad-textarea', 'control'],
  ] as const) {
    it(`shares customizable scrollbars with ${tag}`, async () => {
      const element = document.createElement(tag)
      element.style.setProperty('--cad-scrollbar-size', '14px')
      element.style.setProperty('--cad-scrollbar-thumb', '#6d35c5')
      element.style.setProperty('--cad-scrollbar-track', '#fff0dd')
      document.body.append(element)
      await element.updateComplete
      const scroller = element.shadowRoot!.querySelector(`[part="${part}"]`)!
      expect(getComputedStyle(scroller, '::-webkit-scrollbar').width).toBe(
        '14px',
      )
      expect(getComputedStyle(scroller, '::-webkit-scrollbar').height).toBe(
        '14px',
      )
      expect(
        getComputedStyle(scroller, '::-webkit-scrollbar-thumb').backgroundColor,
      ).toBe('rgb(109, 53, 197)')
      expect(
        getComputedStyle(scroller, '::-webkit-scrollbar-track').backgroundColor,
      ).toBe('rgb(255, 240, 221)')
      expect(
        getComputedStyle(scroller, '::-webkit-scrollbar-thumb').borderRadius,
      ).toBe('0px')
    })
  }

  it('keeps tab-strip scrollbars intentionally hidden', async () => {
    const list = document.createElement('cad-tabs-list')
    document.body.append(list)
    await list.updateComplete
    const scroller = list.shadowRoot!.querySelector('[part="list"]')!
    expect(getComputedStyle(scroller).scrollbarWidth).toBe('none')
    expect(getComputedStyle(scroller, '::-webkit-scrollbar').display).toBe(
      'none',
    )
  })

  it('keeps code scrollbars legible on the dark code surface', async () => {
    const code = document.createElement('cad-code-block')
    document.body.append(code)
    await code.updateComplete
    const pre = code.shadowRoot!.querySelector('pre')!
    expect(
      getComputedStyle(pre, '::-webkit-scrollbar-thumb').backgroundColor,
    ).toBe('rgb(168, 184, 255)')
    expect(
      getComputedStyle(pre, '::-webkit-scrollbar-track').backgroundColor,
    ).toBe(getComputedStyle(pre).backgroundColor)
  })

  it('styles a public scroll part without changing its native overflow', async () => {
    const table = document.createElement('cad-table')
    document.body.append(table)
    await table.updateComplete
    const scroller = table.shadowRoot!.querySelector<HTMLElement>('.base')!
    expect(getComputedStyle(scroller).overflowX).toBe('auto')
    expect(getComputedStyle(scroller, '::-webkit-scrollbar').width).toBe('10px')
    expect(
      getComputedStyle(scroller, '::-webkit-scrollbar-thumb').backgroundColor,
    ).toBe('rgb(0, 91, 172)')
    expect(
      getComputedStyle(scroller, '::-webkit-scrollbar-thumb').borderRadius,
    ).toBe('0px')
  })
})
