import type { CadDismissEvent } from '@caderno-ui/elements/alert'
import type { CadChartType } from '@caderno-ui/elements/chart'
import type { CadIconName } from '@caderno-ui/icons'
import type { CadAlert } from '@caderno-ui/react/alert'
import type { CadChart } from '@caderno-ui/react/chart'

export const icon: CadIconName = 'spark'
export const chartType: CadChartType = 'donut'
export const readVariant = (event: CadDismissEvent) => event.detail.variant
export type AlertAdapter = typeof CadAlert
export type ChartAdapter = typeof CadChart
