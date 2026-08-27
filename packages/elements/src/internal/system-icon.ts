import { nothing, svg } from 'lit'

export type CadSystemIconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'bookmark'
  | 'check'
  | 'chevron-left'
  | 'chevron-right'
  | 'close'
  | 'danger'
  | 'error'
  | 'first-page'
  | 'info'
  | 'last-page'
  | 'loading'
  | 'neutral'
  | 'star'
  | 'success'
  | 'tip'
  | 'warning'

/** Small intrinsic UI marks. Product-facing artwork belongs in `cad-icon`. */
export function renderSystemIcon(name: CadSystemIconName) {
  const content = (() => {
    switch (name) {
      case 'arrow-left':
        return svg`<path d="M19 12H5m6-6-6 6 6 6" />`
      case 'arrow-right':
        return svg`<path d="M5 12h14m-6-6 6 6-6 6" />`
      case 'bookmark':
        return svg`<path d="M7 4.5c0-.8.7-1.5 1.5-1.5h7c.8 0 1.5.7 1.5 1.5V21l-5-3.4L7 21V4.5Z" />`
      case 'check':
        return svg`<path d="m5 12.5 4.2 4.2L19 7" />`
      case 'chevron-left':
        return svg`<path d="m15 5-7 7 7 7" />`
      case 'chevron-right':
        return svg`<path d="m9 5 7 7-7 7" />`
      case 'close':
        return svg`<path d="m6 6 12 12M18 6 6 18" />`
      case 'danger':
        return svg`<circle cx="12" cy="12" r="9" /><path d="m8.5 8.5 7 7m0-7-7 7" />`
      case 'error':
        return svg`<circle cx="12" cy="12" r="9" /><path d="M12 7.5v6m0 3.2v.2" />`
      case 'first-page':
        return svg`<path d="m17 6-6 6 6 6m-7-12-6 6 6 6" />`
      case 'info':
        return svg`<circle cx="12" cy="12" r="9" /><path d="M12 10v7m0-10.5v.2" />`
      case 'last-page':
        return svg`<path d="m7 6 6 6-6 6m7-12 6 6-6 6" />`
      case 'loading':
        return svg`<path d="M20.5 12a8.5 8.5 0 1 1-2.8-6.3" /><path d="m17.7 2.8.1 3.1-3.1.1" />`
      case 'neutral':
        return svg`<circle cx="12" cy="12" r="9" /><path d="M8 12h8" />`
      case 'star':
        return svg`<circle cx="12" cy="12" r="9" /><path d="m12 6.7 1.5 3 3.3.5-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.5 1.5-3Z" />`
      case 'success':
        return svg`<circle cx="12" cy="12" r="9" /><path d="m7.5 12.2 3 3L17 8.8" />`
      case 'tip':
        return svg`<path d="M9 18h6m-5 3h4m3-10a5 5 0 1 0-10 0c0 2 1.2 3.2 2.1 4.1.5.5.9 1.1.9 1.9h4c0-.8.4-1.4.9-1.9C15.8 14.2 17 13 17 11Z" />`
      case 'warning':
        return svg`<path d="M12 3 2.8 20h18.4L12 3Z" /><path d="M12 9v5m0 3v.2" />`
      default:
        return nothing
    }
  })()

  return svg`
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.9"
      >
        ${content}
      </g>
    </svg>
  `
}
