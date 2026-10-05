import type { OrderRejectionSource } from "@/features/order/utils/order-rejection"
import { formatDate } from "@/features/order/utils/date"
import {
  formatRejectedBy,
  getOrderRejection,
} from "@/features/order/utils/order-rejection"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type OrderRejectionDetailsProps = {
  order: OrderRejectionSource
  className?: string
}

export function OrderRejectionDetails({
  order,
  className,
}: OrderRejectionDetailsProps) {
  const details = getOrderRejection(order)

  if (!details) {
    return null
  }

  return (
    <div className={cn("space-y-3 rounded-xl border border-border bg-muted/40 p-4", className)}>
      <p className="text-sm font-medium text-foreground">Rejection</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-sm font-normal text-muted-foreground">Reason</Label>
          <p className="text-sm font-medium text-foreground">{details.reason}</p>
        </div>
        {details.rejected_by ? (
          <div className="space-y-1">
            <Label className="text-sm font-normal text-muted-foreground">Rejected by</Label>
            <p className="text-sm font-medium text-foreground">
              {formatRejectedBy(details.rejected_by)}
            </p>
          </div>
        ) : null}
        {details.rejected_at ? (
          <div className="space-y-1">
            <Label className="text-sm font-normal text-muted-foreground">Rejected at</Label>
            <p className="text-sm font-medium text-foreground">
              {formatDate(details.rejected_at)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
