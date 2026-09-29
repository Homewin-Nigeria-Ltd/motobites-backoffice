"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { AppLoader } from "@/components/ui/app-loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBranchFilter } from "@/context/branch-context"
import { useSession } from "@/features/auth"
import { OfflineOrderBackButton } from "@/features/offline-order/components/offline-order-back-button"
import { OfflineOrderBranchField } from "@/features/offline-order/components/offline-order-branch-field"
import { OfflineOrderEmptyState } from "@/features/offline-order/components/offline-order-empty-state"
import { OfflineOrderPaymentMethodCards } from "@/features/offline-order/components/offline-order-payment-method-cards"
import { OfflineOrderPreviewCard } from "@/features/offline-order/components/offline-order-preview-card"
import { OfflineOrderStaffField } from "@/features/offline-order/components/offline-order-staff-field"
import { mapSalesDashboardOrderToReceipt } from "@/features/offline-order/utils/map-offline-order-receipt"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

import { bulkOrderQueries } from "../api/queries"
import { useBulkOrderCart } from "../hooks/use-bulk-order-cart"
import { useBulkOrderCheckout } from "../hooks/use-bulk-order-checkout"
import {
  usePreviewBulkOrder,
  useSavedBulkOrders,
} from "../hooks/use-bulk-order-queries"
import { useBulkOrderReceipt } from "../hooks/use-bulk-order-receipt"
import { usePlaceBulkOrder } from "../hooks/use-place-bulk-order"
import { useSaveBulkOrder } from "../hooks/use-save-bulk-order"
import { buildBulkOrderPayload } from "../utils/build-payload"
import { toOfflineOrderCartItems } from "../utils/map-order"
import { mapBulkOrderPreviewTotals } from "../utils/map-preview"

export function BulkOrderPaymentSection() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const {
    branchId: contextBranchId,
    selectedBranch: contextBranch,
    activeBranches,
  } = useBranchFilter()
  const user = session?.user
  const {
    items,
    source,
    selectedCount,
    subtotal,
    clearCart,
    isHydrated,
  } = useBulkOrderCart()
  const {
    checkout,
    setCustomerName,
    setCustomerPhone,
    setPaymentMethod,
    setTakenBy,
    setBranch,
    setPromoCode,
    resetCheckout,
  } = useBulkOrderCheckout()
  const { savedOrderCount } = useSavedBulkOrders()
  const { storeReceipt } = useBulkOrderReceipt()
  const { placeBulkOrder, isPending: isPlacingOrder } = usePlaceBulkOrder()
  const { saveBulkOrder, isPending: isSavingOrder } = useSaveBulkOrder()
  const previewOrder = usePreviewBulkOrder()
  const [isLeaving, setIsLeaving] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string
    subtotal: number
    discount: number
    discountPercentage: number
    serviceFee: number
    total: number
  } | null>(null)
  const previewTotals = previewOrder.data?.data
    ? mapBulkOrderPreviewTotals(previewOrder.data.data, subtotal)
    : null
  const totals = appliedPromo ??
    previewTotals ?? {
      subtotal,
      discount: 0,
      discountPercentage: 0,
      serviceFee: 0,
      total: subtotal,
    }

  useEffect(() => {
    if (!user || checkout.takenById) {
      return
    }

    setTakenBy(String(user.id), user.name)
  }, [checkout.takenById, setTakenBy, user])

  useEffect(() => {
    if (checkout.branchId) {
      return
    }

    if (contextBranchId) {
      setBranch(contextBranchId, contextBranch?.name)
    } else if (activeBranches.length > 0) {
      setBranch(Number(activeBranches[0].id), activeBranches[0].name)
    }
  }, [
    checkout.branchId,
    contextBranchId,
    contextBranch?.name,
    activeBranches,
    setBranch,
  ])

  useEffect(() => {
    if (!isHydrated || items.length === 0) {
      return
    }

    previewOrder.mutate(buildBulkOrderPayload(items, checkout, source))
    // Preview checkout fields that don't change totals are omitted on purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout.promoCode, isHydrated, items, source])

  if (isLeaving || !isHydrated) {
    return (
      <div className="bg-muted">
        <OfflineOrderBackButton
          href="/offline-order/bulk/review"
          label="Back to Review"
        />
        <AppLoader />
      </div>
    )
  }

  if (selectedCount === 0) {
    return (
      <div className="bg-muted">
        <OfflineOrderBackButton
          href="/offline-order/bulk/review"
          label="Back to Review"
        />
        <OfflineOrderEmptyState
          message="No items selected yet. Add menu items to continue."
          backHref="/offline-order/bulk"
          backLabel="Back to Bulk Menu"
          showBackButton={false}
          secondaryAction={
            savedOrderCount > 0
              ? {
                  label: "View Saved Bulk Orders",
                  onClick: () => router.push("/offline-order/bulk/saved"),
                }
              : undefined
          }
        />
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    try {
      const placedReceipt = await placeBulkOrder({
        items,
        checkout: {
          ...checkout,
          promoCode: appliedPromo?.code || checkout.promoCode,
        },
        source,
        takenByName: checkout.takenByName || user?.name || "Staff",
      })

      const receipt = placedReceipt.orderId
        ? mapSalesDashboardOrderToReceipt(
            await queryClient.fetchQuery(
              bulkOrderQueries.order(placedReceipt.orderId),
            ),
          )
        : placedReceipt

      storeReceipt(receipt)
      clearCart()
      resetCheckout()
      toast.success("Bulk order placed successfully")
      setIsLeaving(true)

      const params = new URLSearchParams()
      if (receipt.orderId) {
        params.set("orderId", receipt.orderId)
      }
      params.set("print", "1")

      router.push(`/offline-order/bulk/success?${params.toString()}`)
    } catch {
      // Error toast handled in hook
    }
  }

  const handleSaveOrder = async () => {
    try {
      await saveBulkOrder({ items, checkout, source })

      setIsLeaving(true)
      clearCart()
      resetCheckout()
      toast.success("Bulk order saved. You can return to complete it later.")
      router.push("/offline-order/bulk/saved")
    } catch {
      // Error toast handled in hook
    }
  }

  const handleApplyPromo = async () => {
    const promoCode = checkout.promoCode.trim()

    if (!promoCode) {
      toast.error("Enter a promo code to apply.")
      return
    }

    try {
      const response = await previewOrder.mutateAsync(
        buildBulkOrderPayload(items, checkout, source),
      )
      const nextTotals = mapBulkOrderPreviewTotals(
        response.data ?? {},
        subtotal,
      )

      setAppliedPromo({
        code: promoCode,
        ...nextTotals,
      })
      toast.success(response.message || "Promo code applied.")
    } catch (mutationError) {
      setAppliedPromo(null)
      const message =
        mutationError instanceof ApiError
          ? mutationError.message
          : "Failed to apply promo code."

      toast.error(message)
    }
  }

  return (
    <div className="bg-muted">
      <OfflineOrderBackButton
        href="/offline-order/bulk/review"
        label="Back to Review"
      />

      <div className="grid gap-6 p-4 md:p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="space-y-4 rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">
                Customer Details (Optional)
              </h2>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                Bulk Order
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bulk-order-customer-name">Customer Name</Label>
                <Input
                  id="bulk-order-customer-name"
                  value={checkout.customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Enter customer name"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulk-order-customer-phone">Phone Number</Label>
                <Input
                  id="bulk-order-customer-phone"
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

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Fulfillment Branch
            </h2>
            <OfflineOrderBranchField
              selectedBranchId={checkout.branchId ?? null}
              selectedBranchName={checkout.branchName}
              onSelectBranch={setBranch}
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

          <section className="space-y-3 rounded-2xl border border-border bg-background p-5">
            <h2 className="text-base font-semibold text-foreground">
              Promo Code
            </h2>
            <div className="space-y-2">
              <Label htmlFor="bulk-order-promo-code">
                Enter promo code (optional)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="bulk-order-promo-code"
                  value={checkout.promoCode}
                  onChange={(event) => {
                    setAppliedPromo(null)
                    setPromoCode(event.target.value.toUpperCase())
                  }}
                  placeholder="e.g. WEEKEND10"
                  className="h-10 uppercase"
                  autoComplete="off"
                />
                <Button
                  type="button"
                  className="h-10 shrink-0"
                  onClick={() => void handleApplyPromo()}
                  disabled={
                    previewOrder.isPending ||
                    checkout.promoCode.trim().length === 0
                  }
                >
                  {previewOrder.isPending ? "Applying..." : "Apply"}
                </Button>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <OfflineOrderPreviewCard
            items={toOfflineOrderCartItems(items)}
            subtotal={totals.subtotal}
            serviceFee={totals.serviceFee}
            total={totals.total}
            promoCode={appliedPromo?.code}
            discount={appliedPromo?.discount ?? totals.discount}
            discountPercentage={
              appliedPromo?.discountPercentage ?? totals.discountPercentage
            }
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
                router.push("/offline-order/bulk")
              }}
            >
              Create New Bulk Order
            </Button>
            {savedOrderCount > 0 ? (
              <Button
                type="button"
                variant="link"
                className="h-auto w-full p-0 text-primary"
                onClick={() => router.push("/offline-order/bulk/saved")}
              >
                Return to Saved Order
              </Button>
            ) : null}
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
            You can save this order and serve another customer, then return to
            complete it.
          </div>
        </div>
      </div>
    </div>
  )
}
