"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { offlineOrderQueries } from "@/features/offline-order/api/queries"
import { OfflineOrderOverviewStats } from "@/features/offline-order/components/overview/offline-order-overview-stats"
import { buildSummaryFromMetrics } from "@/features/offline-order/utils/build-overview-view-model"

export function OfflineOrderOverviewStatsSection() {
  const { data: metrics } = useSuspenseQuery(offlineOrderQueries.stats())

  return <OfflineOrderOverviewStats summary={buildSummaryFromMetrics(metrics)} />
}
