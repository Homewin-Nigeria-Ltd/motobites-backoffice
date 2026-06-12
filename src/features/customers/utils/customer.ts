import { formatNairaAmount } from "@/features/customers/utils/customer-format"
import { getInitials } from "@/utils/get-initials"

import type {
  ApiCustomer,
  ApiCustomerOverviewResponse,
  ApiCustomerOverviewStat,
  Customer,
  CustomerStatus,
  CustomerSummaryStat,
  CustomerTab,
  CustomerTrend,
} from "../types"

const TAB_LABELS: Record<CustomerTab, string> = {
  all: "All User",
  active: "Active User",
  deactivated: "Deactivated User",
  churn: "Churn User",
}

const TAB_KEY_ALIASES: Record<CustomerTab, string[]> = {
  all: ["all", "all_users", "all_user", "total", "total_users"],
  active: ["active", "active_users", "active_user"],
  deactivated: ["deactivated", "deactivated_users", "deactivated_user"],
  churn: ["churn", "churn_users", "churn_user", "churned", "churned_users"],
}

export function normalizeCustomerStatus(
  status: string | null | undefined
): CustomerStatus {
  if (!status?.trim()) {
    return "active"
  }

  const normalized = status.trim().toLowerCase()

  if (normalized === "active") {
    return "active"
  }

  if (normalized === "churn" || normalized === "churned") {
    return "churn"
  }

  if (normalized === "suspended") {
    return "suspended"
  }

  if (normalized === "deactivated" || normalized === "inactive") {
    return "deactivated"
  }

  if (normalized === "pending") {
    return "pending"
  }

  return "active"
}

const STATUS_LABELS: Record<CustomerStatus, string> = {
  active: "Active",
  deactivated: "Deactivated",
  churn: "Churn",
  suspended: "Suspended",
  pending: "Pending",
}

function formatUserId(userId: number | string | undefined, id: number) {
  if (userId === undefined) {
    return `#${String(id).padStart(4, "0")}`
  }

  const asString = String(userId)
  return asString.startsWith("#")
    ? asString
    : `#${asString.padStart(4, "0")}`
}

export function mapApiCustomerToCustomer(customer: ApiCustomer): Customer {
  const name =
    customer.name || customer.full_name || customer.email || "Customer"
  const status = normalizeCustomerStatus(customer.status)
  const todayTransaction =
    customer.today_transaction ?? customer.today_transaction_amount ?? 0
  const walletBalance = customer.wallet_balance ?? 0

  return {
    id: String(customer.id),
    userId:
      customer.user_code ?? formatUserId(customer.user_id, customer.id),
    name,
    email: customer.email ?? "—",
    initials: customer.initials || getInitials(name),
    status,
    statusLabel: customer.status_label ?? STATUS_LABELS[status],
    joinedAt: customer.joined_at ?? "—",
    phone: customer.phone ?? "—",
    todayTransaction,
    todayTransactionFormatted:
      customer.today_transaction_formatted ??
      formatNairaAmount(todayTransaction),
    walletBalance,
    walletBalanceFormatted:
      customer.wallet_balance_formatted ?? formatNairaAmount(walletBalance),
    ordersCount: customer.orders_count ?? 0,
  }
}

function normalizeOverviewKey(value: string | undefined): CustomerTab | null {
  if (!value) {
    return null
  }

  const normalized = value.trim().toLowerCase()

  for (const tab of Object.keys(TAB_KEY_ALIASES) as CustomerTab[]) {
    if (TAB_KEY_ALIASES[tab].includes(normalized)) {
      return tab
    }
  }

  return null
}

function normalizeTrend(trend: ApiCustomerOverviewStat["trend"]): CustomerTrend {
  return trend === "down" ? "down" : "up"
}

function mapOverviewStat(
  stat: ApiCustomerOverviewStat,
  fallbackKey?: CustomerTab
): CustomerSummaryStat | null {
  const key = normalizeOverviewKey(stat.key) ?? fallbackKey
  if (!key) {
    return null
  }

  return {
    key,
    label: stat.label || TAB_LABELS[key],
    value: stat.value ?? stat.count ?? 0,
    changePercent: stat.change_percent ?? stat.change ?? 0,
    trend: normalizeTrend(stat.trend),
  }
}

const OVERVIEW_TAB_ORDER: CustomerTab[] = [
  "all",
  "active",
  "deactivated",
  "churn",
]

export function mapApiOverviewToSummaryStats(
  data: ApiCustomerOverviewResponse["data"]
): CustomerSummaryStat[] {
  const kpis = data.kpis ?? []
  const mapped = kpis
    .map((stat) => mapOverviewStat(stat))
    .filter((stat): stat is CustomerSummaryStat => stat !== null)

  return OVERVIEW_TAB_ORDER.map(
    (tab) =>
      mapped.find((stat) => stat.key === tab) ?? {
        key: tab,
        label: TAB_LABELS[tab],
        value: 0,
        changePercent: 0,
        trend: "up" as const,
      }
  )
}

