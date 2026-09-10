"use client"

import { useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"

import { DataTable } from "@/components/data-table"
import { PaginationControls } from "@/components/pagination-controls"
import { OfflineOrderBackButton } from "@/features/offline-order/components/offline-order-back-button"
import { useSalesTransactions } from "@/features/sales-transaction/hooks/use-sales-transaction-queries"
import { salesTransactionHistoryColumns } from "@/features/sales-transaction/columns/sales-transaction-history-columns"
import { SalesTransactionHistoryFiltersBar } from "@/features/sales-transaction/components/sales-transaction-history-filters"
import { SalesTransactionHistoryStats } from "@/features/sales-transaction/components/sales-transaction-history-stats"
import type { SalesTransactionHistoryFilters } from "@/features/sales-transaction/types"
import { SALES_TRANSACTION_HISTORY_SUMMARY } from "@/features/sales-transaction/constants/history-mock-data"
import {
  buildTransactionDateQueryParams,
  getDefaultTransactionDateRangePickerValue,
} from "@/features/sales-transaction/utils/date-range"
import { mapApiTransactionToHistoryRow } from "@/features/sales-transaction/utils/map-transaction-history"
import { useDebouncedSearch } from "@/features/restaurant/hooks/use-debounced-search"

const DEFAULT_PAGE_SIZE = 20

const DEFAULT_FILTERS: SalesTransactionHistoryFilters = {
  search: "",
  source: "all",
  method: "all",
  status: "all",
}

export function SalesTransactionHistorySection() {
  const [filters, setFilters] =
    useState<SalesTransactionHistoryFilters>(DEFAULT_FILTERS)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    getDefaultTransactionDateRangePickerValue(),
  )
  const [page, setPage] = useState(1)
  const { value: search, setValue: setSearch, debouncedValue } =
    useDebouncedSearch("")

  const { dateFrom, dateTo } = buildTransactionDateQueryParams(dateRange)

  const queryParams = useMemo(
    () => ({
      date_from: dateFrom,
      date_to: dateTo,
      source: filters.source !== "all" ? filters.source : undefined,
      payment_method: filters.method !== "all" ? filters.method : undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      search: debouncedValue.trim() || undefined,
      page,
      per_page: DEFAULT_PAGE_SIZE,
    }),
    [
      dateFrom,
      dateTo,
      debouncedValue,
      filters.method,
      filters.source,
      filters.status,
      page,
    ],
  )

  const { data, isPending, isFetching, isError, error } =
    useSalesTransactions(queryParams)

  const rows = useMemo(
    () => (data?.data ?? []).map(mapApiTransactionToHistoryRow),
    [data?.data],
  )

  const totalRecords = data?.meta.total ?? 0
  const totalPages = data?.meta.last_page ?? 1
  const currentPage = data?.meta.current_page ?? page
  const perPage = data?.meta.per_page ?? DEFAULT_PAGE_SIZE

  const rangeStart =
    rows.length === 0 ? 0 : (currentPage - 1) * perPage + 1
  const rangeEnd =
    rows.length === 0 ? 0 : rangeStart + rows.length - 1

  if (isError) {
    throw error
  }

  const handleFiltersChange = (nextFilters: SalesTransactionHistoryFilters) => {
    setFilters(nextFilters)
    setPage(1)
  }

  const handleDateRangeChange = (nextDateRange: DateRange | undefined) => {
    setDateRange(nextDateRange)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setFilters((current) => ({ ...current, search: value }))
    setPage(1)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <OfflineOrderBackButton
        href="/offline-order/sales-transaction"
        label="Back to Sales Transaction"
      />

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
        <SalesTransactionHistoryFiltersBar
          filters={{ ...filters, search }}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onFiltersChange={handleFiltersChange}
          onSearchChange={handleSearchChange}
        />

        <SalesTransactionHistoryStats
          summary={SALES_TRANSACTION_HISTORY_SUMMARY}
        />

        <div className="overflow-hidden rounded-2xl border border-border bg-background">
          <DataTable
            columns={salesTransactionHistoryColumns}
            data={rows}
            emptyMessage="No transactions match your filters."
            isLoading={isPending || (isFetching && rows.length === 0)}
            className="border-0 rounded-none"
            tableClassName="min-w-[72rem]"
          />

          <div className="flex flex-col gap-4 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {rows.length > 0
                ? `Showing ${rangeStart}-${rangeEnd} of ${totalRecords.toLocaleString()} transactions`
                : "No transactions to display"}
            </p>

            <PaginationControls
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
