import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('supports light and dark color schemes', async ({ page }) => {
  const background = async () =>
    page.evaluate(() => getComputedStyle(document.body).backgroundColor)

  const lightBackground = await background()
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  const darkBackground = await background()

  expect(lightBackground).not.toBe(darkBackground)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('supports RTL without changing component semantics', async ({ page }) => {
  await page
    .locator('html')
    .evaluate((element) => element.setAttribute('dir', 'rtl'))
  await expect(page.locator('cad-tabs')).toHaveCSS('direction', 'rtl')
  await page.getByRole('tab', { name: 'Contract' }).press('ArrowLeft')
  await expect(page.getByRole('tab', { name: 'Problem' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('removes optional motion when reduced motion is requested', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const transitionDuration = await page
    .locator('cad-tabs')
    .getByRole('tab', { name: 'Contract' })
    .evaluate((element) => getComputedStyle(element).transitionDuration)
  expect(transitionDuration).toBe('0s')
  await expect(page.getByRole('progressbar', { name: 'Syncing' })).toHaveCSS(
    'animation-name',
    'none',
  )

  const accordion = page.locator('cad-accordion-item').nth(1)
  await accordion.getByText('When is the simple loop better?').click()
  expect(
    await accordion
      .locator('[part="content"]')
      .evaluate((element) => element.getAnimations().length),
  ).toBe(0)

  const chart = page.locator('cad-chart[heading="Notes reviewed"]')
  await chart.scrollIntoViewIfNeeded()
  await page.waitForTimeout(100)
  expect(
    await chart
      .locator('[data-rough]')
      .evaluate((drawing) =>
        [...drawing.children].reduce(
          (total, mark) => total + mark.getAnimations().length,
          0,
        ),
      ),
  ).toBe(0)
})

test('remains operable in forced colors', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' })
  expect(
    await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
  ).toBe(true)
  await expect(
    page.getByRole('button', { name: 'Save laboratory' }),
  ).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Contract' })).toBeVisible()
  await expect(
    page
      .locator('cad-chart[heading="Notes reviewed"]')
      .getByRole('table', { name: 'Notes reviewed' }),
  ).toBeAttached()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('reflows at 200 percent text zoom without horizontal page overflow', async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 640 })
  await page.locator('html').evaluate((element) => {
    element.style.fontSize = '200%'
  })

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
  await expect(
    page.getByRole('button', { name: 'Save laboratory' }),
  ).toBeVisible()
  await expect(page.locator('cad-chart').first()).toBeVisible()
})

test('interactive component targets are at least 44 CSS pixels', async ({
  page,
}) => {
  const controls = [
    page.getByRole('button', { name: 'Save laboratory' }),
    page.getByRole('button', { name: 'Dismiss alert' }).first(),
    page.getByRole('tab', { name: 'Contract' }),
  ]

  for (const control of controls) {
    const box = await control.boundingBox()
    expect(box?.height).toBeGreaterThanOrEqual(44)
    expect(box?.width).toBeGreaterThanOrEqual(44)
  }
})
