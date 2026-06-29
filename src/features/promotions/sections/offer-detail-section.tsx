"use client"

import Link from "next/link"
import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { userInsightColumns } from "@/features/promotions/columns/user-insight-columns"
import { OfferAcquisitionInsightCard } from "@/features/promotions/components/offer-acquisition-insight-card"
import { OfferCheckoutsInsightCard } from "@/features/promotions/components/offer-checkouts-insight-card"
import { OfferRevenueInsightCard } from "@/features/promotions/components/offer-revenue-insight-card"
import { PROMOTIONS_ROUTES } from "@/features/promotions/constants"
import { usePromotionOffer } from "@/features/promotions/hooks/use-promotion-queries"
import { AppLoader } from "@/components/ui/app-loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type OfferDetailSectionProps = {
  offerId: string
}

export function OfferDetailSection({ offerId }: OfferDetailSectionProps) {
  const { data, isPending, isError, error } = usePromotionOffer(offerId)
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: data?.userInsight ?? [],
    columns: userInsightColumns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  if (isPending) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load promotion details."}
        </div>
      </div>
    )
  }

  const { offer, promotionInsight } = data
  const isActive = offer.status === "active"

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon-sm" className="mt-0.5 shrink-0" asChild>
            <Link href={PROMOTIONS_ROUTES.list} aria-label="Back to promotions">
              <Icons.chevronLeft size={20} />
            </Link>
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {offer.title}
              </h1>
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-full border-0 px-2.5 py-1 text-xs font-medium",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-700"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {offer.statusLabel}
              </Badge>
            </div>
            {offer.promoCode ? (
              <p className="mt-1 text-sm font-medium text-primary">
                {offer.promoCode}
              </p>
            ) : null}
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {offer.description || offer.detailsLabel}
            </p>
          </div>
        </div>

        <Button asChild>
          <Link href={PROMOTIONS_ROUTES.edit(offer.id)}>
            <Icons.edit size={16} />
            Edit Promo
          </Link>
        </Button>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Promotion Insight
        </h2>
        <div className="grid gap-4 xl:grid-cols-3">
          <OfferRevenueInsightCard revenue={promotionInsight.revenueGenerated} />
          <OfferCheckoutsInsightCard checkouts={promotionInsight.checkouts} />
          <OfferAcquisitionInsightCard
            acquisition={promotionInsight.customerAcquisition}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          User Insight
        </h2>
        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-background">
          <Table className="min-w-[56rem]">
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
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-border/60">
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
                    colSpan={userInsightColumns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No user insight data yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
