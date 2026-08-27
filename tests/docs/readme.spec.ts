import { access, readFile } from 'node:fs/promises'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('README links point to existing files and built documentation routes', async ({
  request,
}) => {
  const readmeUrl = new URL('../../README.md', import.meta.url)
  const readme = await readFile(readmeUrl, 'utf8')
  const links = new Set(
    [...readme.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]),
  )
  const site = 'https://andrewsrigom.github.io/caderno-ui/'
  for (const link of links) {
    if (link.startsWith('./')) {
      await access(new URL(link, readmeUrl))
    } else if (link.startsWith(site)) {
      const response = await request.get(link.slice(site.length) || './')
      expect(response.status(), link).toBe(200)
    }
  }
})

test('the README example updates a note without storing it', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('examples/preview/')
  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Friday')
  await page
    .getByRole('textbox', { name: 'Note', exact: true })
    .fill('Bring the revised notes.')
  await page.getByRole('button', { name: 'Update preview' }).click()
  await expect(page.locator('#note-preview')).toHaveAttribute(
    'heading',
    'Friday',
  )
  await expect(page.locator('#note-body')).toHaveText(
    'Bring the revised notes.',
  )
  await expect(page.getByRole('status')).toHaveText('Preview updated.')
  await page.reload()
  await expect(page.locator('#note-preview')).toHaveAttribute(
    'heading',
    'For tomorrow',
  )
  await expect(page.locator('#note-body')).toContainText(
    'Review the search results.',
  )
  expect(errors).toEqual([])
})

test('the README example uses library styles and fits the viewport', async ({
  page,
}, info) => {
  await page.goto('examples/preview/')
  await expect(page.locator('cad-note:not(:defined)')).toHaveCount(0)
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light')
  expect(
    await page
      .locator('html')
      .evaluate((element) =>
        getComputedStyle(element).getPropertyValue('--cad-bg').trim(),
      ),
  ).toBe('#fff')
  await expect(page.locator('cad-list [part="marker"]')).toHaveText([
    '1',
    '2',
    '3',
  ])
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  const audit = await new AxeBuilder({ page }).analyze()
  expect(audit.violations).toEqual([])
  await page
    .locator('#preview')
    .screenshot({ path: info.outputPath('preview.png') })
})

test('the README example keeps useful content without JavaScript', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.route('**/*.js*', (route) => route.abort())
  await page.goto('examples/preview/')
  await expect(
    page.getByRole('heading', { name: 'Write a note' }),
  ).toBeVisible()
  await expect(page.locator('#note-body')).toContainText(
    'Review the search results.',
  )
  await expect(page.locator('cad-list')).toContainText('Compare the options.')
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light')
  expect(
    await page
      .locator('html')
      .evaluate((element) =>
        getComputedStyle(element).getPropertyValue('--cad-bg').trim(),
      ),
  ).toBe('#fff')
})
