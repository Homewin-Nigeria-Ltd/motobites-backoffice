"use client"

import { PaginationControls } from "@/components/pagination-controls"
import type { DataTablePaginationState } from "@/components/data-table/types"
import { cn } from "@/lib/utils"

type DataTablePaginationProps = DataTablePaginationState & {
  className?: string
}

export function DataTablePagination({
  page,
  totalPages,
  onPageChange,
  className,
}: DataTablePaginationProps) {
  return (
    <div
      data-slot="data-table-pagination"
      className={cn("flex justify-center py-4", className)}
    >
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}
