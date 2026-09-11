import { format, parseISO } from "date-fns"

import {
  getOrderSourceLabel,
  getPaymentMethodLabel,
} from "@/features/offline-order/utils/order-checkout"
import { resolveOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"
import type {
  ApiSalesTransactionAnalytics,
  ApiSalesTransactionAnalyticsPeriod,
  SalesTransactionAnalyticsSummary,
  SalesTransactionAnalyticsViewModel,
  SalesTransactionPaymentMethodBreakdown,
  SalesTransactionRevenueSourceBreakdown,
  SalesTransactionRevenueTrendPoint,
  SalesTransactionTopItemRow,
} from "@/features/sales-transaction/types"

const SOURCE_COLORS: Record<string, string> = {
  walk_in: "var(--primary)",
  whatsapp: "rgb(34, 197, 94)",
  glovo: "rgb(245, 158, 11)",
  web: "rgb(59, 130, 246)",
  chowdeck: "rgb(244, 63, 94)",
  staff_credit: "rgb(168, 85, 247)",
}

const PAYMENT_BAR_CLASSES: Record<string, string> = {
  cash: "bg-primary",
  pos_card: "bg-sky-500",
  bank_transfer: "bg-emerald-500",
  chowdeck: "bg-rose-500",
  staff_credit: "bg-amber-500",
  glovo: "bg-orange-500",
}

const TREND_SOURCE_KEYS = [
  "walk_in",
  "whatsapp",
  "glovo",
  "web",
  "chowdeck",
] as const

function normalizeSourceKey(source: string) {
  return source.toLowerCase().replace(/-/g, "_")
}

function formatTrendDateLabel(date: string) {
  try {
    return format(parseISO(date), "MMM d")
  } catch {
    return date
  }
}

const PERIOD_PRESET_LABELS: Record<string, string> = {
  "24h": "Last 24 hours",
  week: "This week",
  "3months": "Last 3 months",
  year: "This year",
}

function formatAnalyticsPeriodLabel(period?: ApiSalesTransactionAnalyticsPeriod) {
  if (!period) {
    return "This year"
  }

  if (period.from && period.to) {
    try {
      const from = format(parseISO(period.from), "MMM d, yyyy")
      const to = format(parseISO(period.to), "MMM d, yyyy")
      return `${from} - ${to}`
    } catch {
      // Fall back to preset label below.
    }
  }

  return PERIOD_PRESET_LABELS[period.key] ?? period.key
}

export function emptySalesTransactionAnalyticsViewModel(): SalesTransactionAnalyticsViewModel {
  return {
    periodLabel: "This year",
    summary: {
      totalRevenue: 0,
      totalRevenueBadge: "",
      totalRevenueSubtitle: "Gross earnings in period",
      transactionCount: 0,
      transactionCountBadge: "",
      transactionCountSubtitle: "Orders logged in system",
      averageOrderValue: 0,
      averageOrderValueBadge: "",
      averageOrderValueSubtitle: "Average value for selected period",
      completionRate: 0,
      completionRateBadge: "",
      completionRateSubtitle: "Delivered/Paid ratio",
    },
    revenueTrend: [],
    sourceBreakdown: [],
    paymentBreakdown: [],
    topItems: [],
  }
}

export function mapTransactionAnalyticsSummary(
  data: ApiSalesTransactionAnalytics,
): SalesTransactionAnalyticsSummary {
  const kpis = data.kpis
  const completionRate = kpis.completion_rate

  return {
    totalRevenue: resolveOfflineOrderAmount(
      kpis.total_revenue?.amount,
      kpis.total_revenue?.amount_kobo,
    ),
    totalRevenueBadge: "",
    totalRevenueSubtitle: "Gross earnings in period",
    transactionCount: kpis.transaction_count?.count ?? 0,
    transactionCountBadge: "",
    transactionCountSubtitle: "Orders logged in system",
    averageOrderValue: Math.round(
      resolveOfflineOrderAmount(
        kpis.average_order_value?.amount,
        kpis.average_order_value?.amount_kobo,
      ),
    ),
    averageOrderValueBadge: "",
    averageOrderValueSubtitle: "Average value for selected period",
    completionRate: completionRate?.percent ?? 0,
    completionRateBadge: "",
    completionRateSubtitle: `${completionRate?.completed_count ?? 0} of ${completionRate?.transaction_count ?? 0} completed`,
  }
}

export function mapTransactionAnalyticsSourceBreakdown(
  data: ApiSalesTransactionAnalytics,
): SalesTransactionRevenueSourceBreakdown[] {
  return (data.revenue_by_source ?? []).map((item) => {
    const key = normalizeSourceKey(item.source)

    return {
      key,
      label: getOrderSourceLabel(item.source),
      percent: Math.round(item.percent ?? 0),
      amount: resolveOfflineOrderAmount(item.revenue, item.revenue_kobo),
      color: SOURCE_COLORS[key] ?? "var(--primary)",
    }
  })
}

export function mapTransactionAnalyticsPaymentBreakdown(
  data: ApiSalesTransactionAnalytics,
): SalesTransactionPaymentMethodBreakdown[] {
  return (data.payment_method_breakdown ?? []).map((item) => ({
    label: getPaymentMethodLabel(item.method),
    percent: Math.round(item.percent ?? 0),
    amount: resolveOfflineOrderAmount(item.revenue, item.revenue_kobo),
    barClassName: PAYMENT_BAR_CLASSES[item.method] ?? "bg-primary",
  }))
}

export function mapTransactionAnalyticsRevenueTrend(
  data: ApiSalesTransactionAnalytics,
): SalesTransactionRevenueTrendPoint[] {
  return (data.revenue_by_source_over_time ?? []).map((point) => {
    const row: SalesTransactionRevenueTrendPoint = {
      date: formatTrendDateLabel(point.date),
      walk_in: 0,
      whatsapp: 0,
      glovo: 0,
      web: 0,
      chowdeck: 0,
    }

    point.sources.forEach((source) => {
      const key = normalizeSourceKey(source.source)

      if (TREND_SOURCE_KEYS.includes(key as (typeof TREND_SOURCE_KEYS)[number])) {
        row[key as keyof Omit<SalesTransactionRevenueTrendPoint, "date">] =
          resolveOfflineOrderAmount(source.revenue, source.revenue_kobo)
      }
    })

    return row
  })
}

export function mapTransactionAnalyticsTopItems(
  data: ApiSalesTransactionAnalytics,
): SalesTransactionTopItemRow[] {
  return (data.top_performing_items_by_channel_source ?? []).map((item) => ({
    rank: item.rank,
    name: item.item,
    source: item.primary_channel,
    sourceLabel: getOrderSourceLabel(item.primary_channel),
    unitsSold: item.units_sold,
    revenue: resolveOfflineOrderAmount(item.revenue, item.revenue_kobo),
  }))
}

export function mapTransactionAnalyticsViewModel(
  data: ApiSalesTransactionAnalytics,
): SalesTransactionAnalyticsViewModel {
  const summary = mapTransactionAnalyticsSummary(data)

  return {
    periodLabel: formatAnalyticsPeriodLabel(data.period),
    summary,
    revenueTrend: mapTransactionAnalyticsRevenueTrend(data),
    sourceBreakdown: mapTransactionAnalyticsSourceBreakdown(data),
    paymentBreakdown: mapTransactionAnalyticsPaymentBreakdown(data),
    topItems: mapTransactionAnalyticsTopItems(data),
  }
}
