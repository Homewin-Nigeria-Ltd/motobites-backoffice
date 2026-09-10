import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { SalesTransactionAnalyticsSummary } from "@/features/sales-transaction/types"
import { formatSalesTransactionAmount } from "@/features/sales-transaction/utils/format"

type SalesTransactionAnalyticsStatsProps = {
  summary: SalesTransactionAnalyticsSummary
}

type StatCardProps = {
  label: string
  value: string
  badge: string
  subtitle: string
}

function StatCard({ label, value, badge, subtitle }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Badge className="border-0 bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
          {badge}
        </Badge>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className={cn("mt-1 text-sm text-muted-foreground")}>{subtitle}</p>
    </div>
  )
}

export function SalesTransactionAnalyticsStats({
  summary,
}: SalesTransactionAnalyticsStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Revenue"
        value={formatSalesTransactionAmount(summary.totalRevenue)}
        badge={summary.totalRevenueBadge}
        subtitle={summary.totalRevenueSubtitle}
      />
      <StatCard
        label="Transaction Count"
        value={String(summary.transactionCount)}
        badge={summary.transactionCountBadge}
        subtitle={summary.transactionCountSubtitle}
      />
      <StatCard
        label="Average Order Value"
        value={formatSalesTransactionAmount(summary.averageOrderValue)}
        badge={summary.averageOrderValueBadge}
        subtitle={summary.averageOrderValueSubtitle}
      />
      <StatCard
        label="Completion Rate"
        value={`${summary.completionRate}%`}
        badge={summary.completionRateBadge}
        subtitle={summary.completionRateSubtitle}
      />
    </div>
  )
}
