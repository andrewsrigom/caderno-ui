import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { verifyKanbanFlow } from '../frameworks/kanban.mjs'

const key = 'caderno-ui:kanban-example:v1'

test('the documentation links to the board and the app links back to notes', async ({
  page,
}, testInfo) => {
  await page.goto('integrations/react/')
  if (testInfo.project.name === 'mobile') {
    await page
      .getByRole('button', { name: 'Open documentation menu', exact: true })
      .click()
  }
  await expect(
    page.getByRole('link', { name: 'React / Next.js Kanban', exact: true }),
  ).toHaveAttribute('href', '/caderno-ui/examples/react/kanban/')
  await page
    .getByRole('link', { name: 'React / Next.js Kanban', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Your board', exact: true }),
  ).toBeVisible()
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open menu', exact: true }).click()
  }
  await page.getByRole('link', { name: 'All notes', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'No notes yet', exact: true }),
  ).toBeVisible()
})

test('board creates, edits, moves, undoes and deletes tasks without changing notes', async ({
  page,
  baseURL,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript(() => {
    // This context belongs to the test server, never the developer's preview.
    localStorage.setItem(
      'caderno-ui:notes-example:v1',
      'unreadable notes must not block the board',
    )
    localStorage.setItem('unrelated', 'keep me')
  })
  await verifyKanbanFlow(page, `${baseURL}examples/react/`)
  expect(
    await page.evaluate(() =>
      localStorage.getItem('caderno-ui:notes-example:v1'),
    ),
  ).toBe('unreadable notes must not block the board')
  expect(await page.evaluate(() => localStorage.getItem('unrelated'))).toBe(
    'keep me',
  )
  expect(errors).toEqual([])
})

test('example cards are opt-in and keep the public component layout accessible', async ({
  page,
}, testInfo) => {
  await page.goto('examples/react/kanban/')
  await expect(
    page.getByRole('button', { name: 'New task', exact: true }),
  ).toBeEnabled()
  const board = page.locator('cad-kanban [part="board"]')
  expect(
    await board.evaluate(
      (element) => element.scrollHeight <= element.clientHeight + 1,
    ),
  ).toBe(true)
  expect(
    await page.evaluate((key) => localStorage.getItem(key), key),
  ).toBeNull()
  await page
    .getByRole('button', { name: 'Try example tasks', exact: true })
    .click()
  await expect(page.locator('cad-kanban-card')).toHaveCount(5)
  expect(
    await board.evaluate(
      (element) => element.scrollHeight <= element.clientHeight + 1,
    ),
  ).toBe(true)
  await expect(
    page.getByRole('button', { name: 'Try example tasks', exact: true }),
  ).toHaveCount(0)
  // Check the notification after its entrance fade, not at a partial opacity.
  await expect(page.locator('cad-toast [part="base"]')).toHaveCSS(
    'opacity',
    '1',
  )
  await page.evaluate(() => document.fonts.ready)
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze())
      .violations,
  ).toEqual([])
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true)
  expect(
    await page.evaluate(() => Boolean(customElements.get('cad-chart'))),
  ).toBe(false)
  await page.screenshot({
    path: testInfo.outputPath('kanban.png'),
    fullPage: true,
  })
  await page.reload()
  await expect(page.locator('cad-kanban-card')).toHaveCount(5)
})

test('primary actions keep readable text on hover in both themes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('examples/react/kanban/')
  const action = page.getByRole('button', { name: 'New task', exact: true })
  await expect(action).toBeEnabled()
  for (const theme of ['light', 'dark']) {
    await page.locator('html').evaluate((element, theme) => {
      element.dataset.theme = theme
    }, theme)
    await action.hover()
    expect(
      (
        await new AxeBuilder({ page })
          .include('#new-task')
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze()
      ).violations,
    ).toEqual([])
  }
})

test('dragging moves a task without replacing card content', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === 'mobile',
    'Touch users use the explicit movement controls.',
  )
  await page.goto('examples/react/kanban/')
  await page
    .getByRole('button', { name: 'Try example tasks', exact: true })
    .click()
  const source = page.locator('cad-kanban-card').filter({
    has: page.getByRole('heading', {
      name: 'Outline the next article',
      exact: true,
    }),
  })
  const target = page.locator('cad-kanban-column[data-status="done"]')
  await source.dragTo(target)
  await expect(
    target.getByRole('heading', {
      name: 'Outline the next article',
      exact: true,
    }),
  ).toBeVisible()
  await expect(target.locator('[part="count"]')).toHaveText('2')
  await page.getByRole('button', { name: 'Undo', exact: true }).click()
  await expect(
    page
      .locator('cad-kanban-column[data-status="todo"]')
      .getByRole('heading', { name: 'Outline the next article', exact: true }),
  ).toBeVisible()
})

test('storage quota failures keep the draft and do not create a phantom card', async ({
  page,
}) => {
  await page.addInitScript((key) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method -- Restored with the original receiver through call().
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = function (name, value) {
      if (name === key)
        throw new DOMException('Storage full', 'QuotaExceededError')
      original.call(this, name, value)
    }
  }, key)
  await page.goto('examples/react/kanban/')
  await page.getByRole('button', { name: 'New task', exact: true }).click()
  const modal = page.locator('cad-modal').filter({
    has: page.getByRole('dialog', { name: 'New task', exact: true }),
  })
  await modal
    .getByRole('textbox', { name: 'Title', exact: true })
    .fill('Keep this draft')
  await modal.getByRole('button', { name: 'Add task', exact: true }).click()
  await expect(
    modal.getByText('This draft is still here.', { exact: false }),
  ).toBeVisible()
  await expect(
    modal.getByRole('textbox', { name: 'Title', exact: true }),
  ).toHaveValue('Keep this draft')
  await expect(page.locator('cad-kanban-card')).toHaveCount(0)
  expect(
    await page.evaluate((key) => localStorage.getItem(key), key),
  ).toBeNull()
})

test('failed deletion stays visible inside the confirmation and keeps the task', async ({
  page,
}) => {
  await page.goto('examples/react/kanban/')
  await page
    .getByRole('button', { name: 'Try example tasks', exact: true })
    .click()
  await expect(page.locator('cad-kanban-card')).toHaveCount(5)
  await page.evaluate((key) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method -- Restored with the original receiver through call().
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = function (name, value) {
      if (name === key)
        throw new DOMException('Storage unavailable', 'SecurityError')
      original.call(this, name, value)
    }
  }, key)
  await page
    .getByRole('button', {
      name: 'Delete Outline the next article',
      exact: true,
    })
    .click()
  const modal = page.locator('cad-modal').filter({
    has: page.getByRole('dialog', { name: 'Delete this task?', exact: true }),
  })
  await modal.getByRole('button', { name: 'Delete task', exact: true }).click()
  await expect(
    modal.getByText('This task has been kept.', { exact: false }),
  ).toBeVisible()
  await expect(page.locator('cad-kanban-card')).toHaveCount(5)
  await modal.getByRole('button', { name: 'Keep task', exact: true }).click()
  await page.reload()
  await expect(page.locator('cad-kanban-card')).toHaveCount(5)
})

test('corrupt storage is reported and never silently cleared', async ({
  page,
}) => {
  await page.addInitScript(
    (key) => localStorage.setItem(key, '{not a board'),
    key,
  )
  await page.goto('examples/react/kanban/')
  await expect(
    page.getByText('Nothing has been overwritten.', { exact: false }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'New task', exact: true }),
  ).toBeDisabled()
  await page.getByRole('button', { name: 'Try again', exact: true }).click()
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe(
    '{not a board',
  )
})

test('board changes synchronize between tabs without touching an open draft', async ({
  page,
  context,
}) => {
  await page.goto('examples/react/kanban/')
  await page.getByRole('button', { name: 'New task', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Title', exact: true })
    .fill('My unsaved task')
  const other = await context.newPage()
  await other.goto('examples/react/kanban/')
  await other
    .getByRole('button', { name: 'Try example tasks', exact: true })
    .click()
  await expect(page.locator('cad-kanban-card')).toHaveCount(5)
  await expect(
    page.getByRole('textbox', { name: 'Title', exact: true }),
  ).toHaveValue('My unsaved task')
  await page.getByRole('button', { name: 'Add task', exact: true }).click()
  await expect(other.locator('cad-kanban-card')).toHaveCount(6)
  await other.close()
})

test('without JavaScript the board retains its headings and local-storage explanation', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  try {
    const page = await context.newPage()
    await page.goto(`${baseURL}examples/react/kanban/`)
    await expect(
      page.getByRole('heading', { name: 'Your board', exact: true }),
    ).toBeVisible()
    for (const title of ['To do', 'In progress', 'Done']) {
      await expect(
        page.getByRole('heading', { name: title, exact: true }),
      ).toBeVisible()
    }
    await expect(
      page.getByText('Enable JavaScript to read and save them.', {
        exact: false,
      }),
    ).toBeVisible()
  } finally {
    await context.close()
  }
})
