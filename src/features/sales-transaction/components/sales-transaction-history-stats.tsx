import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { SalesTransactionHistorySummary } from "@/features/sales-transaction/types"
import { formatSalesTransactionAmount } from "@/features/sales-transaction/utils/format"

type SalesTransactionHistoryStatsProps = {
  summary: SalesTransactionHistorySummary
  isLoading?: boolean
}

export function SalesTransactionHistoryStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-background p-5"
        >
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-9 w-24" />
          <Skeleton className="mt-2 h-4 w-36" />
        </div>
      ))}
    </div>
  )
}

type StatCardProps = {
  label: string
  value: string
  badge?: string
  badgeClassName?: string
  subtitle: string
}

function StatCard({
  label,
  value,
  badge,
  badgeClassName,
  subtitle,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {badge ? (
          <Badge
            className={cn(
              "border-0 px-2 py-0.5 text-[11px] font-medium",
              badgeClassName,
            )}
          >
            {badge}
          </Badge>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}

export function SalesTransactionHistoryStats({
  summary,
  isLoading = false,
}: SalesTransactionHistoryStatsProps) {
  if (isLoading) {
    return <SalesTransactionHistoryStatsSkeleton />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Transactions"
        value={String(summary.totalTransactions)}
        badge={summary.totalTransactionsBadge}
        badgeClassName="bg-emerald-100 text-emerald-700"
        subtitle={summary.totalTransactionsSubtitle}
      />
      <StatCard
        label="Total Revenue"
        value={formatSalesTransactionAmount(summary.totalRevenue)}
        badge={summary.totalRevenueBadge}
        badgeClassName="bg-emerald-100 text-emerald-700"
        subtitle={summary.totalRevenueSubtitle}
      />
      <StatCard
        label="Average Order Value"
        value={formatSalesTransactionAmount(summary.averageOrderValue)}
        badge={summary.averageOrderValueBadge}
        badgeClassName="bg-emerald-100 text-emerald-700"
        subtitle={summary.averageOrderValueSubtitle}
      />
      <StatCard
        label="Refunded Operations"
        value={`${summary.refundedCount} / ${formatSalesTransactionAmount(summary.refundedAmount)}`}
        badge={summary.refundedBadge}
        badgeClassName="bg-emerald-100 text-emerald-700"
        subtitle={summary.refundedSubtitle}
      />
    </div>
  )
}
