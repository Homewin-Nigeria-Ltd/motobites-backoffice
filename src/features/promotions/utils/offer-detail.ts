import type {
  ApiOfferDetailData,
  ApiPromotionInsight,
  ApiUserInsight,
  OfferDetail,
  PromotionInsight,
  PromotionInsightCheckouts,
  PromotionInsightCustomerAcquisition,
  PromotionInsightRevenue,
  UserInsightRow,
} from "../types"
import { mapApiOfferToOffer } from "./offer"

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function mapRevenueInsight(
  revenue: ApiPromotionInsight["revenue_generated"]
): PromotionInsightRevenue {
  return {
    formatted: revenue.formatted,
    changePercent: revenue.change_percent,
    trend: revenue.trend,
    statusLabel: revenue.status_label,
    totalSales: revenue.total_sales,
  }
}

function mapCheckoutsInsight(
  checkouts: ApiPromotionInsight["checkouts"]
): PromotionInsightCheckouts {
  return {
    value: checkouts.value,
    changePercent: checkouts.change_percent,
    trend: checkouts.trend,
    weeklyBuckets: checkouts.weekly_buckets.map((bucket) => ({
      weekLabel: bucket.week_label,
      count: bucket.count,
    })),
  }
}

function mapCustomerAcquisitionInsight(
  acquisition: ApiPromotionInsight["customer_acquisition"]
): PromotionInsightCustomerAcquisition {
  return {
    newUsers: acquisition.new_users,
    changePercent: acquisition.change_percent,
    trend: acquisition.trend,
    distribution: acquisition.distribution.map((item) => ({
      range: item.range,
      count: item.count,
    })),
  }
}

function mapUserInsightRow(
  row: ApiUserInsight,
  index: number
): UserInsightRow {
  const userId =
    row.user_id != null
      ? String(row.user_id).startsWith("#")
        ? String(row.user_id)
        : `#${String(row.user_id).padStart(4, "0")}`
      : `#${String(index + 1).padStart(4, "0")}`

  return {
    id: String(row.id ?? row.user_id ?? index),
    userId,
    name: row.name,
    email: row.email,
    initials: getInitials(row.name),
    status: row.status,
    statusLabel: row.status_label ?? row.status,
    itemOrdered: row.item_ordered ?? "—",
    phoneNumber: row.phone_number ?? "—",
    amountSpent:
      row.amount_spent_formatted ??
      (row.amount_spent != null ? String(row.amount_spent) : "—"),
    promoCodeUsage:
      row.promocode_frequently ?? row.promo_code_usage_count ?? 0,
  }
}

export function mapApiOfferDetailData(data: ApiOfferDetailData): OfferDetail {
  return {
    offer: mapApiOfferToOffer(data.offer),
    promotionInsight: {
      revenueGenerated: mapRevenueInsight(data.promotion_insight.revenue_generated),
      checkouts: mapCheckoutsInsight(data.promotion_insight.checkouts),
      customerAcquisition: mapCustomerAcquisitionInsight(
        data.promotion_insight.customer_acquisition
      ),
    },
    userInsight: data.user_insight.map(mapUserInsightRow),
  }
}
