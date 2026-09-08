import type { OfflineOrderOverviewSummary } from "@/features/offline-order/types"
import { formatOverviewCurrency } from "@/features/offline-order/utils/build-overview-view-model"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type OfflineOrderOverviewStatsProps = {
  summary: OfflineOrderOverviewSummary
}

type StatCardProps = {
  label: string
  value: string
  badge: string
  badgeClassName: string
}

function StatCard({ label, value, badge, badgeClassName }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Badge className={cn("border-0 px-2 py-0.5 text-[11px] font-medium", badgeClassName)}>
          {badge}
        </Badge>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  )
}

export function OfflineOrderOverviewStats({ summary }: OfflineOrderOverviewStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Active Orders"
        value={String(summary.activeOrders)}
        badge={summary.activeOrdersBadge}
        badgeClassName="bg-sky-100 text-sky-700"
      />
      <StatCard
        label="Saved / On Hold"
        value={String(summary.savedOnHold)}
        badge={summary.savedOnHoldBadge}
        badgeClassName="bg-amber-100 text-amber-700"
      />
      <StatCard
        label="Completed Today"
        value={String(summary.completedToday)}
        badge={summary.completedTodayBadge}
        badgeClassName="bg-emerald-100 text-emerald-700"
      />
      <StatCard
        label="Today's Offline Revenue"
        value={formatOverviewCurrency(summary.todayRevenue)}
        badge={summary.todayRevenueBadge}
        badgeClassName="bg-primary/10 text-primary"
      />
    </div>
  )
}
