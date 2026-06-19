"use client"

import { DeliveryManagementLayout } from "../sections/delivery-management-layout"
import { useDeliveryTabCounts } from "../hooks/use-delivery-orders"

type DeliveryHubLayoutClientProps = {
  children: React.ReactNode
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
}

export function DeliveryHubLayoutClient({
  children,
  search,
  onSearchChange,
  searchPlaceholder,
}: DeliveryHubLayoutClientProps) {
  const counts = useDeliveryTabCounts()

  return (
    <DeliveryManagementLayout
      counts={counts}
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder}
    >
      {children}
    </DeliveryManagementLayout>
  )
}
