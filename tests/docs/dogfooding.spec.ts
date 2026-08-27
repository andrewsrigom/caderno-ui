import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

for (const systemTheme of ['light', 'dark'] as const) {
  test(`white is the default with a ${systemTheme} system preference`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: systemTheme })
    await page.route('**/*.js*', (route) => route.abort())
    await page.goto('')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)',
    )
    // Check the token sheet without the site's explicit theme attribute.
    await page
      .locator('html')
      .evaluate((element) => element.removeAttribute('data-theme'))
    await expect(page.locator('html')).toHaveCSS('color-scheme', 'light')
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)',
    )
    await page
      .locator('html')
      .evaluate((element) => element.setAttribute('data-theme', 'dark'))
    await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark')
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(26, 27, 38)',
    )
    await page.unroute('**/*.js*')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await page.goto('demo/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)',
    )
  })
}

test('guides keep readable headings and fit the viewport', async ({ page }) => {
  for (const route of [
    'getting-started/',
    'theming/',
    'typography/',
    'composition/',
    'integrations/',
    'motion/',
  ]) {
    await page.goto(route)
    await expect(page.locator('main > header h1')).toHaveCount(1)
    expect(await page.locator('main > header h1').innerText()).toBeTruthy()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true)
  }
  await page.goto('theming/')
  for (const token of await page
    .locator('.token-swatch code')
    .allTextContents()) {
    expect(
      await page
        .locator('html')
        .evaluate(
          (element, name) =>
            getComputedStyle(element).getPropertyValue(name).trim(),
          token,
        ),
      token,
    ).not.toBe('')
  }
})

test('shell buttons keep their appearance before and after registration', async ({
  page,
}) => {
  await page.route('**/*.js*', (route) => route.abort())
  await page.goto('')
  const readAppearance = () =>
    page
      .locator('.docs-actions cad-button, .hero-actions cad-button')
      .evaluateAll((elements) =>
        elements.map((element) => {
          const base =
            element.shadowRoot?.querySelector('[part="base"]') ?? element
          const style = getComputedStyle(base)
          return {
            background: style.backgroundColor,
            color: style.color,
            font: style.fontFamily,
            weight: style.fontWeight,
            border: style.borderTopStyle,
          }
        }),
      )
  const fallback = await readAppearance()
  expect(fallback.length).toBe(4)
  await page.unroute('**/*.js*')
  await page.reload()
  await expect(
    page.locator('.hero-actions cad-button:not(:defined)'),
  ).toHaveCount(0)
  expect(await readAppearance()).toEqual(fallback)
})

test('public Astro adapters preserve slots, booleans, and shared shell semantics', async ({
  page,
}, info) => {
  await page.goto('components/button/')
  const header = page.locator('cad-header.docs-header')
  await expect(header).not.toHaveAttribute('open')
  await expect(header.locator(':scope > [slot="brand"]')).toContainText(
    'Caderno UI',
  )
  await expect(header.locator('[part="brand"]')).toBeVisible()
  await expect(header.locator(':scope > [slot="actions"]')).toContainText(
    'Theme',
  )
  await expect(header.locator('[part="navigation"]')).toBeHidden()
  await expect(header.locator('[part="menu-toggle"]')).toBeHidden()
  await expect(header.locator('cad-button [slot="start"]')).toHaveCount(1)
  await expect(page.locator('cad-footer.docs-footer [part="top"]')).toBeHidden()
  await expect(
    page.locator('cad-footer.docs-footer > [slot="bottom"]'),
  ).toContainText('MIT licensed')
  await expect(
    page.locator('cad-footer.docs-footer [part="bottom"]'),
  ).toBeVisible()
  await expect(
    page
      .getByRole('region', { name: 'API reference: <cad-button>', exact: true })
      .getByRole('table', { name: 'Attributes', exact: true })
      .locator('td code')
      .first(),
  ).toHaveText('disabled')
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
  if (info.project.name === 'desktop') {
    await expect(page.locator('.sidebar [aria-current="page"]')).toHaveCount(1)
    await expect(page.locator('.sidebar [aria-current="page"]')).toHaveText(
      'Button',
    )
  }
  const audit = await new AxeBuilder({ page })
    .include('.docs-header')
    .include('.docs-footer')
    .analyze()
  expect(audit.violations).toEqual([])
  await page.screenshot({
    path: info.outputPath('documentation.png'),
    fullPage: true,
  })
})

test('API table captions are concise and headers form one solid band', async ({
  page,
}, info) => {
  await page.route('**/*.js*', (route) => route.abort())
  await page.goto('components/icon/')
  const api = page.getByRole('region', {
    name: 'API reference: <cad-icon>',
    exact: true,
  })
  const fallbackColumn = api.locator('cad-table-column').first()
  const fallback = await fallbackColumn.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    color: getComputedStyle(element).color,
    label: getComputedStyle(element, '::before').content,
  }))
  expect(fallback.label).toContain('Name')
  await page.unroute('**/*.js*')
  await page.reload()
  const attributes = api.getByRole('table', {
    name: 'Attributes',
    exact: true,
  })
  await expect(attributes).toBeVisible()
  const header = attributes.getByRole('columnheader').first()
  await expect(header).toHaveCSS('color', fallback.color)
  await expect(header).toHaveCSS('background-color', fallback.background)
  await expect(api.locator('caption')).toHaveText([
    'Attributes',
    'Properties',
    'CSS Parts',
    'CSS custom properties',
  ])
  await attributes.screenshot({ path: info.outputPath('api-table.png') })

  await page.goto('components/table/')
  for (const theme of ['light', 'dark']) {
    await page.locator('html').evaluate((element, value) => {
      element.setAttribute('data-theme', value)
    }, theme)
    const tables = page.locator('cad-table')
    await expect(tables.first().locator('th').first()).toBeVisible()
    for (const table of await tables.all()) {
      const headers = table.locator('th')
      const appearance = await headers.evaluateAll((elements) =>
        elements.map((element) => {
          const style = getComputedStyle(element)
          return {
            background: style.backgroundColor,
            backgroundImage: style.backgroundImage,
            color: style.color,
            border: style.borderWidth,
            underline: getComputedStyle(element, '::after').content,
          }
        }),
      )
      expect(appearance.length).toBeGreaterThan(0)
      for (const cell of appearance) {
        expect(cell).toEqual(appearance[0])
        expect(cell.background).not.toBe('rgba(0, 0, 0, 0)')
        expect(cell.backgroundImage).toBe('none')
        expect(cell.border).toBe('0px')
        expect(cell.underline).toBe('none')
      }
      await expect(
        table.locator('tbody tr').first().locator('td').first(),
      ).toHaveCSS('border-top-width', '0px')
    }
    const audit = await new AxeBuilder({ page }).include('cad-table').analyze()
    expect(audit.violations).toEqual([])
    await tables.first().screenshot({
      path: info.outputPath(`table-${theme}.png`),
    })
  }
  if (info.project.name === 'mobile') {
    const scrollArea = page.locator('cad-table [part="base"]').first()
    await scrollArea.focus()
    await expect(scrollArea).toHaveCSS('outline-style', 'dashed')
    await page.keyboard.press('ArrowRight')
    await expect
      .poll(() => scrollArea.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(0)
  }
})

test('tabs share one neutral/blue palette before and after upgrade and remain keyboard operable', async ({
  page,
}, info) => {
  await page.route('**/*.js*', (route) => route.abort())
  await page.goto('components/tabs/')
  const tabs = page.locator('cad-tabs').first()
  const triggers = tabs.locator('cad-tab-trigger')
  const readAppearance = () =>
    triggers.evaluateAll((elements) =>
      elements.map((element) => {
        const control = element.shadowRoot?.querySelector('button') ?? element
        const style = getComputedStyle(control)
        return {
          background: style.backgroundColor,
          color: style.color,
          weight: style.fontWeight,
        }
      }),
    )
  const initial = await readAppearance()
  expect(initial).toHaveLength(4)
  expect(initial[0]).toMatchObject({
    background: 'rgb(0, 91, 172)',
    color: 'rgb(255, 255, 255)',
  })
  for (const appearance of initial.slice(1)) {
    expect(appearance).toMatchObject({
      background: 'rgb(255, 255, 255)',
      color: 'rgb(0, 91, 172)',
    })
  }
  await page.unroute('**/*.js*')
  await page.reload()
  const overview = tabs.getByRole('tab', { name: 'Overview', exact: true })
  const evidence = tabs.getByRole('tab', { name: 'Evidence', exact: true })
  await expect(overview).toHaveAttribute('aria-selected', 'true')
  expect(await readAppearance()).toEqual(initial)
  await expect(triggers.first().locator('cad-icon')).toHaveCSS(
    'color',
    'rgb(255, 255, 255)',
  )
  await evidence.click()
  await expect(evidence).toHaveCSS('background-color', 'rgb(0, 91, 172)')
  await expect(evidence).toHaveCSS('color', 'rgb(255, 255, 255)')
  await overview.hover()
  await expect(overview).not.toHaveCSS('background-color', 'rgb(0, 91, 172)')
  await expect(evidence).toHaveAttribute('aria-selected', 'true')
  await evidence.focus()
  await page.keyboard.press('ArrowRight')
  await expect(
    tabs.getByRole('tab', { name: 'Notes', exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Home')
  await expect(overview).toBeFocused()
  await expect(overview).toHaveCSS('outline-style', 'dashed')
  await expect(overview).toHaveCSS('outline-color', 'rgb(255, 255, 255)')
  await page.keyboard.press('End')
  const rollout = tabs.getByRole('tab', { name: 'Rollout', exact: true })
  await expect(rollout).toBeFocused()
  await expect(
    tabs.getByRole('tabpanel', { name: 'Rollout', exact: true }),
  ).toBeVisible()
  await page.keyboard.press('Home')
  await page.mouse.move(0, 0)
  for (const theme of ['light', 'dark']) {
    await page
      .locator('html')
      .evaluate(
        (element, value) => element.setAttribute('data-theme', value),
        theme,
      )
    const audit = await new AxeBuilder({ page }).include('cad-tabs').analyze()
    expect(audit.violations).toEqual([])
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)
    await tabs.screenshot({ path: info.outputPath(`tabs-${theme}.png`) })
  }
  await page.emulateMedia({ forcedColors: 'active' })
  await expect(overview).toHaveAttribute('aria-selected', 'true')
  await expect(overview).toHaveCSS('outline-style', 'solid')
})

test('Show code is initially closed, keyboard operable, and copies the exact displayed source', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: (text: string) => {
          document.documentElement.setAttribute('data-copied-source', text)
          return Promise.resolve()
        },
      },
    })
  })
  await page.goto('components/button/')
  const disclosure = page.locator('[data-code-disclosure]').first()
  await expect(disclosure).not.toHaveAttribute('open')
  await expect(disclosure.locator('cad-code-block')).toBeHidden()
  await disclosure.locator('summary').focus()
  await page.keyboard.press('Enter')
  await expect(disclosure).toHaveAttribute('open', '')
  await expect(disclosure.locator('summary')).toHaveText('Hide code')
  const block = disclosure.locator('cad-code-block')
  const source = await block.getAttribute('code')
  await block.getByRole('button', { name: 'Copy', exact: true }).click()
  await expect(block.getByRole('status')).toHaveText('Copied')
  await expect(page.locator('html')).toHaveAttribute(
    'data-copied-source',
    source ?? '',
  )
  await expect(block.locator('pre code')).toHaveText(source ?? '')
  await disclosure.locator('summary').click()
  await expect(block).toBeHidden()
})

test('clipboard denial is visible and does not break the page', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () => {
          return Promise.reject(new Error('Clipboard denied'))
        },
      },
    }),
  )
  await page.goto('components/code-block/')
  const block = page.locator('.demo-canvas cad-code-block').first()
  await block.getByRole('button', { name: 'Copy', exact: true }).click()
  await expect(block.getByRole('status')).toHaveText('Copy failed')
  await expect(block.getByRole('button', { name: 'Copy failed' })).toBeEnabled()
})

test('theme preference survives a reload without changing the shared shell', async ({
  page,
}) => {
  await page.goto('')
  const initial = await page.locator('html').getAttribute('data-theme')
  const next = initial === 'light' ? 'dark' : 'light'
  await page.getByRole('button', { name: 'Toggle color theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', next)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', next)
  await expect(
    page.getByRole('banner', { name: 'Caderno UI', exact: true }),
  ).toBeVisible()
})

test('mobile drawer traps focus, restores it on Escape, and navigates', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'mobile')
  await page.goto('')
  const trigger = page.getByRole('button', { name: 'Open documentation menu' })
  await trigger.click()
  const drawer = page.getByRole('dialog', {
    name: 'Documentation',
    exact: true,
  })
  const drawerHost = page.locator('cad-drawer.docs-mobile-menu')
  await expect(drawer).toBeVisible()
  await expect(
    drawerHost.getByRole('navigation', { name: 'Mobile documentation' }),
  ).toBeVisible()
  await drawer.getByRole('button', { name: 'Close documentation menu' }).focus()
  await page.keyboard.press('Shift+Tab')
  await expect(
    drawerHost.getByRole('link', { name: 'Tooltip', exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await drawerHost.getByRole('link', { name: 'Chart', exact: true }).click()
  await expect(page).toHaveURL(/\/components\/chart\/$/)
  await expect(page.locator('main cad-chart[type="bar"]')).not.toHaveCount(0)
  await expect(page.locator('main cad-chart[type="line"]')).not.toHaveCount(0)
  await expect(page.locator('main cad-chart[type="donut"]')).not.toHaveCount(0)
})

test('documentation remains navigable and readable without JavaScript', async ({
  browser,
  baseURL,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: info.project.use.viewport,
  })
  const page = await context.newPage()
  await page.goto(`${baseURL}components/button/`)
  const navigation = page.getByRole('navigation', {
    name:
      info.project.name === 'mobile' ? 'Mobile documentation' : 'Documentation',
    exact: true,
  })
  await expect(navigation).toBeVisible()
  await expect(
    navigation.getByRole('link', { name: 'Button', exact: true }),
  ).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('.api-reference')).toContainText('disabled')
  await navigation
    .getByRole('link', { name: 'Typography', exact: true })
    .click()
  await expect(page).toHaveURL(/\/typography\/$/)
  await context.close()
})

test('every catalog page registers the elements it renders, without the root bundle', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop')
  test.setTimeout(120000)
  await page.goto('components/')
  const urls = await page
    .locator('.sidebar a')
    .evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).href),
    )
  for (const url of urls) {
    await page.goto(url)
    await expect
      .poll(() =>
        page.evaluate(() =>
          Array.from(document.querySelectorAll('*'))
            .filter(
              (element) =>
                element.localName.startsWith('cad-') &&
                !customElements.get(element.localName),
            )
            .map((element) => element.localName),
        ),
      )
      .toEqual([])
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(overflow, url).toBe(false)
  }
})
