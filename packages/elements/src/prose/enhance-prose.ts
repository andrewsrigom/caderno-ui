type ProseRoot = Document | DocumentFragment | Element

const proseSelector = '.cad-prose'
let installed = false

function enhanceAccordions(root: ProseRoot): void {
  root
    .querySelectorAll<HTMLDetailsElement>(
      `${proseSelector} .interview-question`,
    )
    .forEach((question) => {
      if (question.classList.contains('cad-prose-accordion')) return

      question.classList.add('cad-prose-accordion')
      question.dataset.tone ??= 'accent'

      const summary = question.querySelector<HTMLElement>(':scope > summary')
      if (summary && !summary.querySelector('.cad-prose-accordion-tape')) {
        const title = document.createElement('span')
        title.append(...Array.from(summary.childNodes))

        const tape = document.createElement('span')
        tape.className = 'cad-prose-accordion-tape'
        tape.setAttribute('aria-hidden', 'true')

        const indicator = document.createElement('span')
        indicator.className = 'cad-prose-accordion-indicator'
        indicator.setAttribute('aria-hidden', 'true')

        summary.append(tape, title, indicator)
      }

      let answer = question.querySelector<HTMLElement>(
        ':scope > .interview-answer',
      )
      if (!answer && summary) {
        answer = document.createElement('div')
        answer.className = 'interview-answer'
        answer.append(
          ...Array.from(question.childNodes).filter((node) => node !== summary),
        )
        question.append(answer)
      }
      answer?.classList.add('cad-prose-accordion-content')
    })
}

function enhanceBlockquotes(root: ProseRoot): void {
  root
    .querySelectorAll<HTMLQuoteElement>(`${proseSelector} blockquote`)
    .forEach((quote) => {
      if (quote.closest('.cad-prose-blockquote')) return

      const figure = document.createElement('figure')
      figure.className = 'cad-prose-blockquote'
      figure.dataset.tone = 'accent'

      const mark = document.createElement('span')
      mark.className = 'cad-prose-blockquote-mark'
      mark.setAttribute('aria-hidden', 'true')
      mark.textContent = '“'

      const body = document.createElement('div')
      body.append(...Array.from(quote.childNodes))
      quote.append(mark, body)
      quote.before(figure)
      figure.append(quote)
    })
}

function enhanceCodeBlocks(root: ProseRoot): void {
  root
    .querySelectorAll<HTMLPreElement>(
      `${proseSelector} pre:not([data-mermaid-source]):not(.cad-prose-code-pre)`,
    )
    .forEach((block) => {
      const figure = document.createElement('figure')
      figure.className = 'cad-prose-code'
      figure.dataset.tone = 'accent'

      block.classList.add('cad-prose-code-pre')
      block.dataset.lineNumbers ??= 'off'
      block.style.removeProperty('background-color')

      const code = block.querySelector<HTMLElement>(':scope > code')
      code?.classList.add('cad-prose-code-code')
      code?.querySelectorAll<HTMLElement>(':scope > .line').forEach((line) => {
        line.classList.add('cad-prose-code-line')
      })

      block.before(figure)
      figure.append(block)
    })
}

function enhanceHighlights(root: ProseRoot): void {
  root
    .querySelectorAll<HTMLElement>(
      `${proseSelector} mark, ${proseSelector} .book-marker`,
    )
    .forEach((highlight) => {
      highlight.classList.add('cad-prose-highlight')
      highlight.dataset.tone ??= 'lemon'
      highlight.dataset.variant ??= 'marker'
    })
}

function enhanceTables(root: ProseRoot): void {
  root
    .querySelectorAll<HTMLTableElement>(`${proseSelector} table`)
    .forEach((table) => {
      if (table.closest('.cad-prose-table-wrap')) return

      const wrapper = document.createElement('div')
      wrapper.className = 'cad-prose-table-wrap'
      wrapper.dataset.zebra = 'false'
      table.classList.add('cad-prose-table')
      table.before(wrapper)
      wrapper.append(table)
    })
}

export function enhanceCadernoProse(root: ProseRoot = document): void {
  enhanceBlockquotes(root)
  enhanceCodeBlocks(root)
  enhanceHighlights(root)
  enhanceAccordions(root)
  enhanceTables(root)
}

export function installCadernoProse(): void {
  enhanceCadernoProse()
  if (installed) return
  installed = true
  document.addEventListener('astro:page-load', () => enhanceCadernoProse())
}
