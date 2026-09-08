"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { offlineOrderQueries } from "@/features/offline-order/api/queries"
import { OfflineOrderOverviewActivityCard } from "@/features/offline-order/components/overview/offline-order-overview-activity-card"
import { mapOverviewActivityRows } from "@/features/offline-order/utils/build-overview-view-model"

export function OfflineOrderOverviewActivitySection() {
  const { data: recentActivity } = useSuspenseQuery(
    offlineOrderQueries.recentActivity(),
  )

  return (
    <OfflineOrderOverviewActivityCard
      activity={mapOverviewActivityRows(recentActivity)}
    />
  )
}
