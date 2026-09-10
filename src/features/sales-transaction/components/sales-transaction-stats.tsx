import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { SalesTransactionSummary } from "@/features/sales-transaction/types"
import { formatSalesTransactionAmount } from "@/features/sales-transaction/utils/format"

type SalesTransactionStatsProps = {
  summary: SalesTransactionSummary
}

type StatCardProps = {
  label: string
  value: string
  badge: string
  badgeClassName: string
  valueClassName?: string
}

function StatCard({
  label,
  value,
  badge,
  badgeClassName,
  valueClassName,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Badge
          className={cn("border-0 px-2 py-0.5 text-[11px] font-medium", badgeClassName)}
        >
          {badge}
        </Badge>
      </div>
      <p
        className={cn(
          "mt-4 text-3xl font-semibold tracking-tight text-foreground",
          valueClassName,
        )}
      >
        {value}
      </p>
    </div>
  )
}

export function SalesTransactionStats({ summary }: SalesTransactionStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Today's Transactions"
        value={String(summary.todayTransactions)}
        badge={summary.todayTransactionsBadge}
        badgeClassName="bg-emerald-100 text-emerald-700"
      />
      <StatCard
        label="Today's Revenue"
        value={formatSalesTransactionAmount(summary.todayRevenue)}
        badge={summary.todayRevenueBadge}
        badgeClassName="bg-emerald-100 text-emerald-700"
        valueClassName="text-primary"
      />
      <StatCard
        label="Pending Orders"
        value={String(summary.pendingOrders)}
        badge={summary.pendingOrdersBadge}
        badgeClassName="bg-amber-100 text-amber-700"
      />
      <StatCard
        label="Active Staff"
        value={String(summary.activeStaff)}
        badge={summary.activeStaffBadge}
        badgeClassName="bg-sky-100 text-sky-700"
      />
    </div>
  )
}
