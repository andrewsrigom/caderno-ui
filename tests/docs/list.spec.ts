import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('compact preserves blue handwriting, bullets, and circled numbers', async ({
  page,
}, info) => {
  await page.goto('components/list/')
  const simple = page.locator('cad-list[label="Compact checklist"]')
  const items = simple.locator('cad-list-item')
  await expect(simple.locator('[role="list"]')).toBeVisible()
  await expect(items).toHaveCount(3)
  await expect(simple.getByRole('listitem')).toHaveCount(3)
  await expect(
    simple.locator('a, button, [tabindex], [part="arrow"]'),
  ).toHaveCount(0)
  await expect(simple.locator('[part="marker"]')).toHaveCount(3)
  await expect(simple.locator('[part="list"]')).toHaveCSS('row-gap', '0px')
  for (const row of await simple.locator('[part="row"]').all()) {
    await expect(row).toHaveCSS('border-top-width', '0px')
    await expect(row).toHaveCSS('padding-top', '0px')
    await expect(row).not.toHaveCSS('cursor', 'pointer')
  }
  expect((await simple.boundingBox())!.height).toBeLessThan(90)
  await expect(
    page.locator('cad-list[label="Review order"] [part="marker"]'),
  ).toHaveText(['1', '2', '3'])
  const compactNumbers = page.locator('cad-list[label="Compact order"]')
  await expect(compactNumbers.locator('[part="marker"]')).toHaveText([
    '1',
    '2',
    '3',
  ])
  await expect(compactNumbers.locator('[part="marker"]').first()).toHaveCSS(
    'border-radius',
    '50%',
  )
  await expect(compactNumbers.locator('[part="row"]').first()).toHaveCSS(
    'border-top-width',
    '0px',
  )
  const defaults = page.locator('cad-list[label="Review checklist"]')
  await expect(compactNumbers.locator('[part="list"]')).toHaveCSS(
    'row-gap',
    await defaults
      .locator('[part="list"]')
      .evaluate((el) => getComputedStyle(el).rowGap),
  )
  const compactRows = await compactNumbers.locator('[part="marker"]').all()
  const firstCircle = (await compactRows[0].boundingBox())!
  const nextCircle = (await compactRows[1].boundingBox())!
  expect(nextCircle.y - firstCircle.y - firstCircle.height).toBeGreaterThan(9)
  await expect(defaults.locator('[part="row"]').first()).toHaveCSS(
    'border-top-style',
    'dashed',
  )
  await expect(defaults.locator('[part="marker"]').first()).toHaveCSS(
    'border-radius',
    '50%',
  )
  await expect(
    page.locator('cad-list[label="Review order"] [part="marker"]').first(),
  ).toHaveCSS('border-top-style', 'solid')
  const rowStyles = await defaults
    .locator('[part="row"]')
    .first()
    .evaluate((el) => ({
      font: getComputedStyle(el).fontFamily,
      color: getComputedStyle(el).color,
    }))
  expect(rowStyles.font).toContain('Caveat')
  await expect(simple.locator('[part="row"]').first()).toHaveCSS(
    'font-family',
    rowStyles.font,
  )
  await expect(simple.locator('[part="row"]').first()).toHaveCSS(
    'color',
    rowStyles.color,
  )
  for (const theme of ['light', 'dark']) {
    await page
      .locator('html')
      .evaluate(
        (element, value) => element.setAttribute('data-theme', value),
        theme,
      )
    const audit = await new AxeBuilder({ page })
      .include('.demo-canvas')
      .analyze()
    expect(audit.violations).toEqual([])
    await simple.screenshot({ path: info.outputPath(`list-${theme}.png`) })
    await compactNumbers.screenshot({
      path: info.outputPath(`numbered-${theme}.png`),
    })
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})

test('composed controls retain native keyboard navigation and button actions', async ({
  page,
}) => {
  await page.goto('components/list/')
  const related = page.locator('cad-list[label="Related documentation"]')
  const nativeLink = related.getByRole('link', {
    name: 'Typography',
    exact: true,
  })
  await expect(related.getByRole('link')).toHaveCount(3)
  for (const item of await related.locator('cad-list-item').all()) {
    expect(
      await item.evaluate((element) => element.shadowRoot?.querySelector('a')),
    ).toBeNull()
  }
  await expect(related.locator('[part="arrow"]')).toHaveCount(3)
  const row = related.locator('[part="row"]').first()
  await expect(row).toHaveCSS('border-top-style', 'dashed')
  const rowBox = (await row.boundingBox())!
  const linkBox = (await nativeLink.boundingBox())!
  expect(linkBox.width).toBeGreaterThan(rowBox.width - 4)
  expect(linkBox.height).toBeGreaterThan(rowBox.height - 4)
  await nativeLink.focus()
  await expect(nativeLink).toBeFocused()
  await expect(nativeLink).toHaveCSS('outline-style', 'dashed')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/typography\/$/)
  await page.goto('components/list/')
  const action = page.getByRole('button', { name: 'Add note', exact: true })
  await action.focus()
  await page.keyboard.press('Space')
  await expect(page.locator('#list-action-status')).toHaveText('Note added.')
  await expect(page).toHaveURL(/\/components\/list\/$/)
  await expect(
    page.getByRole('button', { name: 'Publish review', exact: true }),
  ).toBeDisabled()
  await expect(
    page.locator('cad-list[label="Review actions"] [part="arrow"]'),
  ).toHaveCount(2)

  // Hit the decorative arrow: the full-size native anchor must receive the click.
  await related
    .locator('[part="row"]')
    .first()
    .click({ position: { x: rowBox.width - 18, y: rowBox.height / 2 } })
  await expect(page).toHaveURL(/\/typography\/$/)
})

test('Show code describes the exact three-item preview', async ({ page }) => {
  await page.goto('components/list/')
  const source = page.locator('[data-code-disclosure]').nth(2)
  await source.locator('summary').click()
  const code = await source.locator('cad-code-block').getAttribute('code')
  expect(code).toContain('<cad-list label="Compact checklist" compact>')
  expect(code?.match(/<cad-list-item>/g)).toHaveLength(3)
  expect(code).not.toContain('href=')
  for (const text of await page
    .locator('cad-list[label="Compact checklist"] cad-list-item')
    .allTextContents()) {
    expect(code).toContain(text.trim())
  }
})

test('compact markers and full-row anchors remain usable before registration', async ({
  page,
}) => {
  await page.route('**/*.js*', (route) => route.abort())
  await page.goto('components/list/')
  const simple = page.locator('cad-list[label="Compact checklist"]')
  await expect(simple).toBeVisible()
  await expect(simple).toHaveCSS('row-gap', '0px')
  await expect(simple.locator('cad-list-item').first()).toHaveCSS(
    'border-top-width',
    '0px',
  )
  const before = await simple.boundingBox()
  expect(before!.height).toBeLessThan(90)
  const link = page
    .locator('cad-list[label="Related documentation"]')
    .getByRole('link', { name: 'Typography', exact: true })
  await link.click()
  await expect(page).toHaveURL(/\/typography\/$/)
  await expect(page.locator('article.cad-prose ul')).toHaveCSS(
    'border-top-style',
    'dashed',
  )
  await page.unroute('**/*.js*')
  await page.goto('components/list/')
  await expect(simple.locator('[role="list"]')).toBeVisible()
  expect(
    Math.abs((await simple.boundingBox())!.height - before!.height),
  ).toBeLessThan(2)
})
