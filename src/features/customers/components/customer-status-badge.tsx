import { Badge } from "@/components/ui/badge"
import type { CustomerStatus } from "@/features/customers/types"
import { cn } from "@/lib/utils"

const statusConfig: Record<
  CustomerStatus,
  { label: string; dot: string; badge: string }
> = {
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-700",
  },
  pending: {
    label: "Pending",
    dot: "bg-primary",
    badge: "bg-primary/10 text-primary",
  },
  deactivated: {
    label: "Deactivated",
    dot: "bg-destructive",
    badge: "bg-destructive/10 text-destructive",
  },
  suspended: {
    label: "Suspended",
    dot: "bg-primary",
    badge: "bg-primary/10 text-primary",
  },
  churn: {
    label: "Churn",
    dot: "bg-destructive",
    badge: "bg-destructive/10 text-destructive",
  },
}

export function CustomerStatusBadge({
  status,
  label,
}: {
  status: CustomerStatus
  label?: string
}) {
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
      {label ?? config.label}
    </Badge>
  )
}
