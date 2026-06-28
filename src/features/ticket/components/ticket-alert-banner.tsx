"use client"

import type { TicketAlert } from "@/features/ticket/types"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

type TicketAlertBannerProps = {
  alert: TicketAlert
  onDismiss?: () => void
  onViewTicket?: (ticketId: string) => void
}

export function TicketAlertBanner({
  alert,
  onDismiss,
  onViewTicket,
}: TicketAlertBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-destructive/15 bg-destructive/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      )}
      role="alert"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive text-white">
          <Icons.clock size={18} />
        </span>
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm text-foreground">
            <span className="font-medium">{alert.ticketNumber}</span>{" "}
            <span className="font-medium text-destructive">
              {alert.urgencyText}
            </span>
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {alert.description}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
        <Button
          type="button"
          variant="link"
          className="h-auto px-0 text-primary"
          onClick={() => onViewTicket?.(alert.ticketId)}
        >
          View Ticket
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          aria-label="Dismiss alert"
          onClick={onDismiss}
        >
          <Icons.close size={16} />
        </Button>
      </div>
    </div>
  )
}
