"use client"

import { useEffect, useState } from "react"

import { RiderSummaryCards } from "../components/rider-summary-cards"
import { RidersTable } from "../components/riders-table"
import { useRiders } from "../hooks/use-riders"
import { useRidersStatusFilter } from "../hooks/use-riders-status-filter"
import type { RiderOverviewStatus } from "../types"
import { Input } from "@/components/ui/input"

type RidersSectionProps = {
  search?: string
  onSearchChange?: (value: string) => void
}

export function RidersSection({
  search: externalSearch,
  onSearchChange: onExternalSearchChange,
}: RidersSectionProps = {}) {
  const [internalSearch, setInternalSearch] = useState("")
  const [page, setPage] = useState(1)
  const [debouncedSearch, setDebouncedSearch] = useState(
    externalSearch ?? internalSearch
  )
  const { status, setStatus } = useRidersStatusFilter()

  const search = externalSearch ?? internalSearch
  const setSearch = onExternalSearchChange ?? setInternalSearch
  const isExternalSearch = onExternalSearchChange !== undefined
  const showSearchInput = !isExternalSearch

  useEffect(() => {
    if (isExternalSearch) {
      return
    }

    const timer = window.setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)

    return () => window.clearTimeout(timer)
  }, [isExternalSearch, search])

  const querySearch = isExternalSearch ? search : debouncedSearch
  const [paginationFilters, setPaginationFilters] = useState({
    querySearch,
    status,
  })

  if (
    paginationFilters.querySearch !== querySearch ||
    paginationFilters.status !== status
  ) {
    setPaginationFilters({ querySearch, status })
    setPage(1)
  }

  const { data, isPending, isError, error, isFetching } = useRiders({
    page,
    per_page: 20,
    search: querySearch,
    status,
  })

  if (isError) {
    throw error
  }

  const riders = data?.data ?? []
  const currentPage = data?.meta.current_page ?? page
  const totalPages = data?.meta.last_page ?? 1
  const isLoading = isPending || (isFetching && riders.length === 0)

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const handleStatusSelect = (nextStatus: RiderOverviewStatus) => {
    setStatus(status === nextStatus ? "all" : nextStatus)
    setPage(1)
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="min-h-0 flex-1 space-y-8 overflow-y-auto p-4 md:p-6">
        {showSearchInput ? (
          <div className="flex justify-end">
            <div className="w-full max-w-xs sm:w-64">
              <Input
                type="search"
                icon={{ name: "search", position: "left" }}
                placeholder="Search riders"
                className="h-10"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
              />
            </div>
          </div>
        ) : null}

        <RiderSummaryCards
          search={querySearch}
          selected={status}
          onSelect={handleStatusSelect}
        />

        <RidersTable
          riders={riders}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
