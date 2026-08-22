import { cadIcons, type CadIconName } from '@caderno-ui/icons'
import type { CadProgressTone } from '@caderno-ui/elements/progress'
import type { CadTabChangeDetail } from '@caderno-ui/elements/tabs'

const name: CadIconName = 'bookmark'
export const paths = cadIcons[name]
export const progressTone: CadProgressTone = 'mint'
export const detail: CadTabChangeDetail = {
  activeTab: 'notes',
  previousTab: '',
}
