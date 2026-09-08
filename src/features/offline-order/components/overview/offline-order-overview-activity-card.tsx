import type { OfflineOrderOverviewActivityRow } from "@/features/offline-order/types"
import { cn } from "@/lib/utils"

type OfflineOrderOverviewActivityCardProps = {
  activity: OfflineOrderOverviewActivityRow[]
}

function getActivityBadgeClass(badgeType: string) {
  const normalized = badgeType.toLowerCase()

  if (normalized.includes("success")) {
    return "bg-emerald-100 text-emerald-700"
  }

  if (normalized.includes("void") || normalized.includes("cancel")) {
    return "bg-red-100 text-red-700"
  }

  if (normalized.includes("hold") || normalized.includes("saved")) {
    return "bg-sky-100 text-sky-700"
  }

  if (normalized.includes("payment") || normalized.includes("paid")) {
    return "bg-primary/10 text-primary"
  }

  return "bg-muted text-muted-foreground"
}

export function OfflineOrderOverviewActivityCard({
  activity,
}: OfflineOrderOverviewActivityCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time operational events.
        </p>
      </div>

      <div className="space-y-4">
        {activity.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No recent activity yet.
          </p>
        ) : (
          activity.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between gap-4 border-b border-border/70 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="min-w-0 space-y-2">
                <p className="text-sm text-foreground">{entry.title}</p>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                    getActivityBadgeClass(entry.badgeType),
                  )}
                >
                  {entry.badge}
                </span>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {entry.timeLabel}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
