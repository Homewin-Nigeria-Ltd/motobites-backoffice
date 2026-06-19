"use client"

import { DeliveryManagementSection } from "@/features/delivery-management"
import type { DeliveryTab } from "@/features/delivery-management/types"
import {
  OrderCardGrid,
  OrderDetailsModal,
  useOrderDetailsModal,
} from "@/features/order"
import { useOrderSearchQuery } from "@/features/order/hooks/use-order-queries"
import { AppLoader } from "@/components/ui/app-loader"
import { useDeliveryOrders } from "@/features/delivery-management/hooks/use-delivery-orders"

type DeliverySectionClientProps = {
  tab: DeliveryTab
}

export function DeliverySectionClient({ tab }: DeliverySectionClientProps) {
  const search = useOrderSearchQuery()
  const {
    selectedOrderId,
    detailsOpen,
    handleViewDetails,
    handleOpenChange,
  } = useOrderDetailsModal()
  const { orders, isPending, isError, error } = useDeliveryOrders(tab)

  if (isError) {
    throw error
  }

  let ordersContent: React.ReactNode = null

  if (isPending) {
    ordersContent = (
      <AppLoader className="min-h-48 rounded-2xl border border-border bg-background" />
    )
  } else if (orders.length === 0) {
    ordersContent = (
      <div className="flex min-h-48 items-center justify-center rounded-2xl border border-border bg-background p-12 text-center">
        <p className="text-sm text-muted-foreground">
          {search
            ? `No orders found matching "${search}".`
            : "No orders found for this filter."}
        </p>
      </div>
    )
  } else {
    ordersContent = (
      <>
        <OrderCardGrid orders={orders} onViewDetails={handleViewDetails} />
        <OrderDetailsModal
          key={selectedOrderId ?? "closed"}
          orderId={selectedOrderId}
          open={detailsOpen}
          onOpenChange={handleOpenChange}
        />
      </>
    )
  }

  return (
    <DeliveryManagementSection tab={tab} ordersContent={ordersContent} />
  )
}
