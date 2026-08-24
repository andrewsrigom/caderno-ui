import '@caderno-ui/tokens/notebook.css'
import '@caderno-ui/elements/fallback.css'
import '@caderno-ui/elements'
import '@caderno-ui/elements/chart'

import './style.css'

const root = document.documentElement
const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')
const eventLog = document.querySelector<HTMLOutputElement>('[data-event-log]')
const formDemo = document.querySelector<HTMLFormElement>('[data-form-demo]')
const formResult =
  document.querySelector<HTMLOutputElement>('[data-form-result]')
const toastHost = document.querySelector('cad-toast-host')
const toastTrigger = document.querySelector<HTMLElement>('[data-toast-trigger]')

toggle?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light'
})

for (const eventName of [
  'cad-bookmark-change',
  'cad-accordion-toggle',
  'cad-dismiss',
  'cad-modal-close',
  'cad-modal-open',
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
