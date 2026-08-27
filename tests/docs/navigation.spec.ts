import { expect, test } from '@playwright/test'

test.beforeEach(() => {
  test.skip(
    test.info().project.name !== 'desktop',
    'The sidebar is desktop-only.',
  )
})

test('sidebar keeps its scroll position across links, reload, and history', async ({
  page,
}) => {
  await page.goto('components/button/')
  const sidebar = page.locator('.sidebar')
  const tabsLink = sidebar.getByRole('link', { name: 'Tabs', exact: true })
  await tabsLink.scrollIntoViewIfNeeded()
  const tabsPosition = await sidebar.evaluate((element) => element.scrollTop)
  expect(tabsPosition).toBeGreaterThan(0)

  await tabsLink.click()
  await expect(page).toHaveURL(/\/components\/tabs\/$/)
  await expect
    .poll(() => sidebar.evaluate((element) => element.scrollTop))
    .toBeCloseTo(tabsPosition, 0)
  await expect(sidebar.locator('[aria-current="page"]')).toHaveText('Tabs')
  await expect(sidebar.locator('[aria-current="page"]')).toBeInViewport()

  const tableLink = sidebar.getByRole('link', { name: 'Table', exact: true })
  await tableLink.scrollIntoViewIfNeeded()
  const leavingTabsPosition = await sidebar.evaluate(
    (element) => element.scrollTop,
  )
  await tableLink.click()
  await expect(page).toHaveURL(/\/components\/table\/$/)
  await expect
    .poll(() => sidebar.evaluate((element) => element.scrollTop))
    .toBeCloseTo(leavingTabsPosition, 0)

  // A history entry remembers its own position, not the last page's position.
  await sidebar.evaluate((element) => {
    element.scrollTop -= 140
  })
  const tablePosition = await sidebar.evaluate((element) => element.scrollTop)
  expect(tablePosition).not.toBe(leavingTabsPosition)
  await page.reload()
  await expect
    .poll(() => sidebar.evaluate((element) => element.scrollTop))
    .toBeCloseTo(tablePosition, 0)

  await page.goBack()
  await expect(page).toHaveURL(/\/components\/tabs\/$/)
  await expect
    .poll(() => sidebar.evaluate((element) => element.scrollTop))
    .toBeCloseTo(leavingTabsPosition, 0)
  await page.goForward()
  await expect(page).toHaveURL(/\/components\/table\/$/)
  await expect
    .poll(() => sidebar.evaluate((element) => element.scrollTop))
    .toBeCloseTo(tablePosition, 0)
})

test('sidebar restores before the component modules load', async ({ page }) => {
  await page.goto('components/table/')
  const sidebar = page.locator('.sidebar')
  const tooltipLink = sidebar.getByRole('link', {
    name: 'Tooltip',
    exact: true,
  })
  await tooltipLink.scrollIntoViewIfNeeded()
  const position = await sidebar.evaluate((element) => element.scrollTop)
  await page.route('**/*.js*', (route) => route.abort())
  await tooltipLink.click()
  await expect(page).toHaveURL(/\/components\/tooltip\/$/)
  expect(await page.locator('cad-header:not(:defined)').count()).toBe(1)
  await expect
    .poll(() => sidebar.evaluate((element) => element.scrollTop))
    .toBeCloseTo(position, 0)
  await expect(sidebar.locator('[aria-current="page"]')).toBeInViewport()
})

test('a deep link reveals the selected item without scrolling the page', async ({
  page,
}) => {
  await page.goto('components/tooltip/')
  const sidebar = page.locator('.sidebar')
  await expect(sidebar.locator('[aria-current="page"]')).toHaveText('Tooltip')
  await expect(sidebar.locator('[aria-current="page"]')).toBeInViewport()
  expect(
    await sidebar.evaluate((element) => element.scrollTop),
  ).toBeGreaterThan(0)
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  await page.getByRole('link', { name: 'Caderno UI home', exact: true }).click()
  await expect(sidebar.locator('[aria-current="page"]')).toHaveText(
    'Introduction',
  )
  await expect(sidebar.locator('[aria-current="page"]')).toBeInViewport()
})

test('blocked storage does not break navigation or hide the selected link', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', {
      get() {
        throw new DOMException('Blocked', 'SecurityError')
      },
    })
  })
  await page.goto('components/tabs/')
  const sidebar = page.locator('.sidebar')
  await expect(sidebar.locator('[aria-current="page"]')).toBeInViewport()
  await sidebar.getByRole('link', { name: 'Table', exact: true }).click()
  await expect(page).toHaveURL(/\/components\/table\/$/)
  await expect(sidebar.locator('[aria-current="page"]')).toBeInViewport()
  expect(errors).toEqual([])
})

for (const invalidState of ['malformed JSON', 'invalid offset']) {
  test(`sidebar ignores ${invalidState} in storage`, async ({ page }) => {
    await page.goto('components/tabs/')
    const key = await page
      .locator('.sidebar')
      .getAttribute('data-scroll-storage-key')
    // Inject into the arriving page, after the departing page's save handler.
    await page.addInitScript(
      ({ key, invalidState }) => {
        sessionStorage.setItem(
          key!,
          invalidState === 'malformed JSON'
            ? '{invalid'
            : JSON.stringify({
                latest: 'nope',
                pages: { [location.pathname]: -10 },
              }),
        )
      },
      { key, invalidState },
    )
    await page.reload()
    await expect(
      page.locator('.sidebar [aria-current="page"]'),
    ).toBeInViewport()
  })
}
