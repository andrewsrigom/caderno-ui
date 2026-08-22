import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('loads and registers the public custom elements without browser errors', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))

  await expect(
    page.getByRole('heading', { name: 'Interfaces that read like notes.' }),
  ).toBeVisible()

  const definitions = await page.evaluate(() =>
    [
      'cad-alert',
      'cad-badge',
      'cad-bookmark',
      'cad-chart',
      'cad-chart-item',
      'cad-icon',
      'cad-note',
      'cad-progress',
      'cad-tab',
      'cad-tabs',
    ].every((tagName) => customElements.get(tagName) !== undefined),
  )

  expect(definitions).toBe(true)
  expect(errors).toEqual([])
})

test('supports accessible tab keyboard navigation and composed events', async ({
  page,
}) => {
  const tabs = page.locator('cad-tabs')
  const contract = tabs.getByRole('tab', { name: 'Contract' })
  const problem = tabs.getByRole('tab', { name: 'Problem' })

  await expect(contract).toHaveAttribute('aria-selected', 'true')
  await contract.focus()
  await contract.press('ArrowLeft')

  await expect(problem).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('[data-event-log]')).toContainText('cad-tab-change')
  await expect(page.locator('cad-tab[name="problem"]')).not.toHaveAttribute(
    'hidden',
    '',
  )
  await expect(page.locator('cad-tab[name="contract"]')).toHaveAttribute(
    'hidden',
    '',
  )
})

test('persists bookmarks and restores them after navigation', async ({
  page,
}) => {
  const bookmark = page.locator('cad-bookmark')

  await bookmark.getByRole('button').click()
  await expect(bookmark).toHaveAttribute('bookmarked', '')
  await expect(page.locator('[data-event-log]')).toContainText(
    'cad-bookmark-change',
  )

  await page.reload()
  await expect(page.locator('cad-bookmark')).toHaveAttribute('bookmarked', '')
})

test('switches themes and exposes dismiss events outside the shadow root', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  await page
    .locator('cad-alert[heading="Check the trade-off"]')
    .getByRole('button')
    .click()
  await expect(page.locator('[data-event-log]')).toContainText('cad-dismiss')
})

test('has no automatically detectable accessibility violations', async ({
  page,
}) => {
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('keeps meaningful component content visible', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByText('Components should preserve meaning'),
    ).toBeVisible()
    await expect(
      page.getByText('Choose attributes, properties, slots, events'),
    ).toBeVisible()
    await expect(
      page.getByText('Keep data contracts declarative'),
    ).toBeVisible()
    await expect(page.getByText('Reading plan: 63%')).toBeVisible()
    await expect(page.getByText('Thu: 9')).toBeVisible()
  })
})
