"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef } from "react"

import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { OfflineOrderBackButton } from "@/features/offline-order/components/offline-order-back-button"
import type { OfflineOrderCheckoutDraft } from "@/features/offline-order/types"
import { ApiError } from "@/lib/api/client"

import { BulkOrderInvoiceCard } from "../components/bulk-order-invoice-card"
import { BulkOrderPreviewTable } from "../components/bulk-order-preview-table"
import { useBulkOrderCart } from "../hooks/use-bulk-order-cart"
import { usePreviewBulkOrder } from "../hooks/use-bulk-order-queries"
import { buildBulkOrderPayload } from "../utils/build-payload"
import { mapBulkOrderPreviewTotals } from "../utils/map-preview"

const emptyCheckout: OfflineOrderCheckoutDraft = {
  customerName: "",
  customerPhone: "",
  orderSource: "walk_in",
  paymentMethod: "cash",
  takenById: "",
  takenByName: "",
  branchId: null,
  branchName: "",
  managerVerificationNotes: "",
  promoCode: "",
}

export function BulkOrderReviewSection() {
  const {
    items,
    source,
    selectedCount,
    portionCount,
    sideCount,
    subtotal,
    isHydrated,
    removeItem,
  } = useBulkOrderCart()
  const {
    mutate: previewAllocation,
    data: previewResponse,
    error: previewError,
    isPending: isPreviewing,
  } = usePreviewBulkOrder()
  const previewKeyRef = useRef("")

  useEffect(() => {
    if (!isHydrated || items.length === 0) {
      return
    }

    const payload = buildBulkOrderPayload(items, emptyCheckout, source)
    const previewKey = JSON.stringify(payload)
    if (previewKeyRef.current === previewKey) {
      return
    }

    previewKeyRef.current = previewKey
    previewAllocation(payload)
  }, [isHydrated, items, previewAllocation, source])

  const previewTotals = useMemo(() => {
    if (!previewResponse?.data) {
      return null
    }

    return mapBulkOrderPreviewTotals(previewResponse.data, subtotal)
  }, [previewResponse, subtotal])

  if (!isHydrated) {
    return (
      <div className="bg-muted">
        <OfflineOrderBackButton
          href="/offline-order/bulk"
          label="Back to Bulk Menu"
        />
        <AppLoader />
      </div>
    )
  }

  if (selectedCount === 0) {
    return (
      <div className="bg-muted">
        <OfflineOrderBackButton
          href="/offline-order/bulk"
          label="Back to Bulk Menu"
        />
        <div className="flex items-center justify-center px-4 py-12">
          <div className="max-w-md rounded-2xl border border-border bg-background p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No bulk items allocated yet. Add portions to continue.
            </p>
            <Button asChild className="mt-4">
              <Link href="/offline-order/bulk">Back to Bulk Menu</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const resolvedPortionCount = previewTotals?.portionCount ?? portionCount
  const resolvedSideCount = previewTotals?.sideCount ?? sideCount
  const previewErrorMessage =
    previewError instanceof ApiError ? previewError.message : null
  const allocationValid =
    previewErrorMessage
      ? false
      : (previewTotals?.allocationValid ??
        (resolvedPortionCount > 0 && resolvedSideCount > 0))
  const allocationMessage =
    previewErrorMessage ??
    previewTotals?.allocationMessage ??
    (allocationValid
      ? `Allocation valid — ${resolvedPortionCount} main${resolvedPortionCount === 1 ? "" : "s"} & ${resolvedSideCount} side${resolvedSideCount === 1 ? "" : "s"} match perfectly`
      : null)

  return (
    <div className="bg-muted">
      <OfflineOrderBackButton
        href="/offline-order/bulk"
        label="Back to Bulk Menu"
      />

      <div className="space-y-6 p-4 md:p-6">
        <h1 className="text-xl font-semibold text-foreground">
          Portion Allocation Overview
        </h1>

        <BulkOrderPreviewTable items={items} onRemove={removeItem} />

        {allocationMessage ? (
          <div
            className={
              allocationValid
                ? "flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                : "flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
            }
          >
            {allocationValid ? (
              <Icons.checkCircle2 size={18} className="shrink-0" />
            ) : (
              <Icons.alertCircle size={18} className="shrink-0" />
            )}
            {allocationMessage}
          </div>
        ) : null}

        <BulkOrderInvoiceCard
          subtotal={previewTotals?.subtotal ?? subtotal}
          tax={previewTotals?.serviceFee}
          total={previewTotals?.total}
          discount={previewTotals?.discount}
          discountPercentage={previewTotals?.discountPercentage}
          isPreviewing={isPreviewing}
        />
      </div>
    </div>
  )
}
