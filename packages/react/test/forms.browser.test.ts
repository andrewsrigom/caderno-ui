/* eslint-disable @typescript-eslint/require-await -- React async act flushes effects even for synchronous render callbacks. */
import { act, createElement as h, createRef, StrictMode, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { CadInput as InputElement } from '@caderno-ui/elements/input'
import { CadInput } from '../src/input.js'
import { CadTextarea } from '../src/textarea.js'
import { CadCheckbox } from '../src/checkbox.js'
import { CadSwitch } from '../src/switch.js'
import { CadRadio } from '../src/radio.js'
import { CadSlider } from '../src/slider.js'
import { CadModal } from '../src/modal.js'
import { CadToastHost, toast } from '../src/toast.js'

let container: HTMLDivElement
let root: Root

async function updated() {
  await Promise.all(
    [...container.querySelectorAll('*')].map((element) =>
      'updateComplete' in element ? element.updateComplete : undefined,
    ),
  )
}

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  toast.dismiss()
})

describe('React form contracts in a browser', () => {
  it('exposes updated checkbox state and FormData during onInput', async () => {
    const inputs: Array<[boolean, FormDataEntryValue | null]> = []
    const changes = vi.fn()
    await act(async () =>
      root.render(
        h(
          'form',
          null,
          h(CadCheckbox, {
            name: 'reviewed',
            label: 'Reviewed',
            onInput: (event) =>
              inputs.push([
                event.currentTarget.checked,
                new FormData(container.querySelector('form')!).get('reviewed'),
              ]),
            onChange: changes,
          }),
        ),
      ),
    )
    await updated()
    act(() => container.querySelector('cad-checkbox')!.click())
    expect(inputs).toEqual([[true, 'on']])
    expect(changes).toHaveBeenCalledOnce()
  })

  it('keeps controlled text, native events, refs and FormData aligned in Strict Mode', async () => {
    const input = createRef<InputElement>()
    const onInput = vi.fn()
    const onChange = vi.fn()
    function Editor() {
      const [title, setTitle] = useState('First note')
      return h(
        'form',
        { onReset: () => setTitle('First note') },
        h(CadInput, {
          ref: input,
          name: 'title',
          label: 'Title',
          value: title,
          required: true,
          onInput: (event) => {
            onInput(event.currentTarget.value)
            setTitle(event.currentTarget.value)
          },
          onChange: (event) => {
            onChange(event.currentTarget.value)
          },
        }),
        h(
          'button',
          { type: 'button', onClick: () => setTitle('External update') },
          'Replace',
        ),
        h('output', null, title),
      )
    }
    await act(async () => root.render(h(StrictMode, null, h(Editor))))
    await updated()
    const form = container.querySelector('form')!
    const control = input.current!.shadowRoot!.querySelector('input')!
    expect(control.value).toBe('First note')
    input.current!.focus()
    expect(input.current!.shadowRoot!.activeElement).toBe(control)
    await act(async () => {
      control.value = 'Edited'
      control.dispatchEvent(
        new Event('input', { bubbles: true, composed: true }),
      )
    })
    await updated()
    expect(onInput.mock.calls).toEqual([['Edited']])
    expect(onChange).not.toHaveBeenCalled()
    expect(container.querySelector('output')!.textContent).toBe('Edited')
    expect(new FormData(form).get('title')).toBe('Edited')
    await act(async () => {
      control.dispatchEvent(new Event('change', { bubbles: true }))
    })
    expect(onChange.mock.calls).toEqual([['Edited']])
    await act(async () => container.querySelector('button')!.click())
    await updated()
    expect(control.value).toBe('External update')
    await act(async () => form.reset())
    await updated()
    expect(control.value).toBe('First note')
    expect(new FormData(form).get('title')).toBe('First note')
  })

  it('restores initial properties on native reset', async () => {
    await act(async () =>
      root.render(
        h(
          'form',
          null,
          h(CadInput, { name: 'title', label: 'Title', value: 'Original' }),
          h(CadTextarea, {
            name: 'body',
            label: 'Body',
            value: 'Original body',
          }),
          h(CadCheckbox, {
            name: 'reviewed',
            label: 'Reviewed',
            checked: true,
          }),
          h(CadSwitch, { name: 'save', label: 'Auto-save', checked: true }),
          h(CadRadio, {
            name: 'kind',
            label: 'Note',
            value: 'note',
            checked: true,
          }),
          h(CadSlider, { name: 'depth', label: 'Depth', value: 60 }),
        ),
      ),
    )
    await updated()
    const input = container.querySelector('cad-input')!
    const textarea = container.querySelector('cad-textarea')!
    const checkbox = container.querySelector('cad-checkbox')!
    const toggle = container.querySelector('cad-switch')!
    const radio = container.querySelector('cad-radio')!
    const slider = container.querySelector('cad-slider')!
    input.value = 'Changed'
    textarea.value = 'Changed'
    checkbox.checked = false
    toggle.checked = false
    radio.checked = false
    slider.value = 20
    await updated()
    container.querySelector('form')!.reset()
    await updated()
    expect(input.value).toBe('Original')
    expect(textarea.value).toBe('Original body')
    expect(checkbox.checked).toBe(true)
    expect(toggle.checked).toBe(true)
    expect(radio.checked).toBe(true)
    expect(slider.value).toBe(60)
  })

  it('supports native required validation and disabled fieldsets', async () => {
    const render = (disabled: boolean) =>
      h(
        'form',
        null,
        h(
          'fieldset',
          { disabled },
          h(CadInput, { name: 'title', label: 'Title', required: true }),
          h(CadCheckbox, { name: 'ready', label: 'Ready', required: true }),
        ),
      )
    await act(async () => root.render(render(false)))
    await updated()
    const form = container.querySelector('form')!
    const input = container.querySelector('cad-input')!
    const checkbox = container.querySelector('cad-checkbox')!
    expect(form.checkValidity()).toBe(false)
    input.value = 'Ready'
    checkbox.checked = true
    await updated()
    expect(form.checkValidity()).toBe(true)
    expect([...new FormData(form).entries()]).toEqual([
      ['title', 'Ready'],
      ['ready', 'on'],
    ])
    await act(async () => root.render(render(true)))
    await updated()
    expect(input.shadowRoot!.querySelector('input')!.disabled).toBe(true)
    expect(checkbox.shadowRoot!.querySelector('input')!.disabled).toBe(true)
    expect([...new FormData(form).entries()]).toEqual([])
  })

  it('replaces callbacks without stale or duplicate listeners on remount', async () => {
    const first = vi.fn()
    const second = vi.fn()
    const render = (handler: typeof first) =>
      h(
        StrictMode,
        null,
        h(CadCheckbox, { label: 'Ready', onChange: handler }),
        h(CadSwitch, { label: 'Auto-save', onChange: handler }),
      )
    await act(async () => root.render(render(first)))
    await updated()
    await act(async () => root.render(render(second)))
    await updated()
    act(() => container.querySelector('cad-checkbox')!.click())
    act(() => container.querySelector('cad-switch')!.click())
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(2)
    await act(async () => root.render(null))
    await act(async () => root.render(render(second)))
    await updated()
    act(() => container.querySelector('cad-checkbox')!.click())
    expect(second).toHaveBeenCalledTimes(3)
  })

  it('releases modal scroll locks and toast hosts on unmount', async () => {
    const originalOverflow = document.body.style.overflow
    await act(async () =>
      root.render(
        h(
          StrictMode,
          null,
          h(
            CadModal,
            { open: true, heading: 'Review' },
            h('p', null, 'Check this note.'),
          ),
          h(CadToastHost, { id: 'react-lifecycle-toasts' }),
        ),
      ),
    )
    await updated()
    const modal = container.querySelector('cad-modal')!
    expect(modal.shadowRoot!.querySelector('dialog')!.open).toBe(true)
    toast.success('Saved', {
      hostId: 'react-lifecycle-toasts',
      duration: Infinity,
    })
    await updated()
    await act(async () => root.render(null))
    expect(document.body.style.overflow).toBe(originalOverflow)
    expect(document.querySelector('cad-toast-host')).toBeNull()
    expect(document.querySelector('[inert]')).toBeNull()
  })

  it('does not resurrect a toast host when a pending task settles after unmount', async () => {
    await act(async () =>
      root.render(h(StrictMode, null, h(CadToastHost, { id: 'pending-host' }))),
    )
    await updated()
    let finish!: (value: string) => void
    const task = new Promise<string>((resolve) => {
      finish = resolve
    })
    const finished = vi.fn()
    toast.promise(task, {
      hostId: 'pending-host',
      loading: 'Saving',
      success: 'Saved',
      error: 'Failed',
      finally: finished,
    })
    await act(async () => root.render(null))
    finish('Done')
    await vi.waitFor(() => expect(finished).toHaveBeenCalledOnce())
    expect(document.querySelector('cad-toast-host')).toBeNull()
  })
})
