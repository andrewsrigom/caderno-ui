import '@caderno-ui/tokens/notebook.css'
import '@caderno-ui/elements/fallback.css'
import '@caderno-ui/elements'
import '@caderno-ui/elements/chart'
import {
  cadIconCategories,
  type CadIconCategory,
  type CadIconName,
} from '@caderno-ui/icons'

import './style.css'

const root = document.documentElement
const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')
const eventLog = document.querySelector<HTMLOutputElement>('[data-event-log]')
const formDemo = document.querySelector<HTMLFormElement>('[data-form-demo]')
const formResult =
  document.querySelector<HTMLOutputElement>('[data-form-result]')
const toastHost = document.querySelector('cad-toast-host')
const toastTrigger = document.querySelector<HTMLElement>('[data-toast-trigger]')
const iconPalette = document.querySelector<HTMLElement>('[data-icon-palette]')

const iconCategoryLabels: Record<CadIconCategory, string> = {
  annotation: 'Annotation',
  engineering: 'Engineering',
  study: 'Study',
}

function createIconSample(name: CadIconName) {
  const sample = document.createElement('figure')
  const icon = document.createElement('cad-icon')
  const caption = document.createElement('figcaption')

  sample.className = 'icon-sample'
  icon.label = name.replaceAll('-', ' ')
  icon.name = name
  icon.size = '32'
  caption.textContent = name
  sample.append(icon, caption)

  return sample
}

function createIconCategory(category: CadIconCategory) {
  const group = document.createElement('section')
  const heading = document.createElement('h3')
  const grid = document.createElement('div')

  group.className = 'icon-category'
  heading.textContent = iconCategoryLabels[category]
  grid.className = 'icon-palette-grid'
  grid.append(...cadIconCategories[category].map(createIconSample))
  group.append(heading, grid)

  return group
}

iconPalette?.replaceChildren(
  ...(Object.keys(cadIconCategories) as CadIconCategory[]).map(
    createIconCategory,
  ),
)

toggle?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light'
})

for (const eventName of [
  'cad-bookmark-change',
  'cad-accordion-toggle',
  'cad-dismiss',
  'cad-drawer-close',
  'cad-drawer-open',
  'cad-footer-group-toggle',
  'cad-header-menu-toggle',
  'cad-modal-close',
  'cad-modal-open',
  'cad-popover-close',
  'cad-popover-open',
  'cad-slider-change',
  'cad-slider-input',
  'cad-tab-change',
  'cad-toast-dismiss',
]) {
  document.addEventListener(eventName, (event) => {
    if (!(event instanceof CustomEvent) || !eventLog) return
    eventLog.value = `${event.type}: ${JSON.stringify(event.detail)}`
  })
}

formDemo?.addEventListener('submit', (event) => {
  event.preventDefault()
  if (!formResult) return
  formResult.value = JSON.stringify(Object.fromEntries(new FormData(formDemo)))
})

toastTrigger?.addEventListener('click', () => {
  toastHost?.show({
    heading: 'Laboratory event',
    message: 'The hosted notification uses safe plain text.',
    variant: 'info',
  })
})

document
  .querySelector<HTMLElement>('[data-modal-confirm]')
  ?.addEventListener('click', (event) => {
    const trigger = event.currentTarget
    if (!(trigger instanceof HTMLElement)) return
    trigger.closest('cad-modal')?.close('confirmed')
  })

for (const selector of ['[data-drawer-cancel]', '[data-drawer-save]']) {
  document
    .querySelector<HTMLElement>(selector)
    ?.addEventListener('click', (event) => {
      const trigger = event.currentTarget
      if (!(trigger instanceof HTMLElement)) return
      trigger.closest('cad-drawer')?.close('api')
    })
}
