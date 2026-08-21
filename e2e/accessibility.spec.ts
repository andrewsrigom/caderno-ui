import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

for (const component of ['alerts', 'bookmark', 'tabs']) {
  test(`${component} has no detectable accessibility violations in isolation`, async ({
    page,
  }) => {
    const selector = `[data-component="${component}"]`
    const results = await new AxeBuilder({ page }).include(selector).analyze()
    expect(results.violations).toEqual([])
  })
}

test('interactive states expose names, roles, states, and relationships', async ({
  page,
}) => {
  const bookmark = page.locator('cad-bookmark')
  const bookmarkButton = bookmark.getByRole('button', {
    name: 'Save laboratory',
  })
  await expect(bookmarkButton).toHaveAttribute('aria-pressed', 'false')
  await bookmarkButton.click()
  await expect(
    bookmark.getByRole('button', { name: 'Remove bookmark' }),
  ).toHaveAttribute('aria-pressed', 'true')

  const tabs = page.locator('cad-tabs')
  const selectedTab = tabs.getByRole('tab', { name: 'Contract' })
  const panelId = await selectedTab.evaluate(
    (element) => element.ariaControlsElements?.[0]?.id,
  )
  expect(panelId).toBeTruthy()
  const controlledPanel = page.locator(`#${panelId}`)
  await expect(selectedTab).toHaveAttribute('aria-selected', 'true')
  await expect(controlledPanel).toHaveAttribute('aria-label', 'Contract')

  await expect(
    page.locator('cad-alert[variant="info"]').getByRole('status'),
  ).toBeVisible()
  await expect(
    page.locator('cad-alert[variant="danger"]').getByRole('alert'),
  ).toBeVisible()

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('all interactive component controls are reachable by keyboard', async ({
  page,
}) => {
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Toggle theme' })).toBeFocused()

  for (let index = 0; index < 3; index += 1) await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: 'Save laboratory' }),
  ).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('tab', { name: 'Contract' })).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Proof' })).toBeFocused()
})
