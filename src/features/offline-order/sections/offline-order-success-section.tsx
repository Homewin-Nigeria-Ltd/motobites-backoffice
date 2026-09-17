"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { OfflineOrderBackButton } from "@/features/offline-order/components/offline-order-back-button"
import { OfflineOrderPosReceipt } from "@/features/offline-order/components/offline-order-pos-receipt"
import { useOfflineOrderReceiptDetail } from "@/features/offline-order/hooks/use-offline-order-receipt-detail"
import { useOfflineOrderReceipt } from "@/features/offline-order/hooks/use-offline-order-storage"

export function OfflineOrderSuccessSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const shouldAutoPrint = searchParams.get("print") === "1"
  const { receipt: storedReceipt, clearReceipt } = useOfflineOrderReceipt()
  const {
    receipt: fetchedReceipt,
    isLoading,
    isError,
  } = useOfflineOrderReceiptDetail(orderId)
  const receipt = fetchedReceipt ?? storedReceipt
  const hasAutoPrintedRef = useRef(false)

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
      ? `/offline-order/success?${params.toString()}`
      : "/offline-order/success"

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
  }, [receipt, shouldAutoPrint, orderId, isLoading, router])

  if (orderId && isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted">
        <OfflineOrderBackButton href="/offline-order" label="Back to Overview" />
        <AppLoader />
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted">
        <OfflineOrderBackButton href="/offline-order" label="Back to Overview" />

        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="max-w-md rounded-2xl border border-border bg-background p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {isError
                ? "Could not load the order receipt. Please try again."
                : "No recent offline order found."}
            </p>
            <Button asChild className="mt-4">
              <Link href="/offline-order/new">Start New Order</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const handleNewOrder = () => {
    clearReceipt()
    router.push("/offline-order/new")
  }

  return (
    <>
      <div className="no-print flex min-h-0 flex-1 flex-col bg-muted">
        <OfflineOrderBackButton href="/offline-order" label="Back to Overview" />

        <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-8 md:px-6">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Icons.check size={32} />
          </div>

          <h1 className="mt-4 text-2xl font-semibold text-foreground md:text-3xl">
            Order Placed Successfully!
          </h1>
          <p className="mt-2 text-sm font-medium text-primary">
            Order #{receipt.orderNumber}
          </p>

          <div className="mt-8 w-full rounded-2xl border border-border bg-background p-4 shadow-sm">
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              POS Receipt Preview
            </p>
            <OfflineOrderPosReceipt receipt={receipt} />
          </div>

          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
            <Button
              className="h-11 flex-1"
              icon={{ name: "fileText", position: "left" }}
              onClick={handlePrint}
            >
              Print Receipt
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1"
              onClick={handleNewOrder}
            >
              New Order
            </Button>
          </div>

          <Button asChild variant="link" className="mt-4 text-primary">
            <Link href="/order">Back to Order Management →</Link>
          </Button>
        </div>
      </div>

      <div className="pos-receipt-print-root">
        <OfflineOrderPosReceipt receipt={receipt} />
      </div>
    </>
  )
}
