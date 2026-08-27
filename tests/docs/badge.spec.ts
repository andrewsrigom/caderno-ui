import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('badge annotations match the fallback without a first-frame restyle', async ({
  page,
}) => {
  const appearance = () =>
    page.locator('main cad-badge').evaluateAll((elements) =>
      elements.map((element) => {
        const base =
          element.shadowRoot?.querySelector('[part="base"]') ?? element
        const style = getComputedStyle(base)
        const wash = getComputedStyle(base, '::after')
        const marker =
          element.querySelector('[slot="start"]') ??
          element.shadowRoot?.querySelector('[part="marker"]')
        const markerStyle = marker
          ? getComputedStyle(marker)
          : getComputedStyle(element, '::before')
        return {
          text: element.textContent?.trim(),
          color: style.color,
          font: style.fontFamily,
          size: style.fontSize,
          weight: style.fontWeight,
          border: style.borderWidth,
          radius: style.borderRadius,
          background: style.backgroundColor,
          shadow: style.boxShadow,
          height: base.getBoundingClientRect().height,
          wash: wash.backgroundColor,
          washDisplay: wash.display,
          markerColor: markerStyle.color,
          markerBackground: markerStyle.backgroundColor,
        }
      }),
    )
  await page.route('**/*.js*', (route) => route.abort())
  await page.goto('components/badge/')
  const fallback = await appearance()
  expect(fallback).toHaveLength(12)
  await page.unroute('**/*.js*')
  await page.reload()
  await expect(page.locator('cad-badge:not(:defined)')).toHaveCount(0)
  expect(await appearance()).toEqual(fallback)
  for (const badge of await page.locator('main cad-badge').all()) {
    const base = badge.locator('[part="base"]')
    await expect(base).toHaveCSS('border-width', '0px')
    await expect(base).toHaveCSS('box-shadow', 'none')
    await expect(base).toHaveCSS('transform', 'none')
    expect(
      await badge.evaluate((element) => (element as HTMLElement).tabIndex),
    ).toBe(-1)
    await expect(badge.locator('button, a, [role], [tabindex]')).toHaveCount(0)
  }
})

test('badge tones remain readable in both themes and high contrast', async ({
  page,
}, info) => {
  await page.goto('components/badge/')
  await expect(page.locator('cad-badge:not(:defined)')).toHaveCount(0)
  for (const theme of ['light', 'dark']) {
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    const audit = await new AxeBuilder({ page }).include('main').analyze()
    expect(audit.violations).toEqual([])
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)
    await page
      .getByRole('region', { name: 'Status tones', exact: true })
      .screenshot({ path: info.outputPath(`badge-tones-${theme}.png`) })
    if (theme === 'light')
      await page.getByRole('button', { name: 'Toggle color theme' }).click()
  }
  await page.emulateMedia({ forcedColors: 'active' })
  for (const base of await page.locator('main cad-badge [part="base"]').all()) {
    expect(
      await base.evaluate(
        (element) => getComputedStyle(element, '::after').display,
      ),
    ).toBe('none')
  }
  const forcedAudit = await new AxeBuilder({ page })
    .include('cad-badge')
    .analyze()
  expect(forcedAudit.violations).toEqual([])
})

test('quiet badges and custom visuals do not add a second marker', async ({
  page,
}) => {
  await page.goto('components/badge/')
  await expect(page.locator('cad-badge:not(:defined)')).toHaveCount(0)
  const quiet = page.getByRole('region', { name: 'Quiet labels', exact: true })
  for (const badge of await quiet.locator('cad-badge').all()) {
    await expect(badge.locator('[part="marker"]')).toBeVisible()
    await expect(badge.locator('[part="marker"]')).toHaveCSS(
      'background-color',
      'rgba(0, 0, 0, 0)',
    )
    expect(
      await badge
        .locator('[part="base"]')
        .evaluate((element) => getComputedStyle(element, '::after').display),
    ).toBe('none')
  }
  for (const badge of await page
    .getByRole('region', { name: 'Custom marker', exact: true })
    .locator('cad-badge')
    .all()) {
    await expect(badge.locator(':scope > [slot="start"]')).toBeVisible()
    await expect(badge.locator('[part="marker"]')).toBeHidden()
  }
})

test('badge examples and Show code describe the same tones, variants, and slots', async ({
  page,
}) => {
  await page.goto('components/badge/')
  await expect(page.locator('cad-badge:not(:defined)')).toHaveCount(0)
  for (const disclosure of await page.locator('[data-code-disclosure]').all()) {
    await disclosure.locator('summary').click()
    const source = await disclosure
      .locator('cad-code-block')
      .getAttribute('code')
    await expect(disclosure.locator('pre code')).toHaveText(source ?? '')
  }
  const examples = await page.evaluate(() => {
    const describe = (element: Element) => ({
      label: element.textContent?.replace(/\s+/g, ' ').trim(),
      tone: element.getAttribute('tone') ?? 'neutral',
      variant: element.getAttribute('variant') ?? 'solid',
      marker: element.querySelector('[slot="start"]')?.textContent ?? null,
    })
    const parser = new DOMParser()
    return {
      rendered: [...document.querySelectorAll('main cad-badge')].map(describe),
      source: [
        ...document.querySelectorAll('[data-code-disclosure] cad-code-block'),
      ].flatMap((block) =>
        [
          ...parser
            .parseFromString(block.getAttribute('code') ?? '', 'text/html')
            .querySelectorAll('cad-badge'),
        ].map(describe),
      ),
    }
  })
  expect(examples.source).toEqual(examples.rendered)
})
