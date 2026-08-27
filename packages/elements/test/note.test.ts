import { afterEach, describe, expect, it } from 'vitest'

import '../src/note/cad-note.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-note', () => {
  it('registers individually and exposes note semantics and public slots', async () => {
    expectRegistered('cad-note')
    const note = document.createElement('cad-note')
    const title = document.createElement('span')
    title.slot = 'title'
    title.textContent = 'Architecture'
    const footer = document.createElement('small')
    footer.slot = 'footer'
    footer.textContent = 'Reviewed today'
    note.append(title, 'Prefer explicit contracts.', footer)
    document.body.append(note)
    await note.updateComplete

    expect(note.heading).toBe('Note')
    expect(note.tone).toBe('lemon')
    expect(note.shadowRoot?.querySelector('[role="note"]')).not.toBeNull()
    expect(
      note.shadowRoot
        ?.querySelector<HTMLSlotElement>('slot[name="title"]')
        ?.assignedElements(),
    ).toEqual([title])
    expect(
      note.shadowRoot
        ?.querySelector<HTMLSlotElement>('slot[name="footer"]')
        ?.assignedElements(),
    ).toEqual([footer])
  })
})
