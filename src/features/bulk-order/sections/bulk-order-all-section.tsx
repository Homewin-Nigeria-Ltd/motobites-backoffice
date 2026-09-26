"use client"

import Link from "next/link"
import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { OfflineOrderSearchToolbar } from "@/features/offline-order/components/offline-order-search-toolbar"
import { useBranchFilter } from "@/context/branch-context"

import { createBulkOrdersColumns } from "../columns/bulk-orders-columns"
import { useBulkOrders } from "../hooks/use-bulk-order-queries"

const DEFAULT_PAGE_SIZE = 10

export function BulkOrderAllSection() {
  const { branchId } = useBranchFilter()
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  })

  const query = useBulkOrders({
    search: search.trim() || undefined,
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    fulfillment_branch_id: branchId ?? undefined,
  })

  const orders = query.data?.data ?? []
  const totalPages = query.data?.meta.last_page ?? 1
  const currentPage =
    query.data?.meta.current_page ?? pagination.pageIndex + 1
  const columns = createBulkOrdersColumns()

  if (query.isError) {
    throw query.error
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

  return (
    <div className="flex flex-col bg-muted p-4 md:p-6">
      <DataTable
        columns={columns}
        data={orders}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={query.isPending || (query.isFetching && orders.length === 0)}
        emptyMessage={
          search
            ? "No bulk orders match your search."
            : "No completed bulk orders found yet."
        }
        toolbar={
          <OfflineOrderSearchToolbar
            search={search}
            onSearchChange={handleSearchChange}
            placeholder="Search bulk orders by ID or customer..."
          />
        }
      />

      <div className="mt-4 shrink-0">
        <Button asChild variant="ghost">
          <Link href="/offline-order/bulk">Back to Bulk Order</Link>
        </Button>
      </div>
    </div>
  )
}
