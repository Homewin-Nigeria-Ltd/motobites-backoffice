"use client"

import Link from "next/link"
import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"

import { customerColumns } from "@/features/customers/columns"
import { CustomerSummaryCards } from "@/features/customers/components/customer-summary-cards"
import { CustomerToolbar } from "@/features/customers/components/customer-toolbar"
import { useCustomerList, useCustomerOverview } from "@/features/customers"
import type { CustomerTab } from "@/features/customers/types"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"

const DEFAULT_PAGE_SIZE = 8

export function CustomerManagementSection() {
  const [tab, setTab] = useState<CustomerTab>("all")
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  })

  const { data: overviewData, isPending: isOverviewPending } =
    useCustomerOverview()
  const { data, isPending, isFetching } = useCustomerList({
    tab,
    search,
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
  })

  const handleTabChange = (value: CustomerTab) => {
    setTab(value)
    setPagination((current) => ({ ...current, pageIndex: 0 }))
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

  const items = data?.items ?? []
  const totalPages = data?.meta.last_page ?? 1
  const currentPage = data?.meta.current_page ?? pagination.pageIndex + 1
  const stats = overviewData?.stats ?? []

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 bg-muted p-4 md:gap-6 md:p-6">
      <div className="flex justify-end">
        <Button asChild className="h-10 px-4">
          <Link href="/customer-retention-and-loyalty">
            View Promotion and Discounts
          </Link>
        </Button>
      </div>

      <CustomerSummaryCards stats={stats} isLoading={isOverviewPending} />

      <DataTable
        columns={customerColumns}
        data={items}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isPending || (isFetching && items.length === 0)}
        toolbar={
          <CustomerToolbar
            tab={tab}
            onTabChange={handleTabChange}
            search={search}
            onSearchChange={handleSearchChange}
          />
        }
      />
    </div>
  )
}
