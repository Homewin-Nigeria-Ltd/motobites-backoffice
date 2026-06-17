"use client"

import { usePathname } from "next/navigation"

import { DeliveryManagementLayout } from "@/features/delivery-management"
import { getDeliveryTabPath } from "@/features/delivery-management/types"
import { useOrderSearchInput } from "@/features/order/hooks/use-order-queries"
import { useDeliveryTabCounts } from "./use-delivery-orders"

export function DeliveryStatusLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const counts = useDeliveryTabCounts()
  const { value: search, setValue: setSearch } = useOrderSearchInput()
  const isRidersTab = pathname === getDeliveryTabPath("riders")

  return (
    <DeliveryManagementLayout
      counts={counts}
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder={
        isRidersTab ? "Search riders" : "Search order using order number"
      }
    >
      {children}
    </DeliveryManagementLayout>
  )
}
