"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { offlineOrderQueries } from "@/features/offline-order/api/queries"
import { OfflineOrderOverviewCompletedCard } from "@/features/offline-order/components/overview/offline-order-overview-completed-card"
import { mapOverviewCompletedOrderRows } from "@/features/offline-order/utils/build-overview-view-model"

export function OfflineOrderOverviewCompletedSection() {
  const { data } = useSuspenseQuery(
    offlineOrderQueries.orders({ per_page: 50 }),
  )

  return (
    <OfflineOrderOverviewCompletedCard
      orders={mapOverviewCompletedOrderRows(data.data ?? [])}
    />
  )
}
