"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { InventoryStockLevelBadge } from "@/features/inventory/components/inventory-stock-level-badge"
import type { ApiInventoryItem } from "@/features/inventory/types"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icons"
import { toImageSrc } from "@/lib/image-url"
import { getUserInitials } from "@/utils/get-initials"

type CreateInventoryColumnsOptions = {
  onEditItem?: (item: ApiInventoryItem) => void
  page?: number
  perPage?: number
}

export function createInventoryColumns({
  onEditItem,
  page = 1,
  perPage = 20,
}: CreateInventoryColumnsOptions = {}): ColumnDef<ApiInventoryItem>[] {
  return [
    {
      id: "serial",
      header: "S/N",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {(page - 1) * perPage + row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "inventory_code",
      header: "Inventory ID",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-medium text-foreground">
          {row.original.inventory_code}
        </span>
      ),
    },
    {
      id: "item",
      header: "Item",
      cell: ({ row }) => {
        const item = row.original
        const imageSrc = item.image_url ? toImageSrc(item.image_url) : null

        return (
          <div className="flex min-w-0 items-center gap-3">
            <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt={item.name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-xs font-semibold text-muted-foreground">
                  {item.name.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <span className="truncate font-medium text-foreground">
              {item.name}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-foreground">
          {row.original.quantity}
        </span>
      ),
    },
    {
      accessorKey: "amount_formatted",
      header: "Amount",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-medium text-foreground">
          {row.original.amount_formatted}
        </span>
      ),
    },
    {
      accessorKey: "category_label",
      header: "Category",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-foreground">
          {row.original.category_label}
        </span>
      ),
    },
    {
      id: "purchased_by",
      header: "Purchased By",
      cell: ({ row }) => {
        const { purchased_by, date_purchased } = row.original

        return (
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar className="size-9 shrink-0">
              {purchased_by.avatar_url ? (
                <AvatarImage
                  src={toImageSrc(purchased_by.avatar_url) ?? undefined}
                  alt={purchased_by.name}
                />
              ) : null}
              <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                {getUserInitials(purchased_by.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">
                {purchased_by.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {date_purchased}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      id: "level",
      header: "Level",
      cell: ({ row }) => (
        <InventoryStockLevelBadge
          label={row.original.stock_level_label}
          level={row.original.level}
        />
      ),
    },
    ...(onEditItem
      ? [
          {
            id: "actions",
            header: "",
            cell: ({ row }: { row: { original: ApiInventoryItem } }) => (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-primary hover:bg-primary/10 hover:text-primary"
                aria-label={`Edit ${row.original.name}`}
                onClick={(event) => {
                  event.stopPropagation()
                  onEditItem(row.original)
                }}
              >
                <Icon name="edit" size={16} />
              </Button>
            ),
          } satisfies ColumnDef<ApiInventoryItem>,
        ]
      : []),
  ]
}
