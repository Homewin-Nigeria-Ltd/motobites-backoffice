import type {
  SalesDashboardMenuItemsParams,
  SalesDashboardOperationalReportsParams,
  SalesDashboardOrdersParams,
  SalesDashboardRecentTransactionsParams,
} from "../types"

export const offlineOrderKeys = {
  all: ["offline-order"] as const,
  kitchens: () => [...offlineOrderKeys.all, "kitchens"] as const,
  menuItems: (params: SalesDashboardMenuItemsParams) =>
    [...offlineOrderKeys.all, "menu-items", params] as const,
  orders: (params: SalesDashboardOrdersParams) =>
    [...offlineOrderKeys.all, "orders", params] as const,
  savedOrders: (params: SalesDashboardOrdersParams) =>
    [...offlineOrderKeys.all, "saved-orders", params] as const,
  savedOrder: (orderId: string | number) =>
    [...offlineOrderKeys.all, "saved-order", orderId] as const,
  deleteRequests: (params: SalesDashboardOrdersParams) =>
    [...offlineOrderKeys.all, "delete-requests", params] as const,
  stats: () => [...offlineOrderKeys.all, "stats"] as const,
  topStaff: () => [...offlineOrderKeys.all, "top-staff"] as const,
  recentActivity: () => [...offlineOrderKeys.all, "recent-activity"] as const,
  recentTransactions: (params: SalesDashboardRecentTransactionsParams = {}) =>
    [...offlineOrderKeys.all, "recent-transactions", params] as const,
  operationalReports: (params: SalesDashboardOperationalReportsParams = {}) =>
    [...offlineOrderKeys.all, "operational-reports", params] as const,
}
