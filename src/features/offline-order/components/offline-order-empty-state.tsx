"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

type OfflineOrderEmptyStateProps = {
  message: string
  backHref?: string
  backLabel?: string
  showBackButton?: boolean
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function OfflineOrderEmptyState({
  message,
  backHref = "/offline-order/new",
  backLabel = "Back to Menu",
  showBackButton = true,
  secondaryAction,
}: OfflineOrderEmptyStateProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="flex flex-1 items-center justify-center px-4 py-12 md:px-6">
        <div className="max-w-md rounded-2xl border border-border bg-background p-8 text-center">
          <p className="text-sm text-muted-foreground">{message}</p>
          <div className="mt-4 flex flex-col gap-2">
            {showBackButton ? (
              <Button asChild>
                <Link href={backHref}>{backLabel}</Link>
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button
                type="button"
                variant="outline"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
