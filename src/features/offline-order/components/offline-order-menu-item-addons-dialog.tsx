"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type {
  ApiSalesDashboardMenuItem,
  OfflineOrderCartAddon,
  OfflineOrderCartItem,
} from "@/features/offline-order/types"
import {
  buildEmptyModifierSelections,
  getActiveModifierOptions,
  getCartItemUnitPrice,
  getMenuItemModifierGroups,
  mapSelectedModifiersToAddons,
  modifierSelectionsFromAddons,
  shouldApplyAddonSelectionOnClose,
} from "@/features/offline-order/utils/cart-line"
import { formatOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"
import { toImageSrc } from "@/lib/image-url"
import { cn } from "@/lib/utils"

type OfflineOrderMenuItemAddonsDialogProps = {
  open: boolean
  item: ApiSalesDashboardMenuItem | null
  cartLines: OfflineOrderCartItem[]
  kitchenId: string
  kitchenName: string
  onOpenChange: (open: boolean) => void
  onApply: (input: {
    itemId: string
    name: string
    basePrice: number
    price: number
    image: string | null
    kitchenId: string
    kitchenName: string
    addons: OfflineOrderCartAddon[]
  }) => void
}

export function OfflineOrderMenuItemAddonsDialog({
  open,
  item,
  cartLines,
  kitchenId,
  kitchenName,
  onOpenChange,
  onApply,
}: OfflineOrderMenuItemAddonsDialogProps) {
  const groups = useMemo(
    () => (item ? getMenuItemModifierGroups(item) : []),
    [item],
  )

  const [selections, setSelections] = useState<Record<string, number[]>>({})
  const initialSelectionsRef = useRef<Record<string, number[]>>({})
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (open && !wasOpenRef.current && item) {
      const addonLine = [...cartLines]
        .reverse()
        .find((line) => (line.addons?.length ?? 0) > 0)
      const initialSelections = addonLine
        ? modifierSelectionsFromAddons(groups, addonLine.addons ?? [])
        : buildEmptyModifierSelections(groups)

      initialSelectionsRef.current = initialSelections
      setSelections(initialSelections)
    }

    wasOpenRef.current = open
  }, [open, item, groups, cartLines])

  if (!item) {
    return null
  }

  const selectedAddons = mapSelectedModifiersToAddons(groups, selections)
  const unitPrice = getCartItemUnitPrice(item.price, selectedAddons)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      const shouldApply = shouldApplyAddonSelectionOnClose(
        initialSelectionsRef.current,
        selections,
      )

      if (shouldApply) {
        onApply({
          itemId: String(item.id),
          name: item.name,
          basePrice: item.price,
          price: unitPrice,
          image: item.image,
          kitchenId,
          kitchenName,
          addons: selectedAddons,
        })
      }
    }

    onOpenChange(nextOpen)
  }

  const setGroupSelection = (groupName: string, optionId: number | null) => {
    setSelections((current) => ({
      ...current,
      [groupName]: optionId ? [optionId] : [],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border/60 px-6 py-4">
          <DialogTitle>Choose add-ons</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={toImageSrc(item.image)}
                alt={item.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-base font-semibold text-foreground">{item.name}</p>
              <p className="text-sm text-muted-foreground">{kitchenName}</p>
              <p className="text-sm font-medium text-primary">
                {formatOfflineOrderAmount(unitPrice)}
              </p>
            </div>
          </div>

          {groups.map((group) => {
            const options = getActiveModifierOptions(group)
            const selected = selections[group.group_name] ?? []

            return (
              <div key={group.group_name} className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {group.display_name}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      (Optional)
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Choose one option if needed
                  </p>
                </div>

                <RadioGroup
                  value={selected[0] ? String(selected[0]) : undefined}
                  onValueChange={(value) => {
                    const optionId = Number(value)

                    if (selected[0] === optionId) {
                      setGroupSelection(group.group_name, null)
                      return
                    }

                    setGroupSelection(group.group_name, optionId)
                  }}
                  className="gap-3"
                >
                  {options.map((option) => {
                    const optionPrice = option.additional_price || option.price

                    return (
                      <Label
                        key={option.id}
                        htmlFor={`${group.group_name}-${option.id}`}
                        className={cn(
                          "flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border px-4 py-3",
                          selected.includes(option.id) &&
                            "border-primary bg-primary/5",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            id={`${group.group_name}-${option.id}`}
                            value={String(option.id)}
                          />
                          <span className="text-sm font-medium">{option.name}</span>
                        </div>
                        {optionPrice > 0 ? (
                          <span className="text-sm text-muted-foreground">
                            +{formatOfflineOrderAmount(optionPrice)}
                          </span>
                        ) : null}
                      </Label>
                    )
                  })}
                </RadioGroup>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
