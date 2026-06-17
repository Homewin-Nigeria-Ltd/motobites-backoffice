"use client"

import { riderColumns } from "../columns"
import type { ApiRider } from "../types"
import { DataTable } from "@/components/data-table"

type RidersTableProps = {
  riders: ApiRider[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function RidersTable({
  riders,
  page,
  totalPages,
  onPageChange,
  isLoading = false,
}: RidersTableProps) {
  return (
    <DataTable
      columns={riderColumns}
      data={riders}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      isLoading={isLoading}
      emptyMessage="No riders found."
      tableClassName="min-w-4xl"
    />
  )
}
