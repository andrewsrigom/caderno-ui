import { cadIcons, type CadIconName } from '@caderno-ui/icons'
import { motionDefaults } from '@caderno-ui/motion'
import type { CadPaperPattern } from '@caderno-ui/elements/paper'
import type { CadProgressTone } from '@caderno-ui/elements/progress'
import type { CadTabChangeDetail } from '@caderno-ui/elements/tabs'

const name: CadIconName = 'bookmark'
export const paths = cadIcons[name]
export const progressTone: CadProgressTone = 'mint'
export const paperPattern: CadPaperPattern = 'grid'
export const detail: CadTabChangeDetail = {
  previousValue: '',
  value: 'notes',
}
export const motionStagger = motionDefaults.stagger
