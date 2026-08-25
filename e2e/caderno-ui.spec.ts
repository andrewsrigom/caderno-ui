import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { cadIconCategories } from '../packages/icons/src/index'

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
      'cad-accordion',
      'cad-accordion-item',
      'cad-alert',
      'cad-avatar',
      'cad-badge',
      'cad-blockquote',
      'cad-bookmark',
      'cad-breadcrumb',
      'cad-breadcrumb-item',
      'cad-button',
      'cad-callout',
      'cad-card',
      'cad-card-content',
      'cad-card-footer',
      'cad-card-header',
      'cad-card-kicker',
      'cad-card-title',
      'cad-chart',
      'cad-chart-item',
      'cad-checkbox',
      'cad-checklist',
      'cad-checklist-item',
      'cad-code-block',
      'cad-divider',
      'cad-empty-state',
      'cad-highlight',
      'cad-icon',
      'cad-input',
      'cad-kanban',
      'cad-kanban-card',
      'cad-kanban-column',
      'cad-link',
      'cad-modal',
      'cad-note',
      'cad-pagination',
      'cad-progress',
      'cad-radio',
      'cad-spinner',
      'cad-step',
      'cad-steps',
      'cad-sticker',
      'cad-tab-content',
      'cad-tab-trigger',
      'cad-tabs',
      'cad-tabs-list',
      'cad-table',
      'cad-table-cell',
      'cad-table-column',
      'cad-table-row',
      'cad-tape',
      'cad-textarea',
      'cad-toast',
      'cad-toast-host',
      'cad-tooltip',
    ].every((tagName) => customElements.get(tagName) !== undefined),
  )

  expect(definitions).toBe(true)
  expect(errors).toEqual([])
})

test('renders the extracted SeniorPath primitives with native semantics', async ({
  page,
}) => {
  await expect(
    page.locator('cad-button').first().getByRole('button'),
  ).toHaveAccessibleName('Save review')
  await expect(
    page.locator('cad-link').first().getByRole('link'),
  ).toHaveAttribute('href', '#charts')
  await expect(
    page.locator('cad-card[href="#charts"]').getByRole('link'),
  ).toBeVisible()
  await expect(
    page.locator('cad-callout').first().getByRole('complementary'),
  ).toBeVisible()
  await expect(
    page.locator('cad-divider').first().locator('[part="base"]'),
  ).toHaveAttribute('role', 'none')
  await expect(
    page.locator('cad-blockquote').getByRole('blockquote'),
  ).toBeVisible()
  await expect(
    page.locator('cad-kanban').getByRole('list', { name: 'Release readiness' }),
  ).toBeVisible()
})

test('exposes the complete typed icon palette', async ({ page }) => {
  const expectedNames = Object.values(cadIconCategories).flat()
  const palette = page.locator('[data-icon-palette]')
  const samples = palette.locator('.icon-sample')

  await expect(samples).toHaveCount(expectedNames.length)
  expect(
    await samples
      .locator('cad-icon')
      .evaluateAll((icons) => icons.map((icon) => icon.getAttribute('name'))),
  ).toEqual(expectedNames)
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
  await expect(
    page.locator('cad-tab-content[value="problem"]'),
  ).toHaveAttribute('active', '')
  await expect(
    page.locator('cad-tab-content[value="contract"]'),
  ).not.toHaveAttribute('active', '')
})

test('submits form-associated controls and coordinates radio groups', async ({
  page,
}) => {
  await page
    .getByRole('textbox', { name: 'Interview topic' })
    .fill('Distributed systems')
  await page
    .getByRole('textbox', { name: 'Review notes' })
    .fill('Prefer an explicit consistency trade-off.')
  await page
    .locator('cad-checkbox[label="Keyboard flow verified"] > [slot="label"]')
    .click()
  await page.locator('cad-radio[label="Algorithms"] > [slot="label"]').click()
  await page.getByRole('button', { name: 'Inspect FormData' }).click()

  const result = page.locator('[data-form-result]')
  await expect(result).toContainText('Distributed systems')
  await expect(result).toContainText('"track":"algorithms"')
  await expect(result).toContainText('"keyboard":"yes"')
})

test('coordinates native accordion disclosures and composed events', async ({
  page,
}) => {
  const first = page.locator('cad-accordion-item').first()
  const second = page.locator('cad-accordion-item').nth(1)
  await expect(first.locator('details')).toHaveAttribute('open', '')

  await second.getByText('When is the simple loop better?').click()

  await expect(second.locator('details')).toHaveAttribute('open', '')
  await expect(first.locator('details')).not.toHaveAttribute('open', '')
  await expect(page.locator('[data-event-log]')).toContainText(
    'cad-accordion-toggle',
  )
})

test('coordinates tooltip, modal, and hosted toast behavior', async ({
  page,
}) => {
  const tooltip = page.locator('cad-tooltip')
  const tooltipTrigger = tooltip.getByRole('button', { name: 'Inspect help' })
  await tooltipTrigger.focus()
  await expect(tooltip).toHaveAttribute('open', '')
  await expect(tooltip.getByRole('tooltip')).toHaveText(
    'Opens the typed public contract',
  )
  await tooltipTrigger.press('Escape')
  await expect(tooltip).not.toHaveAttribute('open', '')

  const modal = page.locator('cad-modal')
  await modal.getByRole('button', { name: 'Open review' }).click()
  await expect(modal.locator('dialog')).toHaveAttribute('open', '')
  await modal.getByRole('button', { name: 'Confirm review' }).click()
  await expect(modal.locator('dialog')).not.toHaveAttribute('open', '')
  await expect(page.locator('[data-event-log]')).toContainText(
    'cad-modal-close',
  )

  await page.getByRole('button', { name: 'Send hosted toast' }).click()
  const hostedToast = page.locator('cad-toast-host cad-toast')
  await expect(hostedToast).toContainText(
    'The hosted notification uses safe plain text.',
  )
  await hostedToast
    .getByRole('button', { name: 'Dismiss notification' })
    .click()
  await expect(page.locator('[data-event-log]')).toContainText(
    'cad-toast-dismiss',
  )
})

test('renders native navigation and semantic annotation primitives', async ({
  page,
}) => {
  const section = page.locator('[data-component="navigation-and-annotations"]')
  await expect(
    section.getByRole('navigation', { name: 'Laboratory path' }),
  ).toBeVisible()
  const currentBreadcrumb = section.locator('cad-breadcrumb-item[current]')
  await expect(currentBreadcrumb).toHaveText('Navigation')
  await expect(
    currentBreadcrumb.locator('[aria-current="page"]'),
  ).toBeAttached()
  await expect(
    section.getByRole('navigation', { name: 'Laboratory pages' }),
  ).toBeVisible()
  await expect(section.getByRole('link', { name: 'Page 5' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await expect(
    section.locator('cad-highlight').first().locator('mark'),
  ).toBeVisible()
  await expect(section.locator('cad-avatar [part="status"]')).toHaveAttribute(
    'aria-label',
    'Available',
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
    await expect(page.getByText('No matching decisions')).toBeVisible()
    await expect(page.getByText('Validate selective bundles')).toBeVisible()
    await expect(page.getByText('Save review')).toBeVisible()
    await expect(page.getByText('Static guidance')).toBeVisible()
    await expect(page.getByText('Interview topic')).toBeVisible()
    await expect(page.getByText('Why use a Map?')).toBeVisible()
    await expect(page.getByText('Publishing release')).toBeVisible()
    await expect(
      page.getByText('Confirm semantics, package exports'),
    ).toBeVisible()
    await expect(
      page.getByText('The public review is available locally.'),
    ).toBeVisible()
    await expect(page.getByText('contract explicit')).toBeVisible()
    await expect(page.getByText('Page 5 of 12')).toBeVisible()
    await expect(
      page
        .locator('[data-component="navigation-and-annotations"]')
        .getByText('Reviewed'),
    ).toBeVisible()
  })
})
