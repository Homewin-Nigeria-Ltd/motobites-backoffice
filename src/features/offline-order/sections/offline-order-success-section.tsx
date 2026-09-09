"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { OfflineOrderPosReceipt } from "@/features/offline-order/components/offline-order-pos-receipt"
import { useOfflineOrderReceipt } from "@/features/offline-order/hooks/use-offline-order-storage"

export function OfflineOrderSuccessSection() {
  const router = useRouter()
  const { receipt, clearReceipt } = useOfflineOrderReceipt()

  if (!receipt) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-muted px-4 py-12">
        <div className="max-w-md rounded-2xl border border-border bg-background p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No recent offline order found.
          </p>
          <Button asChild className="mt-4">
            <Link href="/offline-order/new">Start New Order</Link>
          </Button>
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
      <div className="no-print flex min-h-0 flex-1 flex-col bg-muted px-4 py-8 md:px-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
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

      <div className="pos-receipt-print-root hidden print:block">
        <OfflineOrderPosReceipt receipt={receipt} />
      </div>
    </>
  )
}
