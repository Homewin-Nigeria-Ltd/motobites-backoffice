"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import type { DataTableProps } from "@/components/data-table/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AppLoader } from "@/components/ui/app-loader"
import { cn } from "@/lib/utils"

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  totalPages,
  onPageChange,
  onRowClick,
  toolbar,
  emptyMessage = "No results.",
  isLoading = false,
  className,
  tableClassName,
}: DataTableProps<TData, TValue>) {
  const showPagination =
    page !== undefined &&
    totalPages !== undefined &&
    onPageChange !== undefined
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table returns unstable function refs
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const columnCount = columns.length

  return (
    <div
      data-slot="data-table"
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border border-border bg-background",
        className
      )}
    >
      {toolbar}

      <Table className={cn("min-w-[56rem]", tableClassName)}>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-border hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-auto px-4 py-3 font-medium text-muted-foreground"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columnCount} className="p-0">
                <AppLoader className="py-8" spinnerClassName="size-6" />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                className={cn(
                  "border-border/60",
                  onRowClick && "cursor-pointer hover:bg-muted/40"
                )}
                onClick={
                  onRowClick
                    ? () => {
                        onRowClick(row.original)
                      }
                    : undefined
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-4 py-4 whitespace-normal"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columnCount}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {showPagination ? (
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  )
}
