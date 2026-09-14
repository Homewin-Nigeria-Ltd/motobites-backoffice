import type { OrderAssigneeType, OrdersGroupedParams } from "../types"

export const orderKeys = {
  all: ["orders"] as const,
  tabCounts: (branchId?: number | null) =>
    [...orderKeys.all, "tab-counts", branchId ?? null] as const,
  grouped: (params: OrdersGroupedParams) =>
    [...orderKeys.all, "grouped", params] as const,
  detail: (orderId: string) => [...orderKeys.all, "detail", orderId] as const,
  assignees: (type: OrderAssigneeType, branchId?: number | null) =>
    [...orderKeys.all, "assignees", type, branchId ?? null] as const,
  receipt: (orderId: string) => [...orderKeys.all, "receipt", orderId] as const,
}
