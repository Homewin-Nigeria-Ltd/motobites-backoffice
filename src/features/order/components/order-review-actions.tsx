"use client"

import { useState } from "react"

import { OrderRejectDialog } from "@/features/order/components/order-reject-dialog"
import { useAcceptOrder } from "@/features/order/hooks/use-order-mutations"
import { Button } from "@/components/ui/button"

type OrderReviewActionsProps = {
  orderId: string
  onAccepted?: () => void
  onRejected?: () => void
}

export function OrderReviewActions({
  orderId,
  onAccepted,
  onRejected,
}: OrderReviewActionsProps) {
  const [rejectOpen, setRejectOpen] = useState(false)
  const { acceptOrder, isPending, pendingOrderId } = useAcceptOrder()
  const isAccepting = isPending && pendingOrderId === orderId

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isAccepting}
          onClick={() => setRejectOpen(true)}
        >
          Decline
        </Button>
        <Button
          type="button"
          disabled={isAccepting}
          onClick={() =>
            acceptOrder(
              { orderId },
              {
                onSuccess: () => onAccepted?.(),
              }
            )
          }
        >
          {isAccepting ? "Accepting..." : "Accept"}
        </Button>
      </div>
      <OrderRejectDialog
        orderId={orderId}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onRejected={onRejected}
      />
    </>
  )
}
