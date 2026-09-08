"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { offlineOrderQueries } from "@/features/offline-order/api/queries"
import { OfflineOrderOverviewSavedCard } from "@/features/offline-order/components/overview/offline-order-overview-saved-card"
import { mapOverviewSavedOrderRows } from "@/features/offline-order/utils/build-overview-view-model"

export function OfflineOrderOverviewSavedSection() {
  const { data } = useSuspenseQuery(
    offlineOrderQueries.savedOrders({ per_page: 50 }),
  )

  return (
    <OfflineOrderOverviewSavedCard
      orders={mapOverviewSavedOrderRows(data.data ?? [])}
    />
  )
}
