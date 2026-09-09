"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { offlineOrderQueries } from "@/features/offline-order/api/queries"
import { OfflineOrderOverviewStaffCard } from "@/features/offline-order/components/overview/offline-order-overview-staff-card"
import { mapOverviewStaffRows } from "@/features/offline-order/utils/build-overview-view-model"

export function OfflineOrderOverviewStaffSection() {
  const { data: topStaff } = useSuspenseQuery(offlineOrderQueries.topStaff())

  return <OfflineOrderOverviewStaffCard staff={mapOverviewStaffRows(topStaff)} />
}
