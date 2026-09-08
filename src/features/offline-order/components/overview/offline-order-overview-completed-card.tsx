import Link from "next/link"

import type { OfflineOrderOverviewOrderRow } from "@/features/offline-order/types"
import { formatOverviewCurrency } from "@/features/offline-order/utils/build-overview-view-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type OfflineOrderOverviewCompletedCardProps = {
  orders: OfflineOrderOverviewOrderRow[]
}

export function OfflineOrderOverviewCompletedCard({
  orders,
}: OfflineOrderOverviewCompletedCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Badge className="border-0 bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
            Success
          </Badge>
          <h3 className="text-base font-semibold text-foreground">
            Recent Completed Orders
          </h3>
        </div>
        <Button asChild variant="link" className="h-auto p-0 text-primary">
          <Link href="/offline-order/new">View History</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No completed orders yet today.
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-3 border-b border-border/70 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    #{order.orderNumber}
                  </span>
                  <span>{order.timeLabel}</span>
                </div>
                <p className="mt-1 truncate text-sm font-medium text-foreground">
                  {order.customerName}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                  {order.itemsCount} item{order.itemsCount === 1 ? "" : "s"}
                </Badge>
                <span className="min-w-[5rem] text-sm font-semibold text-foreground">
                  {formatOverviewCurrency(order.total)}
                </span>
                <Badge className="border-0 bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                  Paid
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
