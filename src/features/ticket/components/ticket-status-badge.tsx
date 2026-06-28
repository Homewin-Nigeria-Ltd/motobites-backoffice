import { Badge } from "@/components/ui/badge"
import type { TicketStatus } from "@/features/ticket/types"
import { cn } from "@/lib/utils"

const statusConfig: Record<
  TicketStatus,
  { dot: string; badge: string }
> = {
  open: {
    dot: "bg-primary",
    badge: "bg-primary/10 text-primary",
  },
  new: {
    dot: "bg-primary",
    badge: "bg-primary/10 text-primary",
  },
  closed: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-700",
  },
  resolved: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-700",
  },
  overdue: {
    dot: "bg-destructive",
    badge: "bg-destructive/10 text-destructive",
  },
  unresolved: {
    dot: "bg-destructive",
    badge: "bg-destructive/10 text-destructive",
  },
}

export function TicketStatusBadge({
  status,
  label,
}: {
  status: TicketStatus
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
      {label ?? status}
    </Badge>
  )
}
