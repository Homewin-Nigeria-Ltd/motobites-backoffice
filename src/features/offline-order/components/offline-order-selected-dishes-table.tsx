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
import type { OfflineOrderCartItem } from "@/features/offline-order/types"
import { formatOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"
import { toImageSrc } from "@/lib/image-url"

type OfflineOrderSelectedDishesTableProps = {
  items: OfflineOrderCartItem[]
  onQuantityChange: (lineId: string, quantity: number) => void
  onRemove: (lineId: string) => void
}

export function OfflineOrderSelectedDishesTable({
  items,
  onQuantityChange,
  onRemove,
}: OfflineOrderSelectedDishesTableProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="border-b border-border/60 px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">
          Selected Dishes
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-5">Item</TableHead>
            <TableHead className="hidden sm:table-cell">Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const lineTotal = item.price * item.quantity

            return (
              <TableRow key={item.lineId}>
                <TableCell className="px-5 whitespace-normal">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={toImageSrc(item.image)}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{item.name}</p>
                      {(item.addons ?? []).map((addon) => (
                        <p
                          key={addon.id}
                          className="text-sm text-muted-foreground"
                        >
                          {addon.name}
                        </p>
                      ))}
                      <p className="truncate text-sm text-muted-foreground">
                        {item.kitchenName}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground sm:hidden">
                        {formatOfflineOrderAmount(item.price)}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {formatOfflineOrderAmount(item.price)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="border-primary text-primary"
                      onClick={() =>
                        onQuantityChange(item.lineId, item.quantity - 1)
                      }
                      aria-label={`Decrease quantity for ${item.name}`}
                    >
                      <Icons.remove size={16} />
                    </Button>
                    <span className="min-w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      size="icon-sm"
                      onClick={() =>
                        onQuantityChange(item.lineId, item.quantity + 1)
                      }
                      aria-label={`Increase quantity for ${item.name}`}
                    >
                      <Icons.add size={16} />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatOfflineOrderAmount(lineTotal)}
                </TableCell>
                <TableCell className="pr-5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onRemove(item.lineId)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Icons.trash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}
