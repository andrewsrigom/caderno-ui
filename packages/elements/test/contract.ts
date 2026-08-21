import { expect } from 'vitest'

export const expectRegistered = (tagName: keyof HTMLElementTagNameMap) => {
  expect(customElements.get(tagName)).toBeDefined()
}

export const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
