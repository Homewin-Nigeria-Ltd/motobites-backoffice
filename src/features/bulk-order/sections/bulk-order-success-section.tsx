"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { OfflineOrderBackButton } from "@/features/offline-order/components/offline-order-back-button"
import { OfflineOrderPosReceipt } from "@/features/offline-order/components/offline-order-pos-receipt"
import { mapSalesDashboardOrderToReceipt } from "@/features/offline-order/utils/map-offline-order-receipt"
import { getSalesDashboardOrderReference } from "@/features/offline-order/utils/sales-dashboard-order"

import { useBulkOrder } from "../hooks/use-bulk-order-queries"
import { useBulkOrderReceipt } from "../hooks/use-bulk-order-receipt"

export function BulkOrderSuccessSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const shouldAutoPrint = searchParams.get("print") === "1"
  const { receipt: storedReceipt, clearReceipt } = useBulkOrderReceipt()
  const { data: order, isLoading, isError } = useBulkOrder(orderId)
  const fetchedReceipt = order ? mapSalesDashboardOrderToReceipt(order) : null
  const receipt = fetchedReceipt ?? storedReceipt
  const hasAutoPrintedRef = useRef(false)
  const orderNumber =
    receipt?.orderNumber ??
    (order ? getSalesDashboardOrderReference(order).replace(/^#/, "") : "")

  useEffect(() => {
    if (!receipt || !shouldAutoPrint || hasAutoPrintedRef.current) {
      return
    }

    if (orderId && isLoading) {
      return
    }

    const params = new URLSearchParams()
    if (orderId) {
      params.set("orderId", orderId)
    }

    const nextUrl = params.toString()
      ? `/offline-order/bulk/success?${params.toString()}`
      : "/offline-order/bulk/success"

    let hasClearedPrintParam = false

    const clearPrintParam = () => {
      if (hasClearedPrintParam) {
        return
      }

      hasClearedPrintParam = true
      router.replace(nextUrl)
    }

    let fallbackTimer: number | undefined
    let handleAfterPrint: (() => void) | undefined

    const timer = window.setTimeout(() => {
      const printRoot = document.querySelector(".pos-receipt-print-root")
      if (!printRoot) {
        return
      }

      hasAutoPrintedRef.current = true

      handleAfterPrint = () => {
        if (fallbackTimer) {
          window.clearTimeout(fallbackTimer)
        }
        clearPrintParam()
      }

      window.addEventListener("afterprint", handleAfterPrint)
      window.print()

      fallbackTimer = window.setTimeout(() => {
        if (handleAfterPrint) {
          window.removeEventListener("afterprint", handleAfterPrint)
        }
        clearPrintParam()
      }, 2000)
    }, 350)

    return () => {
      window.clearTimeout(timer)
      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer)
      }
      if (handleAfterPrint) {
        window.removeEventListener("afterprint", handleAfterPrint)
      }
    }
  }, [isLoading, orderId, receipt, router, shouldAutoPrint])

  if (orderId && isLoading) {
    return (
      <div className="bg-muted">
        <OfflineOrderBackButton href="/offline-order" label="Back to Overview" />
        <AppLoader />
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="bg-muted">
        <OfflineOrderBackButton href="/offline-order" label="Back to Overview" />

        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="max-w-md rounded-2xl border border-border bg-background p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {isError
                ? "Could not load the bulk order. Please try again."
                : "No recent bulk order found."}
            </p>
            <Button asChild className="mt-4">
              <Link href="/offline-order/bulk">Start New Bulk Order</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleNewOrder = () => {
    clearReceipt()
    router.push("/offline-order/bulk")
  }

  return (
    <>
      <div className="no-print bg-muted">
        <OfflineOrderBackButton href="/offline-order" label="Back to Overview" />

        <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-8 md:px-6">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Icons.check size={32} />
          </div>

          <h1 className="mt-4 text-2xl font-semibold text-foreground md:text-3xl">
            Bulk Order Placed Successfully!
          </h1>
          <p className="mt-2 text-sm font-medium text-primary">
            Order #{orderNumber}
          </p>

          <div className="mt-8 w-full rounded-2xl border border-border bg-background p-4 shadow-sm">
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Receipt Preview
            </p>
            <OfflineOrderPosReceipt receipt={receipt} />
          </div>

          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
            <Button
              className="h-11 flex-1"
              icon={{ name: "fileText", position: "left" }}
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1"
              onClick={handleNewOrder}
            >
              New Bulk Order
            </Button>
          </div>

          <Button asChild variant="link" className="mt-4 text-primary">
            <Link href="/offline-order/bulk/all">View All Bulk Orders →</Link>
          </Button>
        </div>
      </div>

      <div className="pos-receipt-print-root">
        <OfflineOrderPosReceipt receipt={receipt} />
      </div>
    </>
  )
}
