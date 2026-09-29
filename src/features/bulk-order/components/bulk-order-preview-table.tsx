"use client"

import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"
import { toImageSrc } from "@/lib/image-url"

import type { BulkOrderCartItem } from "../types"
import { getBulkOrderAllocationLabel } from "../utils/catalog"

type BulkOrderPreviewTableProps = {
  items: BulkOrderCartItem[]
  onRemove?: (itemId: string) => void
}

export function BulkOrderPreviewTable({
  items,
  onRemove,
}: BulkOrderPreviewTableProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-5">Allocated Item</TableHead>
            <TableHead className="hidden text-right sm:table-cell">
              Unit Price
            </TableHead>
            <TableHead className="text-right">Allocated Qty</TableHead>
            <TableHead className="text-right">Portion Total</TableHead>
            {onRemove ? <TableHead className="w-12 pr-5" /> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const allocationLabel = getBulkOrderAllocationLabel(item.categoryName)

            return (
              <TableRow key={item.itemId}>
                <TableCell className="px-5 whitespace-normal">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={toImageSrc(item.image)}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">
                        {item.name}{" "}
                        <span className="font-normal text-muted-foreground">
                          ({allocationLabel})
                        </span>
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {item.kitchenName}
                      </p>
                      {(item.addons ?? []).map((addon) => (
                        <p
                          key={addon.id}
                          className="text-sm text-muted-foreground"
                        >
                          {addon.name}
                          {addon.price > 0
                            ? ` +${formatOfflineOrderAmount(addon.price)}`
                            : ""}
                        </p>
                      ))}
                      <p className="mt-1 text-sm text-muted-foreground sm:hidden">
                        {formatOfflineOrderAmount(item.price)}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-right sm:table-cell">
                  {formatOfflineOrderAmount(item.price)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.quantity} Portions
                </TableCell>
                <TableCell className={onRemove ? "text-right font-medium" : "pr-5 text-right font-medium"}>
                  {formatOfflineOrderAmount(item.price * item.quantity)}
                </TableCell>
                {onRemove ? (
                  <TableCell className="pr-5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onRemove(item.itemId)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Icons.trash size={16} />
                    </Button>
                  </TableCell>
                ) : null}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}
