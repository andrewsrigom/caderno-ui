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
})

for (const theme of ['light', 'dark'] as const) {
  test(`matches the ${theme} component-state baseline`, async ({ page }) => {
    await page
      .locator('html')
      .evaluate(
        (element, value) => element.setAttribute('data-theme', value),
        theme,
      )
    await expect(page.locator('main')).toHaveScreenshot(
      `laboratory-${theme}.png`,
      {
        animations: 'disabled',
        scale: 'css',
      },
    )
  })
}
