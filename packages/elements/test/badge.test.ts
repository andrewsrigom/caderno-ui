import { afterEach, describe, expect, it } from 'vitest'

import '../src/badge/cad-badge.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-badge', () => {
  it('registers individually and reflects visual variants without adding a role', async () => {
    expectRegistered('cad-badge')
    const badge = document.createElement('cad-badge')
    badge.icon = 'check'
    badge.tone = 'mint'
    badge.variant = 'outline'
    badge.textContent = 'Reviewed'
    document.body.append(badge)
    await badge.updateComplete

    expect(badge.getAttribute('tone')).toBe('mint')
    expect(badge.getAttribute('variant')).toBe('outline')
    expect(badge.shadowRoot?.querySelector('[role]')).toBeNull()
    expect(badge.shadowRoot?.querySelector('cad-icon')).not.toBeNull()
    expect(badge.shadowRoot?.querySelector('slot')).not.toBeNull()
  })
})
