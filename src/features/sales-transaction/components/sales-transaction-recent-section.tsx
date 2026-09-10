"use client"

import { useMemo } from "react"

import { useSalesRecentTransactions } from "@/features/sales-transaction/hooks/use-sales-transaction-queries"
import { SalesTransactionNavCards } from "@/features/sales-transaction/components/sales-transaction-nav-cards"
import { SalesTransactionRecentTable } from "@/features/sales-transaction/components/sales-transaction-recent-table"
import {
  mapApiRecentTransactionsToHistoryPreview,
  mapApiRecentTransactionsToRows,
} from "@/features/sales-transaction/utils/map-recent-transactions"

const DEFAULT_RECENT_TRANSACTIONS_PARAMS = {
  limit: 10,
} as const

export function SalesTransactionRecentSection() {
  const { data: transactions = [], isPending, isFetching } =
    useSalesRecentTransactions(DEFAULT_RECENT_TRANSACTIONS_PARAMS)

  const recentRows = useMemo(
    () => mapApiRecentTransactionsToRows(transactions),
    [transactions],
  )

  const historyPreview = useMemo(
    () => mapApiRecentTransactionsToHistoryPreview(transactions),
    [transactions],
  )

  const isLoading = isPending || (isFetching && recentRows.length === 0)

  return (
    <>
      <SalesTransactionNavCards
        historyPreview={historyPreview}
        isLoading={isLoading}
      />

      <SalesTransactionRecentTable
        transactions={recentRows}
        isLoading={isLoading}
      />
    </>
  )
}
