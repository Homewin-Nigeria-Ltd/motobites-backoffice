"use client"

import type { ReactNode } from "react"

import { InventoryStockLevelBadge } from "@/features/inventory/components/inventory-stock-level-badge"
import type { ApiInventoryItem } from "@/features/inventory/types"
import { BaseModal } from "@/components/ui/base-modal"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toImageSrc } from "@/lib/image-url"
import { getUserInitials } from "@/utils/get-initials"

type ViewInventoryItemModalProps = {
  item: ApiInventoryItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditItem?: (item: ApiInventoryItem) => void
}

function DetailField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-sm font-medium text-foreground">{children}</div>
    </div>
  )
}

export function ViewInventoryItemModal({
  item,
  open,
  onOpenChange,
  onEditItem,
}: ViewInventoryItemModalProps) {
  if (!open || !item) {
    return null
  }

  const imageSrc = item.image_url ? toImageSrc(item.image_url) : null

  const handleEdit = () => {
    onOpenChange(false)
    onEditItem?.(item)
  }

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={item.name}
      layout="detail"
      size="lg"
      className="max-w-lg"
      bodyClassName="space-y-5"
    >
      <div className="overflow-hidden rounded-2xl bg-muted">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={item.name}
            className="max-h-48 w-full object-cover sm:max-h-56"
          />
        ) : (
          <div className="flex h-40 items-center justify-center text-4xl font-semibold text-muted-foreground sm:h-48">
            {item.name.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">Inventory {item.inventory_code}</Badge>
      </div>

      {item.description ? (
        <p className="text-sm leading-relaxed break-words text-muted-foreground">
          {item.description}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <DetailField label="Quantity">{item.quantity}</DetailField>
        <DetailField label="Amount">{item.amount_formatted}</DetailField>
        <DetailField label="Category">{item.category_label}</DetailField>
        <DetailField label="Level">
          <InventoryStockLevelBadge
            label={item.stock_level_label}
            level={item.level}
          />
        </DetailField>
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-10 shrink-0">
            {item.purchased_by.avatar_url ? (
              <AvatarImage
                src={toImageSrc(item.purchased_by.avatar_url) ?? undefined}
                alt={item.purchased_by.name}
              />
            ) : null}
            <AvatarFallback className="bg-muted text-xs font-semibold text-primary">
              {getUserInitials(item.purchased_by.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Purchased by</p>
            <p className="truncate font-medium text-foreground">
              {item.purchased_by.name}
            </p>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="text-sm text-muted-foreground">Date Purchased</p>
          <p className="text-sm font-medium text-foreground">
            {item.date_purchased}
          </p>
        </div>
      </div>

      {onEditItem ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            icon={{ name: "edit", position: "left" }}
            onClick={handleEdit}
          >
            Edit item
          </Button>
        </div>
      ) : null}
    </BaseModal>
  )
}
