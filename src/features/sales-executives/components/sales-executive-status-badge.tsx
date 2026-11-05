import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { formatSalesExecutiveStatus } from "../utils/map-sales-executive"

export function SalesExecutiveStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-auto rounded-full border-0 px-3 py-1 text-xs font-medium",
        status === "approved" && "bg-emerald-50 text-emerald-700",
        status === "rejected" && "bg-rose-50 text-rose-700",
        status === "under_review" && "bg-amber-50 text-amber-700",
        status !== "approved" &&
          status !== "rejected" &&
          status !== "under_review" &&
          "bg-secondary text-primary"
      )}
    >
      {formatSalesExecutiveStatus(status)}
    </Badge>
  )
}
