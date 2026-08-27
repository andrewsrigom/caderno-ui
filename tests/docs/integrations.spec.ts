import { expect, test } from '@playwright/test'

test('framework guides expose installed-package examples and honest limits', async ({
  page,
}) => {
  for (const [path, title] of [
    ['html', 'HTML'],
    ['astro', 'Astro'],
    ['react', 'React'],
    ['next', 'Next.js'],
    ['vue', 'Vue'],
    ['svelte', 'Svelte'],
  ]) {
    await page.goto(`integrations/${path}/`)
    await expect(
      page.getByRole('heading', { name: title, exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Install', exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Contract', exact: true }),
    ).toBeVisible()
  }
  await page.goto('quality/')
  await expect(
    page.getByText('Screen-reader support is not yet verified.', {
      exact: false,
    }),
  ).toBeVisible()
})

test('the deployed static path serves the Next example and font license', async ({
  page,
  request,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('examples/react/')
  await expect(
    page.getByRole('heading', { name: 'No notes yet', exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Create a note' }).click()
  await expect(
    page.getByRole('textbox', { name: 'Title', exact: true }),
  ).toBeVisible()
  await page.reload()
  await expect(
    page.getByRole('textbox', { name: 'Title', exact: true }),
  ).toBeVisible()
  const license = await request.get('examples/react/Caveat-OFL.txt')
  expect(license.ok()).toBe(true)
  expect(await license.text()).toContain('SIL OPEN FONT LICENSE')
  expect(errors).toEqual([])
})
