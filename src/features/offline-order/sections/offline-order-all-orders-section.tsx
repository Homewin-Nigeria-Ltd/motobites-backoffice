"use client"

import Link from "next/link"
import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { allOrdersColumns } from "@/features/offline-order/columns/all-orders-columns"
import { OfflineOrderSearchToolbar } from "@/features/offline-order/components/offline-order-search-toolbar"
import { useSalesDashboardOrders } from "@/features/offline-order/hooks/use-offline-order-queries"

const DEFAULT_PAGE_SIZE = 10

export function OfflineOrderAllOrdersSection() {
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  })

  const { data, isPending, isFetching, isError, error } = useSalesDashboardOrders({
    search: search.trim() || undefined,
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
  })

  const orders = data?.data ?? []
  const totalPages = data?.meta.last_page ?? 1
  const currentPage = data?.meta.current_page ?? pagination.pageIndex + 1

  if (isError) {
    throw error
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((current) => ({
      ...current,
      pageIndex: page - 1,
    }))
  }

  const emptyMessage = search
    ? "No orders match your search."
    : "No offline orders found yet."

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <DataTable
        columns={allOrdersColumns}
        data={orders}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isPending || (isFetching && orders.length === 0)}
        emptyMessage={emptyMessage}
        toolbar={
          <OfflineOrderSearchToolbar
            search={search}
            onSearchChange={handleSearchChange}
            placeholder="Search orders by ID or customer..."
          />
        }
      />

        <div className="mt-4">
          <Button asChild variant="ghost">
            <Link href="/offline-order/new">Back to New Order</Link>
          </Button>
        </div>
    </div>
  )
}
