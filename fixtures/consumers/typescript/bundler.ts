import type { CadDismissEvent } from '@caderno-ui/elements/alert'
import type { CadChartType } from '@caderno-ui/elements/chart'
import type { CadFooterVariant } from '@caderno-ui/elements/footer'
import type { CadHeaderVariant } from '@caderno-ui/elements/header'
import type { CadIconName } from '@caderno-ui/icons'
import type { CadEnterOptions, CadMotionScope } from '@caderno-ui/motion'
import type { CadAlert } from '@caderno-ui/react/alert'
import type { CadChart } from '@caderno-ui/react/chart'
import type { CadDrawer } from '@caderno-ui/react/drawer'
import type { CadFooter, CadFooterGroup } from '@caderno-ui/react/footer'
import type { CadHeader } from '@caderno-ui/react/header'
import type { CadPopover } from '@caderno-ui/react/popover'
import type { CadSlider } from '@caderno-ui/react/slider'
import type { CadSwitch } from '@caderno-ui/react/switch'

export const icon: CadIconName = 'spark'
export const chartType: CadChartType = 'donut'
export const readVariant = (event: CadDismissEvent) => event.detail.variant
export type AlertAdapter = typeof CadAlert
export type ChartAdapter = typeof CadChart
export type DrawerAdapter = typeof CadDrawer
export type FooterAdapter = typeof CadFooter
export type FooterGroupAdapter = typeof CadFooterGroup
export const footerVariant: CadFooterVariant = 'minimal'
export type HeaderAdapter = typeof CadHeader
export const headerVariant: CadHeaderVariant = 'glass'
export type PopoverAdapter = typeof CadPopover
export type SliderAdapter = typeof CadSlider
export type SwitchAdapter = typeof CadSwitch
export type MotionOptions = CadEnterOptions
export type MotionScope = CadMotionScope
