"use client"

import type { IconName } from "@/components/ui/icons"
import { Icons } from "@/components/ui/icons"
import { Card } from "@/components/ui/card"
import { OFFLINE_ORDER_PAYMENT_METHOD_OPTIONS } from "@/features/offline-order/utils/order-checkout"
import type { OfflineOrderPaymentMethod } from "@/features/offline-order/types"
import { cn } from "@/lib/utils"

const PAYMENT_METHOD_ICONS: Record<OfflineOrderPaymentMethod, IconName> = {
  cash: "priceTag",
  pos_card: "laptop",
  bank_transfer: "fileSpreadsheet",
  staff_credit: "userCog",
  chowdeck: "delivery",
  glovo: "truck",
}

type OfflineOrderPaymentMethodCardsProps = {
  value: OfflineOrderPaymentMethod
  onChange: (value: OfflineOrderPaymentMethod) => void
}

export function OfflineOrderPaymentMethodCards({
  value,
  onChange,
}: OfflineOrderPaymentMethodCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {OFFLINE_ORDER_PAYMENT_METHOD_OPTIONS.map((option) => {
        const isActive = value === option.value
        const IconComponent = Icons[PAYMENT_METHOD_ICONS[option.value]]

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className="text-left"
          >
            <Card
              className={cn(
                "gap-3 px-4 py-5 transition-colors",
                isActive
                  ? "border-primary ring-1 ring-primary"
                  : "hover:border-primary/40",
              )}
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg",
                  isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                <IconComponent size={20} />
              </div>
              <p className="text-sm font-medium text-foreground">{option.label}</p>
            </Card>
          </button>
        )
      })}
    </div>
  )
}
