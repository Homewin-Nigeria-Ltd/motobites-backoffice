"use client"

import type { IncomingOrderAlert } from "@/features/notification/utils/incoming-order-alert"
import { OrderReviewActions } from "@/features/order/components/order-review-actions"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"

type IncomingOrderAlertModalProps = {
  alerts: IncomingOrderAlert[]
  onDismiss: (id: string) => void
}

export function IncomingOrderAlertModal({
  alerts,
  onDismiss,
}: IncomingOrderAlertModalProps) {
  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-foreground/30 p-4">
      {alerts.map((alert, index) => (
        <article
          key={alert.id}
          className="absolute w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-popover shadow-xl"
          style={{
            zIndex: index + 1,
            transform: `translate(${index * 14}px, ${index * 14}px)`,
          }}
        >
          <div className="flex items-center justify-between gap-3 px-4 pt-3">
            <h2 className="text-base font-semibold text-foreground">{alert.title}</h2>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 rounded-full bg-muted text-muted-foreground"
              aria-label="Close"
              onClick={() => onDismiss(alert.id)}
            >
              <Icons.close size={16} />
            </Button>
          </div>
          <div className="space-y-2 px-4 py-3">
            {alert.message ? (
              <p className="text-sm leading-snug text-muted-foreground">
                {alert.message}
              </p>
            ) : null}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {alert.fields.map((field) => (
                <div key={field.label} className="min-w-0 space-y-0.5">
                  <Label className="text-xs font-normal text-muted-foreground">
                    {field.label}
                  </Label>
                  <p className="truncate text-sm font-medium text-foreground">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {alert.canReview ? (
            <div className="border-t border-border px-4 py-3 [&_button]:h-9 [&_button]:flex-1 [&_button]:font-bold">
              <OrderReviewActions
                orderId={alert.orderId}
                onAccepted={() => onDismiss(alert.id)}
                onRejected={() => onDismiss(alert.id)}
              />
            </div>
          ) : null}
        </article>
      ))}
    </div>
  )
}
