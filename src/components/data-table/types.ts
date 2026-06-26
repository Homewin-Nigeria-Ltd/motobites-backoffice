import type { ColumnDef, Table as TanstackTable } from "@tanstack/react-table"
import type { ReactNode } from "react"

export type DataTableProps<TData, TValue = unknown> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  onRowClick?: (row: TData) => void
  toolbar?: ReactNode
  emptyMessage?: string
  isLoading?: boolean
  className?: string
  tableClassName?: string
}

export type DataTablePaginationState = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export type { ColumnDef, TanstackTable }
