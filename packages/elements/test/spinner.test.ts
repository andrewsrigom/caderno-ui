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
    expect(spinner.getAttribute('size')).toBe('lg')
    expect(spinner.getAttribute('tone')).toBe('blue')
    expect(spinner.getAttribute('variant')).toBe('ring')
    expect(spinner.shadowRoot?.querySelector('[part="icon"]')).not.toBeNull()
    expect(customElements.get('cad-icon')).toBeUndefined()
  })

  it('reflects semantic tones, four sizes, and alternate motion treatments', async () => {
    const spinner = document.createElement('cad-spinner')
    spinner.size = 'xs'
    spinner.tone = 'red'
    spinner.variant = 'pulse'
    document.body.append(spinner)
    await spinner.updateComplete

    expect(spinner.getAttribute('size')).toBe('xs')
    expect(spinner.getAttribute('tone')).toBe('red')
    expect(spinner.getAttribute('variant')).toBe('pulse')
    expect(spinner.shadowRoot?.querySelectorAll('.dot')).toHaveLength(4)
  })
})
