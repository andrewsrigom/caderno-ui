import { cadIcons, type CadIconName } from '@caderno-ui/icons'
import { motionDefaults } from '@caderno-ui/motion'
import type { CadCardVariant } from '@caderno-ui/elements/card'
import type { CadDrawerPlacement } from '@caderno-ui/elements/drawer'
import type { CadFooterVariant } from '@caderno-ui/elements/footer'
import type { CadHeaderVariant } from '@caderno-ui/elements/header'
import type { CadPopoverPlacement } from '@caderno-ui/elements/popover'
import type { CadProgressTone } from '@caderno-ui/elements/progress'
import type { CadSliderTone } from '@caderno-ui/elements/slider'
import type { CadTabChangeDetail } from '@caderno-ui/elements/tabs'

const name: CadIconName = 'bookmark'
export const paths = cadIcons[name]
export const popoverPlacement: CadPopoverPlacement = 'bottom-start'
export const drawerPlacement: CadDrawerPlacement = 'right'
export const footerVariant: CadFooterVariant = 'dark'
export const headerVariant: CadHeaderVariant = 'bold'
export const progressTone: CadProgressTone = 'mint'
export const sliderTone: CadSliderTone = 'blue'
export const cardVariant: CadCardVariant = 'outlined'
export const detail: CadTabChangeDetail = {
  previousValue: '',
  value: 'notes',
}
export const motionStagger = motionDefaults.stagger
