"use client"

import { OrderDetailsModal } from "@/features/order/components/order-details-modal"
import { OrderHubSection } from "@/features/order/components/order-hub-section"
import { useOrderDetailsModal } from "@/features/order/hooks/use-order-details-modal"
import { useOrderSearchQuery, useOrders } from "@/features/order/hooks/use-order-queries"
import type { OrderTab } from "@/features/order/types"
import { AppLoader } from "@/components/ui/app-loader"

type OrderManagementSectionProps = {
  tab: OrderTab
}

export function OrderManagementSection({ tab }: OrderManagementSectionProps) {
  const search = useOrderSearchQuery()
  const {
    selectedOrderId,
    detailsOpen,
    handleViewDetails,
    handleOpenChange,
  } = useOrderDetailsModal()

  const { data, isPending, isError, error } = useOrders({ tab, search })

  const groups = data?.groups ?? []

  const totalVisibleOrders = groups.reduce(
    (sum, group) => sum + group.orders.length,
    0
  )

  if (isError) {
    throw error
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto p-4 md:p-6">
          {isPending && tab !== "performance" ? (
            <AppLoader className="min-h-48 flex-1 rounded-2xl border border-border bg-background" />
          ) : tab === "performance" ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-border bg-background p-12 text-center">
              <p className="max-w-md text-sm text-muted-foreground">
                Performance insights for your order operations will appear here.
              </p>
            </div>
          ) : totalVisibleOrders === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-border bg-background p-12 text-center">
              <p className="text-sm text-muted-foreground">
                {search
                  ? `No orders found matching "${search}".`
                  : "No orders found for this filter."}
              </p>
            </div>
          ) : (
            groups.map((group, index) => (
              <OrderHubSection
                key={group.kitchen?.id ?? `group-${index}`}
                group={group}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>
      </div>

      <OrderDetailsModal
        key={selectedOrderId ?? "closed"}
        orderId={selectedOrderId}
        open={detailsOpen}
        onOpenChange={handleOpenChange}
      />
    </>
  )
}
