import type { CadDismissEvent } from '@caderno-ui/elements/alert'
import type { CadIconName } from '@caderno-ui/icons'
import type { CadAlert } from '@caderno-ui/react/alert'

export const icon: CadIconName = 'spark'
export const readVariant = (event: CadDismissEvent) => event.detail.variant
export type AlertAdapter = typeof CadAlert
