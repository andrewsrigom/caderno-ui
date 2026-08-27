import { expect, test } from '@playwright/test'

test('horizontal steps adapt to their container, not the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  await page.evaluate(async () => {
    await customElements.whenDefined('cad-steps')
    const container = document.createElement('div')
    container.id = 'narrow-method'
    container.style.width = '550px'
    const steps = document.createElement('cad-steps')
    steps.orientation = 'horizontal'
    for (const title of ['Contract', 'Evidence', 'Reference', 'Verification']) {
      const step = document.createElement('cad-step')
      step.title = title
      step.textContent = 'Keep the explanation separate from the title.'
      steps.append(step)
    }
    container.append(steps)
    document.body.prepend(container)
  })

  const steps = page.locator('#narrow-method cad-step')
  const first = steps.nth(0)
  const second = steps.nth(1)
  await expect(first).toBeVisible()
  await expect
    .poll(async () => {
      const a = await first.boundingBox()
      const b = await second.boundingBox()
      return Boolean(a && b && b.y >= a.y + a.height - 1)
    })
    .toBe(true)
  expect(
    await page
      .locator('#narrow-method')
      .evaluate((container) => container.scrollWidth <= container.clientWidth),
  ).toBe(true)

  await page.locator('#narrow-method').evaluate((container: HTMLElement) => {
    container.style.width = '1000px'
  })
  await expect
    .poll(async () => {
      const a = await first.boundingBox()
      const b = await second.boundingBox()
      return Boolean(a && b && Math.abs(a.y - b.y) < 1 && b.x > a.x)
    })
    .toBe(true)
})
