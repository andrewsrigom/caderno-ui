import '@caderno-ui/tokens/notebook.css'
import '@caderno-ui/elements/fallback.css'
import '@caderno-ui/elements'

import './style.css'

const root = document.documentElement
const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')
const eventLog = document.querySelector<HTMLOutputElement>('[data-event-log]')

toggle?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light'
})

for (const eventName of [
  'cad-bookmark-change',
  'cad-dismiss',
  'cad-tab-change',
]) {
  document.addEventListener(eventName, (event) => {
    if (!(event instanceof CustomEvent) || !eventLog) return
    eventLog.value = `${event.type}: ${JSON.stringify(event.detail)}`
  })
}
