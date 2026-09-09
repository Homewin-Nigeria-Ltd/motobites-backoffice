import type {
  ApiSalesDashboardOrder,
  ApiSalesDashboardOverviewActivity,
  ApiSalesDashboardOverviewMetrics,
  ApiSalesDashboardOverviewStaff,
  ApiSalesDashboardRecentTransaction,
} from "../types"
import {
  getOrderSourceLabel,
  getPaymentMethodLabel,
} from "./order-checkout"
import {
  isCompletedSalesDashboardOrder,
  mapSalesDashboardOrderToOverviewRow,
} from "./sales-dashboard-order"
import { formatOfflineOrderAmount } from "./order-totals"

export function buildSummaryFromMetrics(
  metrics: ApiSalesDashboardOverviewMetrics,
) {
  return {
    activeOrders: metrics.active_orders.count,
    activeOrdersBadge: metrics.active_orders.badge,
    savedOnHold: metrics.saved_on_hold.count,
    savedOnHoldBadge: metrics.saved_on_hold.badge,
    completedToday: metrics.completed_today.count,
    completedTodayBadge: metrics.completed_today.badge,
    todayRevenue: metrics.today_offline_revenue.amount,
    todayRevenueBadge: metrics.today_offline_revenue.badge,
  }
}

export function mapOverviewStaffRows(staff: ApiSalesDashboardOverviewStaff[]) {
  return staff.map((member) => ({
    id: member.id,
    rank: member.rank,
    name: member.name,
    avatar: member.avatar ?? null,
    ordersCount: member.orders_count,
    ordersLabel: member.orders_label ?? `${member.orders_count} orders`,
    revenue:
      member.revenue ??
      (member.revenue_kobo != null ? member.revenue_kobo / 100 : 0),
    averageValue:
      member.avg_value ??
      (member.avg_value_kobo != null ? member.avg_value_kobo / 100 : 0),
    status: member.status === "offline" ? ("offline" as const) : ("active" as const),
  }))
}

export function mapOverviewActivityRows(
  activity: ApiSalesDashboardOverviewActivity[],
) {
  return activity.map((entry, index) => ({
    id: String(entry.id ?? index),
    title: entry.title,
    badge: entry.badge,
    badgeType: entry.badge_type,
    timeLabel: entry.time_ago,
  }))
}

export function mapOverviewSavedOrderRows(orders: ApiSalesDashboardOrder[]) {
  return orders.slice(0, 4).map(mapSalesDashboardOrderToOverviewRow)
}

export function mapOverviewCompletedOrderRows(orders: ApiSalesDashboardOrder[]) {
  return orders
    .filter(isCompletedSalesDashboardOrder)
    .slice(0, 4)
    .map(mapSalesDashboardOrderToOverviewRow)
}

export function mapOverviewTransactionRows(
  transactions: ApiSalesDashboardRecentTransaction[],
) {
  return transactions.map((transaction) => {
    const source = transaction.source ?? "walk_in"
    const transactionNumber = (
      transaction.transaction_id ||
      transaction.reference ||
      transaction.order_ref ||
      transaction.id
    ).replace(/^#/, "")
    const amount =
      transaction.amount ??
      (transaction.amount_kobo != null ? transaction.amount_kobo / 100 : 0)

    return {
      id: transaction.id,
      transactionNumber,
      customerName: transaction.customer?.trim() || "Walk-in Customer",
      source,
      sourceLabel: getOrderSourceLabel(source),
      amount,
      paymentMethod: getPaymentMethodLabel(transaction.payment_method ?? "cash"),
      timeLabel: transaction.time ?? "Just now",
    }
  })
}

export function formatOverviewCurrency(amount: number) {
  return formatOfflineOrderAmount(amount)
}
