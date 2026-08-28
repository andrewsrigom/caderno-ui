import { expect } from '@playwright/test'

/** @param {import('@playwright/test').Page} page @param {string} base */
export async function verifyKanbanFlow(page, base) {
  await page.goto(`${base}kanban/`)
  await expect(page.getByRole('heading', { name: 'Your board' })).toBeVisible()
  await expect(page.getByText('No tasks yet.', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'New task', exact: true }).click()
  // Slotted form controls remain children of the host, not of its shadow dialog.
  const editor = page.locator('cad-modal').filter({
    has: page.getByRole('dialog', { name: 'New task', exact: true }),
  })
  await expect(
    page.getByRole('dialog', { name: 'New task', exact: true }),
  ).toBeVisible()
  await editor
    .getByRole('textbox', { name: 'Title', exact: true })
    .fill('Review the examples')
  await editor
    .getByRole('textbox', { name: 'Details', exact: true })
    .fill('Check the copyable snippets.')
  await editor.getByRole('button', { name: 'Add task', exact: true }).click()
  await expect(editor).not.toBeVisible()
  const todo = page.locator('cad-kanban-column[data-status="todo"]')
  const doing = page.locator('cad-kanban-column[data-status="doing"]')
  const done = page.locator('cad-kanban-column[data-status="done"]')
  await expect(todo.locator('cad-kanban-card')).toHaveCount(1)
  await expect(todo.locator('[part="count"]')).toHaveText('1')
  await expect(
    page.getByRole('button', { name: 'Edit Review the examples', exact: true }),
  ).toBeFocused()
  await page
    .getByRole('button', {
      name: 'Move Review the examples to In progress',
      exact: true,
    })
    .press('Enter')
  await expect(doing.locator('cad-kanban-card')).toHaveCount(1)
  await expect(todo.locator('[part="count"]')).toHaveText('0')
  await expect(
    page.getByRole('button', { name: 'Edit Review the examples', exact: true }),
  ).toBeFocused()
  await page.getByRole('button', { name: 'Undo', exact: true }).click()
  await expect(todo.locator('cad-kanban-card')).toHaveCount(1)
  await page
    .getByRole('button', { name: 'Edit Review the examples', exact: true })
    .click()
  const edit = page.locator('cad-modal').filter({
    has: page.getByRole('dialog', { name: 'Edit task', exact: true }),
  })
  await edit
    .getByRole('textbox', { name: 'Title', exact: true })
    .fill('Unsaved draft')
  await edit.getByText('Done', { exact: true }).click()
  await edit.getByRole('button', { name: 'Reset changes', exact: true }).click()
  await expect(
    edit.getByRole('textbox', { name: 'Title', exact: true }),
  ).toHaveValue('Review the examples')
  await expect(
    edit.getByRole('radio', { name: 'To do', exact: true }),
  ).toBeChecked()
  await edit.getByText('Done', { exact: true }).click()
  await edit.getByRole('button', { name: 'Save task', exact: true }).click()
  await expect(done.locator('cad-kanban-card')).toHaveCount(1)
  await expect(
    page.getByRole('button', { name: 'Edit Review the examples', exact: true }),
  ).toBeFocused()
  // Assertions above establish UI readiness. Finish pending route requests before
  // deliberately unloading the document; console errors remain checked separately.
  await page.waitForLoadState('networkidle')
  await page.reload()
  await expect(done.locator('cad-kanban-card')).toHaveCount(1)
  await expect(done.getByText('Check the copyable snippets.')).toBeVisible()
  const remove = page.getByRole('button', {
    name: 'Delete Review the examples',
    exact: true,
  })
  await remove.click()
  const confirmation = page.locator('cad-modal').filter({
    has: page.getByRole('dialog', { name: 'Delete this task?', exact: true }),
  })
  await confirmation
    .getByRole('button', { name: 'Keep task', exact: true })
    .click()
  await expect(remove).toBeFocused()
  await remove.click()
  await confirmation
    .getByRole('button', { name: 'Delete task', exact: true })
    .click()
  await expect(page.locator('cad-kanban-card')).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'New task', exact: true }),
  ).toBeFocused()
  await page.waitForLoadState('networkidle')
  await page.reload()
  await expect(page.getByText('No tasks yet.', { exact: false })).toBeVisible()
  await page.waitForLoadState('networkidle')
}
