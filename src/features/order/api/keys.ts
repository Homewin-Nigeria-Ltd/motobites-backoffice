import type { OrderAssigneeType, OrdersGroupedParams } from "../types"

export const orderKeys = {
  all: ["orders"] as const,
  tabCounts: () => [...orderKeys.all, "tab-counts"] as const,
  grouped: (params: OrdersGroupedParams) =>
    [...orderKeys.all, "grouped", params] as const,
  detail: (orderId: string) => [...orderKeys.all, "detail", orderId] as const,
  assignees: (type: OrderAssigneeType) =>
    [...orderKeys.all, "assignees", type] as const,
  receipt: (orderId: string) => [...orderKeys.all, "receipt", orderId] as const,
}
