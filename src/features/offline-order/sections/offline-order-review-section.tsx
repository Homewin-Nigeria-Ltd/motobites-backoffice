"use client"

import Link from "next/link"

import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { OfflineOrderBackButton } from "@/features/offline-order/components/offline-order-back-button"
import { OfflineOrderEmptyState } from "@/features/offline-order/components/offline-order-empty-state"
import { OfflineOrderSelectedDishesTable } from "@/features/offline-order/components/offline-order-selected-dishes-table"
import { OfflineOrderSummaryCard } from "@/features/offline-order/components/offline-order-summary-card"
import { useOfflineOrderCart } from "@/features/offline-order/hooks/use-offline-order-cart"
import { calculateOfflineOrderTotals } from "@/features/offline-order/utils/order-totals"

export function OfflineOrderReviewSection() {
  const { items, selectedCount, subtotal, updateQuantity, removeItem, isHydrated } =
    useOfflineOrderCart()
  const totals = calculateOfflineOrderTotals(subtotal)

  if (!isHydrated) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted">
        <OfflineOrderBackButton href="/offline-order/new" label="Back to Menu" />
        <AppLoader />
      </div>
    )
  }

  if (selectedCount === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted">
        <OfflineOrderBackButton href="/offline-order/new" label="Back to Menu" />
        <OfflineOrderEmptyState
          message="No items selected yet. Add menu items to continue."
          showBackButton={false}
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <OfflineOrderBackButton href="/offline-order/new" label="Back to Menu" />

      <div className="grid min-h-0 flex-1 gap-6 p-4 md:p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <OfflineOrderSelectedDishesTable
          items={items}
          onQuantityChange={updateQuantity}
          onRemove={removeItem}
        />

        <div className="lg:sticky lg:top-6 lg:self-start">
          <OfflineOrderSummaryCard
            subtotal={totals.subtotal}
            serviceFee={totals.serviceFee}
            total={totals.total}
          >
            <Button asChild className="h-11 w-full">
              <Link href="/offline-order/payment">Proceed to Payment</Link>
            </Button>
          </OfflineOrderSummaryCard>
        </div>
      </div>
    </div>
  )
}
