import { expect, test } from '@playwright/test'

test.beforeEach(async ({ browserName, page }) => {
  test.skip(
    browserName !== 'chromium',
    'Visual baselines use pinned Linux Chromium.',
  )
  await page.goto('/')
  await page.addStyleTag({
    content:
      '*, *::before, *::after { animation: none !important; caret-color: transparent !important; transition: none !important; }',
  })
  await page.evaluate(() => document.fonts.ready)
  await page.locator('*').evaluateAll((elements) => {
    for (const element of elements) {
      if (!element.shadowRoot) continue
      const style = document.createElement('style')
      style.textContent =
        '*, *::before, *::after { animation: none !important; caret-color: transparent !important; transition: none !important; }'
      element.shadowRoot.append(style)
    }
  })
})

for (const theme of ['light', 'dark'] as const) {
  test(`matches the ${theme} component-state baseline`, async ({ page }) => {
    await page
      .locator('html')
      .evaluate(
        (element, value) => element.setAttribute('data-theme', value),
        theme,
      )
    await page.locator('cad-progress:not([value])').evaluateAll((elements) => {
      for (const element of elements) element.setAttribute('value', '0')
    })
    await expect(
      page.locator('cad-header[data-component="header"]'),
    ).toHaveScreenshot(`laboratory-header-${theme}.png`, {
      animations: 'disabled',
      scale: 'css',
    })
    const laboratory = page.locator('main')
    await laboratory.evaluate((element) => {
      element.style.height = `${Math.ceil(element.getBoundingClientRect().height)}px`
    })
    await expect(laboratory).toHaveScreenshot(`laboratory-${theme}.png`, {
      animations: 'disabled',
      scale: 'css',
    })
  })
}
