import { afterEach, describe, expect, it } from 'vitest'

import '../src/checklist/cad-checklist.js'
import { expectRegistered, nextFrame } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-checklist', () => {
  it('registers the family and resolves do and dont marks', async () => {
    expectRegistered('cad-checklist')
    expectRegistered('cad-checklist-item')

    const checklist = document.createElement('cad-checklist')
    checklist.variant = 'dont'
    const inherited = document.createElement('cad-checklist-item')
    inherited.textContent = 'Hide native semantics'
    const override = document.createElement('cad-checklist-item')
    override.kind = 'check'
    override.textContent = 'Keep explicit labels'
    checklist.append(inherited, override)
    document.body.append(checklist)
    await nextFrame()

    expect(inherited.resolvedKind).toBe('cross')
    expect(override.resolvedKind).toBe('check')
    expect(checklist.shadowRoot?.querySelector('[role="list"]')).not.toBeNull()
    expect(
      inherited.shadowRoot?.querySelector('[role="listitem"]'),
    ).not.toBeNull()
  })

  it('updates inherited marks when the parent variant changes', async () => {
    const checklist = document.createElement('cad-checklist')
    const item = document.createElement('cad-checklist-item')
    checklist.append(item)
    document.body.append(checklist)
    await nextFrame()
    expect(item.resolvedKind).toBe('check')

    checklist.variant = 'dont'
    await checklist.updateComplete
    await item.updateComplete
    expect(item.resolvedKind).toBe('cross')
  })
})
