import { Badge } from "@/components/ui/badge"
import type { StaffStatus } from "@/features/staff/types"
import { cn } from "@/lib/utils"

const statusConfig: Record<
  StaffStatus,
  { label: string; dot: string; badge: string }
> = {
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-700",
  },
  away: {
    label: "Away",
    dot: "bg-primary",
    badge: "bg-primary/10 text-primary",
  },
  inactive: {
    label: "Inactive",
    dot: "bg-destructive",
    badge: "bg-destructive/10 text-destructive",
  },
}

export function StaffStatusBadge({ status }: { status: StaffStatus }) {
  const config = statusConfig[status]

  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-auto gap-1.5 rounded-full border-0 px-2.5 py-1 text-xs font-medium",
        config.badge
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", config.dot)} />
      {config.label}
    </Badge>
  )
}
