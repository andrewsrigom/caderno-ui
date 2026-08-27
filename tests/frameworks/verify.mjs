/* global document, window, StorageEvent */
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium, firefox, webkit, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

export async function verifyFrameworks({ evidence, next }) {
  await mkdir(evidence, { recursive: true })
  const engines = process.env.CADERNO_TEST_BROWSER
    ? {
        [process.env.CADERNO_TEST_BROWSER]: { chromium, firefox, webkit }[
          process.env.CADERNO_TEST_BROWSER
        ],
      }
    : { chromium, firefox, webkit }
  for (const [name, engine] of Object.entries(engines)) {
    if (!engine) throw new Error(`Unknown browser: ${name}`)
    const browser = await engine.launch()
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    })
    const contexts = [context]
    let page = await context.newPage()
    const errors = []
    const observeErrors = (observed) => {
      observed.on('pageerror', (error) => errors.push(error.message))
      observed.on('console', (message) => {
        if (message.type() === 'error')
          errors.push(`${observed.url()}: ${message.text()}`)
      })
    }
    observeErrors(page)
    try {
      for (const framework of ['react', 'vue', 'svelte']) {
        await page.goto(`http://127.0.0.1:5192/${framework}/`)
        const title = page.getByRole('textbox', { name: 'Title', exact: true })
        await expect(title).toHaveValue('Original')
        await title.fill('Edited note')
        if (framework === 'react')
          await expect(page.getByLabel('Changes', { exact: true })).toHaveText(
            '0',
          )
        await expect(page.getByLabel('Value', { exact: true })).toHaveText(
          'Edited note',
        )
        await page.getByRole('button', { name: 'Set external value' }).click()
        await expect(title).toHaveValue('External')
        if (framework === 'react')
          await expect(page.getByLabel('Changes', { exact: true })).toHaveText(
            '1',
          )
        await page.locator('cad-checkbox').locator('label').click()
        await expect(
          page.getByRole('checkbox', { name: 'Reviewed' }),
        ).toBeChecked()
        if (framework === 'react')
          await expect(page.getByLabel('Checkbox input states')).toHaveText(
            '[true]',
          )
        if (framework !== 'react')
          await expect(
            page
              .getByLabel('Reviewed', { exact: true })
              .filter({ hasText: 'true' }),
          ).toHaveText('true')
        const items = page.locator('cad-list').first().locator('cad-list-item')
        await expect(items.first().locator('[part="arrow"]')).toHaveCount(0)
        await expect(items.last().locator('[part="arrow"]')).toHaveCount(1)
        await page.getByRole('link', { name: 'Open notes' }).click()
        if (framework === 'react') {
          await expect(page.getByLabel('Route', { exact: true })).toHaveText(
            '/notes',
          )
          await page.getByRole('button', { name: 'Toggle action slot' }).click()
          await page
            .getByRole('button', { name: 'Create note', exact: true })
            .click()
          await expect(page.getByLabel('Route', { exact: true })).toHaveText(
            '/new',
          )
          await page.getByRole('button', { name: 'Toggle action slot' }).click()
          await expect(
            page.locator('cad-list').last().locator('[part="arrow"]'),
          ).toHaveCount(0)
          await page
            .getByRole('button', { name: 'Submit', exact: true })
            .click()
          await expect(page.getByLabel('Form data')).toContainText(
            '["title","External"]',
          )
          await expect(page.getByLabel('Form data')).toContainText(
            '["reviewed","on"]',
          )
          await page
            .getByRole('textbox', { name: 'Body', exact: true })
            .fill('Edited body')
          await page.getByRole('switch', { name: 'Auto-save' }).press('Space')
          await page
            .getByRole('radio', { name: 'Personal note' })
            .press('Space')
          await page.getByRole('slider', { name: 'Depth' }).press('ArrowRight')
          await expect(page.getByRole('slider', { name: 'Depth' })).toHaveValue(
            '61',
          )
          await page
            .getByRole('button', { name: 'Set external controls' })
            .click()
          await expect(
            page.getByRole('textbox', { name: 'Body', exact: true }),
          ).toHaveValue('External body')
          await expect(
            page.getByRole('switch', { name: 'Auto-save' }),
          ).toBeChecked()
          await expect(
            page.getByRole('radio', { name: 'Personal note' }),
          ).toBeChecked()
          await expect(page.getByRole('slider', { name: 'Depth' })).toHaveValue(
            '80',
          )
          await page
            .getByRole('button', { name: 'Submit', exact: true })
            .click()
          await expect(page.getByLabel('Form data')).toContainText(
            '["body","External body"]',
          )
          await expect(page.getByLabel('Form data')).toContainText(
            '["autoSave","on"]',
          )
          await expect(page.getByLabel('Form data')).toContainText(
            '["kind","personal"]',
          )
          await expect(page.getByLabel('Form data')).toContainText(
            '["depth","80"]',
          )
          await page.getByRole('button', { name: 'Disable form' }).click()
          for (const control of [
            title,
            page.getByRole('textbox', { name: 'Body', exact: true }),
            page.getByRole('checkbox', { name: 'Reviewed' }),
            page.getByRole('switch', { name: 'Auto-save' }),
            page.getByRole('radio', { name: 'Personal note' }),
            page.getByRole('slider', { name: 'Depth' }),
          ]) {
            await expect(control).toBeDisabled()
          }
          assert.deepEqual(
            await page
              .locator('form')
              .evaluate((form) => [...new FormData(form)]),
            [],
          )
          await page.getByRole('button', { name: 'Enable form' }).click()
          await page.getByRole('button', { name: 'Reset', exact: true }).click()
          await expect(title).toHaveValue('Original')
          await expect(
            page.getByRole('checkbox', { name: 'Reviewed' }),
          ).not.toBeChecked()
          await expect(
            page.getByRole('textbox', { name: 'Body', exact: true }),
          ).toHaveValue('Original body')
          await expect(
            page.getByRole('switch', { name: 'Auto-save' }),
          ).not.toBeChecked()
          await expect(
            page.getByRole('radio', { name: 'Personal note' }),
          ).not.toBeChecked()
          await expect(page.getByRole('slider', { name: 'Depth' })).toHaveValue(
            '60',
          )
          await title.fill('')
          assert.equal(
            await page.locator('form').evaluate((form) => form.checkValidity()),
            false,
          )
          await title.fill('Valid title')
          assert.equal(
            await page.locator('form').evaluate((form) => form.checkValidity()),
            true,
          )
          await page.getByRole('button', { name: 'Focus title' }).click()
          await expect(title).toBeFocused()
          await page.getByRole('button', { name: 'Open modal' }).click()
          await expect(
            page.getByRole('dialog', { name: 'Review note' }),
          ).toBeVisible()
          await page.keyboard.press('Escape')
          await expect(page.getByRole('dialog')).not.toBeVisible()
          await expect(
            page.getByRole('button', { name: 'Open modal' }),
          ).toBeFocused()
        }
      }
      if (next) {
        await page.goto('http://127.0.0.1:5193/server-check/')
        await expect(
          page.getByRole('textbox', { name: 'Server value' }),
        ).toHaveValue('From the server')
        const first = await page.locator('[data-server-render]').textContent()
        await page.reload()
        assert.notEqual(
          await page.locator('[data-server-render]').textContent(),
          first,
        )
        await page.goto('http://127.0.0.1:5193/')
        await expect(
          page.getByRole('heading', { name: 'No notes yet' }),
        ).toBeVisible()
        await page.getByRole('link', { name: 'Create a note' }).click()
        await page
          .getByRole('textbox', { name: 'Title', exact: true })
          .fill('A useful decision')
        await page
          .getByRole('textbox', { name: 'Note', exact: true })
          .fill('Keep behavior in the library.')
        await page.locator('cad-checkbox').locator('label').click()
        await expect(
          page.getByRole('checkbox', { name: 'Reviewed' }),
        ).toBeChecked()
        await page
          .getByRole('button', { name: 'Save note', exact: true })
          .click()
        await expect(
          page.getByRole('link', { name: 'A useful decision', exact: true }),
        ).toBeVisible()
        await page.reload()
        await page
          .getByRole('link', { name: 'A useful decision', exact: true })
          .click()
        await expect(
          page.getByRole('textbox', { name: 'Note', exact: true }),
        ).toHaveValue('Keep behavior in the library.')
        await expect(
          page.getByRole('checkbox', { name: 'Reviewed' }),
        ).toBeChecked()
        await page
          .getByRole('textbox', { name: 'Title', exact: true })
          .fill('Unsaved edit')
        await page.getByRole('button', { name: 'Reset changes' }).click()
        await expect(
          page.getByRole('textbox', { name: 'Title', exact: true }),
        ).toHaveValue('A useful decision')
        const accessibility = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze()
        assert.deepEqual(
          accessibility.violations,
          [],
          `${name}: notes editor accessibility`,
        )
        await page
          .getByRole('button', { name: 'Delete note', exact: true })
          .click()
        await expect(
          page.getByRole('dialog', { name: 'Delete this note?' }),
        ).toBeVisible()
        await page.getByRole('button', { name: 'Keep note' }).click()
        await expect(
          page.getByRole('button', { name: 'Delete note', exact: true }),
        ).toBeFocused()
        await page.setViewportSize({ width: 390, height: 844 })
        assert.equal(
          await page.evaluate(
            () =>
              document.documentElement.scrollWidth <=
              document.documentElement.clientWidth,
          ),
          true,
        )
        await page.screenshot({
          path: join(evidence, `notes-editor-${name}-mobile.png`),
          fullPage: true,
        })
        await page
          .getByRole('button', { name: 'Delete note', exact: true })
          .click()
        await page.getByRole('button', { name: 'Delete permanently' }).click()
        await expect(
          page.getByRole('heading', { name: 'No notes yet' }),
        ).toBeVisible()
        await page.reload()
        await expect(
          page.getByRole('heading', { name: 'No notes yet' }),
        ).toBeVisible()

        const nojs = await browser.newContext({ javaScriptEnabled: false })
        const fallback = await nojs.newPage()
        await fallback.goto('http://127.0.0.1:5193/server-check/')
        await expect(
          fallback.getByText('Readable before JavaScript.'),
        ).toBeVisible()
        await expect(
          fallback.getByRole('link', { name: 'Caderno Notes' }),
        ).toBeVisible()
        await fallback.screenshot({
          path: join(evidence, `notes-before-js-${name}.png`),
          fullPage: true,
        })
        await nojs.close()

        // A separate context deliberately injects failure; no developer storage is touched.
        const failureContext = await browser.newContext()
        await failureContext.addInitScript(() => {
          const original = Storage.prototype.setItem
          Storage.prototype.setItem = function (key, value) {
            if (key === 'caderno-ui:notes-example:v1')
              throw new DOMException('Storage full', 'QuotaExceededError')
            return original.call(this, key, value)
          }
        })
        const failurePage = await failureContext.newPage()
        observeErrors(failurePage)
        await failurePage.goto('http://127.0.0.1:5193/edit/')
        await failurePage
          .getByRole('textbox', { name: 'Title', exact: true })
          .fill('Keep my draft')
        await failurePage
          .getByRole('button', { name: 'Save note', exact: true })
          .click()
        await expect(
          failurePage.getByText('Your draft is still here.', { exact: false }),
        ).toBeVisible()
        await expect(
          failurePage.getByRole('textbox', { name: 'Title', exact: true }),
        ).toHaveValue('Keep my draft')
        await failureContext.close()

        const corruptContext = await browser.newContext()
        const corruptPage = await corruptContext.newPage()
        observeErrors(corruptPage)
        await corruptPage.goto('http://127.0.0.1:5193/edit/')
        await corruptPage
          .getByRole('textbox', { name: 'Title', exact: true })
          .fill('Do not discard this draft')
        await corruptPage.evaluate(() => {
          window.localStorage.setItem(
            'caderno-ui:notes-example:v1',
            'invalid data',
          )
          window.dispatchEvent(
            new StorageEvent('storage', { key: 'caderno-ui:notes-example:v1' }),
          )
        })
        await expect(
          corruptPage.getByText('Nothing has been overwritten.', {
            exact: false,
          }),
        ).toBeVisible()
        await expect(
          corruptPage.getByRole('textbox', { name: 'Title', exact: true }),
        ).toHaveValue('Do not discard this draft')
        await corruptPage
          .getByRole('button', { name: 'Save note', exact: true })
          .click()
        assert.equal(
          await corruptPage.evaluate(() =>
            window.localStorage.getItem('caderno-ui:notes-example:v1'),
          ),
          'invalid data',
        )
        await corruptContext.close()

        // The actual static hosting path must work with reload and client navigation.
        // It is a different deployment, not a cross-origin navigation inside the
        // SSR app. Finish its page before starting a separate browsing context.
        await page.close()
        const staticContext = await browser.newContext({
          viewport: { width: 1280, height: 900 },
        })
        contexts.push(staticContext)
        page = await staticContext.newPage()
        observeErrors(page)
        await page.goto('http://127.0.0.1:5194/caderno-ui/examples/react/')
        await expect(
          page.getByRole('heading', { name: 'No notes yet' }),
        ).toBeVisible()
        await page.getByRole('link', { name: 'Create a note' }).click()
        await expect(page).toHaveURL(/\/caderno-ui\/examples\/react\/edit\//)
        await page
          .getByRole('textbox', { name: 'Title', exact: true })
          .fill('Static export note')
        await page
          .getByRole('button', { name: 'Save note', exact: true })
          .click()
        await expect(
          page.getByRole('link', { name: 'Static export note', exact: true }),
        ).toBeVisible()
        await page.reload()
        await page
          .getByRole('link', { name: 'Static export note', exact: true })
          .click()
        await expect(page).toHaveURL(
          /\/caderno-ui\/examples\/react\/edit\/\?id=/,
        )
        await expect(
          page.getByRole('textbox', { name: 'Title', exact: true }),
        ).toHaveValue('Static export note')
        await page.reload()
        await expect(
          page.getByRole('textbox', { name: 'Title', exact: true }),
        ).toHaveValue('Static export note')
        await page.setViewportSize({ width: 1280, height: 900 })
        await page.screenshot({
          path: join(evidence, `notes-editor-${name}-desktop.png`),
          fullPage: true,
        })
      }
      assert.deepEqual(errors, [], `${name}: console or hydration errors`)
      console.log(
        `${name}: React, Vue, Svelte${next ? ', Next SSR and notes flow' : ''} passed.`,
      )
    } catch (error) {
      await page.screenshot({
        path: join(evidence, `${name}-failure.png`),
        fullPage: true,
      })
      console.error('Browser errors:', errors)
      throw error
    } finally {
      await Promise.all(contexts.map((item) => item.close()))
      await browser.close()
    }
  }
}
