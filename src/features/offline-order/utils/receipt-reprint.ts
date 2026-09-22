import type { AuthUser } from "@/features/auth/types"

import type { ApiSalesDashboardOrder } from "../types"
import { isSalesManager, isSalesRep } from "./admin-role"
import { isCompletedSalesDashboardOrder } from "./sales-dashboard-order"

export function getSalesDashboardOrderOwnerId(order: ApiSalesDashboardOrder) {
  return order.sales_rep?.id ?? order.assigned_to?.id ?? order.taken_by?.id ?? null
}

export function canUserRecordReceiptReprint(
  user: AuthUser | null | undefined,
  order: ApiSalesDashboardOrder | null | undefined,
) {
  if (!user || !order || !isSalesRep(user) || isSalesManager(user)) {
    return false
  }

  if (!isCompletedSalesDashboardOrder(order)) {
    return false
  }

  const ownerId = getSalesDashboardOrderOwnerId(order)

  return ownerId != null && ownerId === user.id
}

export function canUserViewReceiptReprintCount(
  user: AuthUser | null | undefined,
) {
  return isSalesManager(user)
}

export function getSalesDashboardOrderReceiptReprintCount(
  order: ApiSalesDashboardOrder,
) {
  return order.receipt_reprint_count ?? 0
}
