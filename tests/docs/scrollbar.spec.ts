import { expect, test } from '@playwright/test'

test('scrollbars match before registration, after reload, and in dark mode', async ({
  page,
}) => {
  const appearance = () =>
    page.locator('html, .sidebar').evaluateAll((elements) =>
      elements.map((element) => ({
        thumb: getComputedStyle(element, '::-webkit-scrollbar-thumb')
          .backgroundColor,
        track: getComputedStyle(element, '::-webkit-scrollbar-track')
          .backgroundColor,
        radius: getComputedStyle(element, '::-webkit-scrollbar-thumb')
          .borderRadius,
        width: getComputedStyle(element, '::-webkit-scrollbar').width,
      })),
    )
  await page.route('**/*.js*', (route) => route.abort())
  await page.goto('components/table/')
  // Compare idle colors, not the hovered thumb at the initial mouse position.
  await page.mouse.move(-1, -1)
  const initial = await appearance()
  expect(initial[0]).toEqual(initial[1])
  expect(initial[0].width).toBe('10px')
  expect(initial[0].radius).toBe('0px')
  expect(initial[0].track).toBe('rgb(255, 255, 255)')
  await page.unroute('**/*.js*')
  await page.reload()
  await page.mouse.move(-1, -1)
  await expect(page.locator('cad-table:not(:defined)')).toHaveCount(0)
  expect(await appearance()).toEqual(initial)
  const table = page.locator('cad-table [part="base"]').first()
  expect(
    await table.evaluate(
      (element) =>
        getComputedStyle(element, '::-webkit-scrollbar-thumb').backgroundColor,
    ),
  ).toBe(initial[0].thumb)

  await page.getByRole('button', { name: 'Toggle color theme' }).click()
  await page.mouse.move(-1, -1)
  const dark = await appearance()
  expect(dark[0]).toEqual(dark[1])
  expect(dark[0].thumb).not.toBe(initial[0].thumb)
  expect(dark[0].track).toBe('rgb(31, 35, 53)')
  expect(
    await table.evaluate(
      (element) =>
        getComputedStyle(element, '::-webkit-scrollbar-thumb').backgroundColor,
    ),
  ).toBe(dark[0].thumb)
})

test('sidebar wheel scrolling stays independent from page scrolling', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop', 'The sidebar is desktop-only.')
  await page.goto('components/button/')
  const sidebar = page.locator('.sidebar')
  await sidebar.hover()
  const initial = await sidebar.evaluate((element) => element.scrollTop)
  const pageTop = await page.evaluate(() => window.scrollY)
  await page.mouse.wheel(0, 240)
  await expect
    .poll(() => sidebar.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(initial)
  expect(await page.evaluate(() => window.scrollY)).toBe(pageTop)
})

test('horizontal table scrolling still works with the keyboard', async ({
  page,
}) => {
  await page.goto('components/table/')
  const table = page.locator('cad-table').first()
  await table.evaluate((element) => {
    ;(element as HTMLElement).style.maxWidth = '300px'
  })
  const scroller = table.locator('[part="base"]')
  await scroller.focus()
  expect(
    await scroller.evaluate(
      (element) => element.scrollWidth > element.clientWidth,
    ),
  ).toBe(true)
  await page.keyboard.press('ArrowRight')
  await expect
    .poll(() => scroller.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0)
  expect(
    await scroller.evaluate(
      (element) => getComputedStyle(element, '::-webkit-scrollbar').height,
    ),
  ).toBe('10px')
})

test('high contrast restores native platform scrollbars', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' })
  await page.goto('components/table/')
  await expect(page.locator('cad-table:not(:defined)')).toHaveCount(0)
  for (const target of [
    page.locator('html'),
    page.locator('.sidebar'),
    page.locator('cad-table [part="base"]').first(),
  ]) {
    await expect(target).toHaveCSS('scrollbar-color', 'auto')
    await expect(target).toHaveCSS('scrollbar-width', 'auto')
    expect(
      await target.evaluate(
        (element) => getComputedStyle(element, '::-webkit-scrollbar').width,
      ),
    ).toBe('auto')
  }
})

test('touch-first devices keep native scrollbar sizing', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  })
  try {
    const page = await context.newPage()
    await page.goto('components/table/')
    expect(
      await page.evaluate(() => matchMedia('(pointer: coarse)').matches),
    ).toBe(true)
    await expect(page.locator('cad-table:not(:defined)')).toHaveCount(0)
    for (const target of [
      page.locator('html'),
      page.locator('cad-table [part="base"]').first(),
    ]) {
      await expect(target).toHaveCSS('scrollbar-width', 'auto')
      expect(
        await target.evaluate(
          (element) => getComputedStyle(element, '::-webkit-scrollbar').width,
        ),
      ).toBe('auto')
    }
  } finally {
    await context.close()
  }
})
