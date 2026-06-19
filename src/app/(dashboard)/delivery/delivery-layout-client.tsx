"use client"

import { DeliveryHubLayoutClient } from "@/features/delivery-management/components/delivery-hub-layout-client"
import { useOrderSearchInput } from "@/features/order/hooks/use-order-queries"

export function DeliveryLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const { value: search, setValue: setSearch } = useOrderSearchInput()

  return (
    <DeliveryHubLayoutClient search={search} onSearchChange={setSearch}>
      {children}
    </DeliveryHubLayoutClient>
  )
}
