export const deliveryTabs = [
  "all",
  "unassigned",
  "ongoing",
  "completed",
  "riders",
] as const

export type DeliveryTab = (typeof deliveryTabs)[number]

export type DeliverySummaryKpi = {
  key: string
  label: string
  formatted_value: string | number
  change_percent: number
  trend: "up" | "down" | string
}

export type DeliveryOrderFrequency = {
  total_orders: number
  change_percent: number
  trend: "up" | "down" | string
  series: Array<{ label?: string; value?: number }>
}

export function isDeliveryTab(value: string): value is DeliveryTab {
  return (deliveryTabs as readonly string[]).includes(value)
}

export function getDeliveryTabPath(tab: DeliveryTab) {
  return `/delivery-status/${tab}`
}
