"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { offlineOrderQueries } from "@/features/offline-order/api/queries"
import { OfflineOrderOverviewTransactionsCard } from "@/features/offline-order/components/overview/offline-order-overview-transactions-card"
import { mapOverviewTransactionRows } from "@/features/offline-order/utils/build-overview-view-model"

const DEFAULT_RECENT_TRANSACTIONS_PARAMS = {
  limit: 10,
} as const

export function OfflineOrderOverviewTransactionsSection() {
  const { data: transactions } = useSuspenseQuery(
    offlineOrderQueries.recentTransactions(DEFAULT_RECENT_TRANSACTIONS_PARAMS),
  )

  return (
    <OfflineOrderOverviewTransactionsCard
      transactions={mapOverviewTransactionRows(transactions)}
    />
  )
}
