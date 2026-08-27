import { expect, test } from '@playwright/test'

const examples = [
  { name: 'accordion', tag: 'cad-accordion', samples: 1 },
  { name: 'blockquote', tag: 'cad-blockquote', samples: 2 },
  { name: 'callout', tag: 'cad-callout', samples: 2 },
  { name: 'card', tag: 'cad-card', samples: 2 },
  { name: 'checklist', tag: 'cad-checklist', samples: 2 },
  { name: 'empty-state', tag: 'cad-empty-state', samples: 2 },
  { name: 'footer', tag: 'cad-footer', samples: 2 },
  { name: 'kanban', tag: 'cad-kanban', samples: 1 },
  { name: 'note', tag: 'cad-note', samples: 1 },
  { name: 'popover', tag: 'cad-popover', samples: 2 },
]

for (const { name, tag, samples } of examples) {
  test(`${name} examples and Show code have matching content`, async ({
    page,
  }) => {
    await page.goto(`components/${name}/`)
    const snippets = await page
      .locator('[data-code-disclosure] cad-code-block')
      .evaluateAll(
        (blocks, count) =>
          blocks
            .slice(0, count)
            .map((block) => block.getAttribute('code') ?? ''),
        samples,
      )
    expect(snippets).toHaveLength(samples)
    const result = await page.evaluate(
      ({ snippets, tag }) => {
        const textOf = (element: Element | undefined) => {
          if (!element) return ''
          // Astro removes whitespace between elements during compilation.
          // Compare text nodes so that formatting does not change the result.
          const walker = element.ownerDocument.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
          )
          const parts: string[] = []
          while (walker.nextNode()) {
            const text = (walker.currentNode.textContent ?? '')
              .replace(/\s+/g, ' ')
              .trim()
            if (text) parts.push(text)
          }
          return parts.join(' ')
        }
        const shown = Array.from(document.querySelectorAll(`main ${tag}`))
        const expected = snippets.flatMap((source) =>
          Array.from(
            new DOMParser()
              .parseFromString(source, 'text/html')
              .querySelectorAll(tag),
          ),
        )
        return {
          shown: shown.length,
          expected: expected.length,
          pairs: expected.map((element, index) => ({
            text: textOf(shown[index]),
            expectedText: textOf(element),
            attributes: Array.from(element.attributes)
              .filter((attribute) => attribute.name !== 'class')
              .map(({ name, value }) => ({
                name,
                value: shown[index]?.getAttribute(name) ?? null,
                expected: value,
              })),
          })),
        }
      },
      { snippets, tag },
    )
    expect(result.expected).toBeGreaterThan(0)
    expect(result.shown).toBe(result.expected)
    for (const pair of result.pairs) {
      expect(pair.text).toBe(pair.expectedText)
      for (const attribute of pair.attributes) {
        expect(attribute.value, attribute.name).toBe(attribute.expected)
      }
    }
  })
}

test('example navigation stays inside the deployed documentation path', async ({
  page,
  request,
}) => {
  const paths = new Set<string>()
  for (const name of ['callout', 'popover', 'footer']) {
    await page.goto(`components/${name}/`)
    const hrefs = await page
      .locator('main [href^="/"]')
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute('href') ?? ''),
      )
    for (const href of hrefs) {
      expect(href).toMatch(/^\/caderno-ui\//)
      paths.add(href)
    }
  }
  expect(paths.size).toBeGreaterThan(0)
  for (const path of paths) {
    expect((await request.get(path)).status(), path).toBe(200)
  }
})
