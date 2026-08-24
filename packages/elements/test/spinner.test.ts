import { afterEach, describe, expect, it } from 'vitest'

import '../src/spinner/cad-spinner.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-spinner', () => {
  it('registers individually and exposes a named live status', async () => {
    expectRegistered('cad-spinner')
    const spinner = document.createElement('cad-spinner')
    spinner.label = 'Indexing notes'
    spinner.size = 'lg'
    document.body.append(spinner)
    await spinner.updateComplete

    const status = spinner.shadowRoot?.querySelector('[role="status"]')
    expect(status?.textContent).toContain('Indexing notes')
    expect(status?.getAttribute('aria-live')).toBe('polite')
    expect(
      spinner.shadowRoot?.querySelector('cad-icon')?.getAttribute('size'),
    ).toBe('42')
  })
})
