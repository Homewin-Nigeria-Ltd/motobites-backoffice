"use client"

import { useMemo } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { SalesTransactionNavCards } from "@/features/sales-transaction/components/sales-transaction-nav-cards"
import { SalesTransactionQuickActions } from "@/features/sales-transaction/components/sales-transaction-quick-actions"
import { SalesTransactionRecentTable } from "@/features/sales-transaction/components/sales-transaction-recent-table"
import { SalesTransactionStats } from "@/features/sales-transaction/components/sales-transaction-stats"
import { useSalesTransactionManagement } from "@/features/sales-transaction/hooks/use-sales-transaction-queries"
import { mapTransactionManagementViewModel } from "@/features/sales-transaction/utils/map-transaction-management"

function SalesTransactionStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-background p-5"
        >
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-9 w-20" />
        </div>
      ))}
    </div>
  )
}

export function SalesTransactionSection() {
  const { data, isPending, isFetching, isError, error } =
    useSalesTransactionManagement()

  const viewModel = useMemo(
    () => (data ? mapTransactionManagementViewModel(data) : null),
    [data],
  )

  const isLoading = isPending || (isFetching && !viewModel)

  if (isError) {
    throw error
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
        {isLoading || !viewModel ? (
          <SalesTransactionStatsSkeleton />
        ) : (
          <SalesTransactionStats summary={viewModel.summary} />
        )}

        <SalesTransactionNavCards
          historyPreview={viewModel?.historyPreview ?? []}
          analyticsPreview={viewModel?.analyticsPreview}
          isLoading={isLoading}
        />

        <SalesTransactionRecentTable
          transactions={viewModel?.recentTransactions ?? []}
          isLoading={isLoading}
        />

        <SalesTransactionQuickActions />
      </div>
    </div>
  )
}
