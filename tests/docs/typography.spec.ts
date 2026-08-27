import { expect, test } from '@playwright/test'

test('public text roles and editorial content share typography without component scripts', async ({
  page,
}) => {
  await page.route('**/*.js*', (route) => route.abort())
  await page.goto('typography/')
  await page.evaluate(() => document.fonts.ready)
  expect(
    await page.evaluate(() =>
      [...document.fonts].some(
        (font) => font.family === 'Caveat' && font.status === 'loaded',
      ),
    ),
  ).toBe(true)
  const roles = page.locator('.type-specimens')
  await expect(roles.locator('.cad-type-heading')).toBeVisible()
  await expect(roles.locator('.cad-type-title')).toBeVisible()
  const title = await roles.locator('.cad-type-title').evaluate((element) => ({
    font: getComputedStyle(element).font,
    color: getComputedStyle(element).color,
  }))
  await expect(page.locator('article.cad-prose h2')).toHaveCSS(
    'font',
    title.font,
  )
  await expect(page.locator('article.cad-prose h2')).toHaveCSS(
    'color',
    title.color,
  )
  await expect(page.locator('article.cad-prose ul')).toHaveCSS(
    'list-style-type',
    'disc',
  )
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.unroute('**/*.js*')
  await page.reload()
  await expect(roles.locator('.cad-type-title')).toHaveCSS('font', title.font)
})
