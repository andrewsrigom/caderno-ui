import { nothing, svg } from 'lit'

export type CadSystemIconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'bookmark'
  | 'check'
  | 'close'
  | 'danger'
  | 'info'
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
      case 'close':
        return svg`<path d="m6 6 12 12M18 6 6 18" />`
      case 'danger':
        return svg`<circle cx="12" cy="12" r="9" /><path d="m8.5 8.5 7 7m0-7-7 7" />`
      case 'info':
        return svg`<circle cx="12" cy="12" r="9" /><path d="M12 10v7m0-10.5v.2" />`
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
