import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

for (const component of [
  'actions',
  'accordion',
  'alerts',
  'badges-and-notes',
  'bookmark',
  'cards-and-callouts',
  'charts',
  'dividers',
  'editorial-patterns',
  'form-controls',
  'feedback',
  'icons',
  'navigation-and-annotations',
  'planning-patterns',
  'progress',
  'skeleton',
  'tabs',
  'tables',
]) {
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

  const progress = page.getByRole('progressbar', { name: 'Uploading file' })
  await expect(progress).toHaveAttribute('value', '72')
  await expect(progress).toHaveAttribute('max', '100')

  const slider = page.getByRole('slider', { name: 'Review depth' })
  await expect(slider).toHaveAttribute('min', '0')
  await expect(slider).toHaveAttribute('max', '100')
  await expect(slider).toHaveValue('64')

  const autoSave = page.getByRole('switch', { name: 'Auto-save' })
  await expect(autoSave).toBeChecked()
  await autoSave.focus()
  await autoSave.press('Space')
  await expect(autoSave).not.toBeChecked()
  await autoSave.press('Space')
  await expect(autoSave).toBeChecked()

  const chartTable = page
    .locator('cad-chart[heading="Notes reviewed"]')
    .getByRole('table', { name: 'Notes reviewed' })
  await expect(chartTable.getByRole('row')).toHaveCount(6)
  await expect(chartTable.getByRole('row', { name: 'Thu 9' })).toBeAttached()

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('all interactive component controls are reachable by keyboard', async ({
  page,
}) => {
  const header = page.locator('cad-header[data-component="header"]')
  const headerSequence = [
    header.getByRole('link', { name: 'Caderno UI laboratory home' }),
    header.getByRole('link', { name: 'Overview' }),
    header.getByRole('link', { name: 'Components' }),
    header.getByRole('link', { name: 'Charts' }),
    header.getByRole('button', { name: 'Search laboratory' }),
    header.getByRole('button', { name: 'Saved items' }),
    header.getByRole('button', { name: 'Account: Andrews' }),
    page.getByRole('button', { name: 'Toggle theme' }),
  ]

  for (const control of headerSequence) {
    await page.keyboard.press('Tab')
    await expect(control).toBeFocused()
  }

  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Save review' })).toBeFocused()

  for (let index = 0; index < 10; index += 1) await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: 'Save laboratory' }),
  ).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('textbox', { name: 'Interview topic' }),
  ).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('textbox', { name: 'Contact email' }),
  ).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('textbox', { name: 'Review notes' }),
  ).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('slider', { name: 'Review depth' })).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('switch', { name: 'Auto-save' })).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('checkbox', { name: 'Public API reviewed' }),
  ).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('checkbox', { name: /Keyboard flow verified/ }),
  ).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('radio', { name: 'Architecture' })).toBeFocused()

  for (const label of ['Algorithms', 'Behavioral']) {
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('radio', { name: label })).toBeFocused()
  }

  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: 'Inspect FormData' }),
  ).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Reset' })).toBeFocused()

  for (const [index] of [
    'Why use a Map?',
    'When is the simple loop better?',
    'What belongs in the explanation?',
  ].entries()) {
    await page.keyboard.press('Tab')
    await expect(
      page.locator('cad-accordion-item').nth(index).locator('summary'),
    ).toBeFocused()
  }

  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Inspect help' })).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Open review' })).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: 'Open task details' }),
  ).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: 'Release context' }),
  ).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: 'Dismiss notification' }),
  ).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: 'Send hosted toast' }),
  ).toBeFocused()

  const navigationLinks = page.locator(
    '[data-component="navigation-and-annotations"] a',
  )
  await expect(navigationLinks).toHaveCount(9)
  for (let index = 0; index < 9; index += 1) {
    await page.keyboard.press('Tab')
    await expect(navigationLinks.nth(index)).toBeFocused()
  }

  await page.keyboard.press('Tab')
  await expect(page.getByRole('tab', { name: 'Contract' })).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Proof' })).toBeFocused()
})
