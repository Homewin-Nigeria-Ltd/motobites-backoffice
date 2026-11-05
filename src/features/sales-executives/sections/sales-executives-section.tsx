"use client"

import { useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { ApplicationReviewDialogs } from "../components/application-review"
import { useSalesExecutives } from "../hooks/use-sales-executives"
import {
  salesExecutiveStatuses,
  type SalesExecutive,
  type SalesExecutiveStatus,
} from "../types"
import {
  canReviewSalesExecutive,
  formatSalesExecutiveStatus,
} from "../utils/map-sales-executive"

function known(value: string) {
  return Boolean(value && value !== "—")
}

function applicationColumns(
  onDecline: (application: SalesExecutive) => void,
  onApprove: (application: SalesExecutive) => void
): ColumnDef<SalesExecutive>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">
            {row.original.name}
          </p>
          {known(row.original.email) ? (
            <p className="truncate text-xs text-muted-foreground">
              {row.original.email}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => row.original.phone,
    },
    {
      accessorKey: "createdAt",
      header: "Applied",
    },
    {
      id: "phoneStatus",
      header: "Phone check",
      cell: ({ row }) => {
        const verified = row.original.phoneVerified
        const hasPhone = known(row.original.phone)
        return (
          <Badge variant={verified ? "secondary" : "destructive"}>
            {verified ? "Verified" : hasPhone ? "Not verified" : "No phone"}
          </Badge>
        )
      },
    },
    {
      id: "idStatus",
      header: "ID",
      cell: ({ row }) => {
        const uploaded =
          known(row.original.idDocumentUrl) || known(row.original.idType)
        return (
          <Badge variant={uploaded ? "secondary" : "destructive"}>
            {uploaded ? "Uploaded" : "Not uploaded"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        if (!canReviewSalesExecutive(row.original.status)) {
          return null
        }

        return (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(event) => {
                event.stopPropagation()
                onDecline(row.original)
              }}
            >
              Decline
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={(event) => {
                event.stopPropagation()
                onApprove(row.original)
              }}
            >
              Review and approve
            </Button>
          </div>
        )
      },
    },
  ]
}

export function SalesExecutivesSection() {
  const [status, setStatus] = useState<SalesExecutiveStatus>("personal_details")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<SalesExecutive | null>(null)
  const [mode, setMode] = useState<"approve" | "id" | "decline" | null>(null)
  const { data, isPending, isError } = useSalesExecutives({
    page,
    status,
  })
  const items = data?.items ?? []
  const canReview = canReviewSalesExecutive(status)
  const openReview = (application: SalesExecutive, next: "approve" | "decline") => {
    setSelected(application)
    setMode(next)
  }
  const columns = useMemo(
    () =>
      applicationColumns(
        (application) => openReview(application, "decline"),
        (application) => openReview(application, "approve")
      ),
    []
  )

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={isError ? [] : items}
        page={data?.meta.current_page ?? page}
        totalPages={data?.meta.last_page ?? 1}
        onPageChange={setPage}
        onRowClick={
          canReview
            ? (application) => openReview(application, "approve")
            : undefined
        }
        isLoading={isPending}
        emptyMessage={
          isError ? "Could not load applications." : "Nobody in this list."
        }
        toolbar={
          <div className="flex flex-wrap gap-1 border-b border-border px-4">
            {salesExecutiveStatuses.map((item) => {
              const active = status === item
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setStatus(item)
                    setPage(1)
                  }}
                  className={cn(
                    "px-3 py-3 text-sm",
                    active
                      ? "border-b-2 border-primary font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {formatSalesExecutiveStatus(item)}
                  {data ? ` ${data.meta.status_counts[item]}` : ""}
                </button>
              )
            })}
          </div>
        }
      />

      <ApplicationReviewDialogs
        key={selected?.id ?? "none"}
        application={selected}
        mode={mode}
        onMode={setMode}
        onClose={() => {
          setMode(null)
          setSelected(null)
        }}
      />
    </div>
  )
}
