"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { AppLoader } from "@/components/ui/app-loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "@/features/auth"
import { OfflineOrderEmptyState } from "@/features/offline-order/components/offline-order-empty-state"
import { OfflineOrderPaymentMethodCards } from "@/features/offline-order/components/offline-order-payment-method-cards"
import { OfflineOrderPreviewCard } from "@/features/offline-order/components/offline-order-preview-card"
import { OfflineOrderStaffField } from "@/features/offline-order/components/offline-order-staff-field"
import { useOfflineOrderCart } from "@/features/offline-order/hooks/use-offline-order-cart"
import { useOfflineOrderCheckout } from "@/features/offline-order/hooks/use-offline-order-checkout"
import { usePlaceOfflineOrder } from "@/features/offline-order/hooks/use-place-offline-order"
import { useSaveOfflineOrder } from "@/features/offline-order/hooks/use-save-offline-order"
import { useSalesDashboardSavedOrders } from "@/features/offline-order/hooks/use-sales-dashboard-saved-orders"
import {
  useOfflineOrderReceipt,
} from "@/features/offline-order/hooks/use-offline-order-storage"
import { calculateOfflineOrderTotals } from "@/features/offline-order/utils/order-totals"
import { toast } from "@/lib/toast"

export function OfflineOrderPaymentSection() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  const { items, selectedCount, subtotal, clearCart, isHydrated } =
    useOfflineOrderCart()
  const {
    checkout,
    setCustomerName,
    setCustomerPhone,
    setPaymentMethod,
    setTakenBy,
    resetCheckout,
  } = useOfflineOrderCheckout()
  const { savedOrderCount } = useSalesDashboardSavedOrders()
  const { storeReceipt } = useOfflineOrderReceipt()
  const { placeOfflineOrder, isPending: isPlacingOrder } = usePlaceOfflineOrder()
  const { saveOfflineOrder, isPending: isSavingOrder } = useSaveOfflineOrder()
  const [isLeaving, setIsLeaving] = useState(false)
  const totals = calculateOfflineOrderTotals(subtotal)

  useEffect(() => {
    if (!user || checkout.takenById) {
      return
    }

    setTakenBy(String(user.id), user.name)
  }, [checkout.takenById, setTakenBy, user])

  if (isLeaving || !isHydrated) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted">
        <AppLoader />
      </div>
    )
  }

  if (selectedCount === 0) {
    return (
      <OfflineOrderEmptyState
        message="No items selected yet. Add menu items to continue."
        secondaryAction={
          savedOrderCount > 0
            ? {
                label: "View Saved Orders",
                onClick: () => router.push("/offline-order/saved"),
              }
            : undefined
        }
      />
    )
  }

  const handlePlaceOrder = async () => {
    try {
      const receipt = await placeOfflineOrder({
        items,
        checkout,
        takenByName: checkout.takenByName || user?.name || "Staff",
      })

      setIsLeaving(true)
      storeReceipt(receipt)
      clearCart()
      resetCheckout()
      toast.success("Offline order placed successfully")
      router.push("/offline-order/success")
    } catch {
      // Error toast handled in hook
    }
  }

  const handleSaveOrder = async () => {
    try {
      await saveOfflineOrder({ items, checkout })

      setIsLeaving(true)
      clearCart()
      resetCheckout()
      toast.success("Order saved. You can return to complete it later.")
      router.push("/offline-order/saved")
    } catch {
      // Error toast handled in hook
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="grid min-h-0 flex-1 gap-6 p-4 md:p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="space-y-4 rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">
                Customer Details (Optional)
              </h2>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                Walk-in Order
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="offline-order-customer-name">Customer Name</Label>
                <Input
                  id="offline-order-customer-name"
                  value={checkout.customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Enter customer name"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offline-order-customer-phone">Phone Number</Label>
                <Input
                  id="offline-order-customer-phone"
                  value={checkout.customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="+234 801 234 5678"
                  className="h-10"
                />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Order Taken By
            </h2>
            <OfflineOrderStaffField
              takenById={checkout.takenById}
              takenByName={checkout.takenByName}
              currentUserId={user?.id}
              currentUserName={user?.name}
              onAssign={setTakenBy}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              Select Payment Method
            </h2>
            <OfflineOrderPaymentMethodCards
              value={checkout.paymentMethod}
              onChange={setPaymentMethod}
            />
          </section>
        </div>

        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <OfflineOrderPreviewCard
            items={items}
            subtotal={totals.subtotal}
            serviceFee={totals.serviceFee}
            total={totals.total}
          />

          <div className="space-y-3">
            <Button
              className="h-11 w-full"
              onClick={() => void handlePlaceOrder()}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Placing Order..." : "Confirm & Place Order"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full border-primary text-primary hover:bg-primary/5"
              onClick={() => void handleSaveOrder()}
              disabled={isSavingOrder || isPlacingOrder}
            >
              {isSavingOrder ? "Saving Order..." : "Save Order"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full"
              onClick={() => {
                clearCart()
                resetCheckout()
                router.push("/offline-order/new")
              }}
            >
              Create New Order
            </Button>
            {savedOrderCount > 0 ? (
              <Button
                type="button"
                variant="link"
                className="h-auto w-full p-0 text-primary"
                onClick={() => router.push("/offline-order/saved")}
              >
                Return to Saved Order
              </Button>
            ) : null}
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
            You can save this order and serve another customer, then return to
            complete it.
          </div>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/offline-order/review">Back to Review</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
