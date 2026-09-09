"use client"

import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"

export function OfflineOrderManagerModeBanner() {
  return (
    <div className="border-b border-amber-200/80 bg-amber-50 px-4 py-4 md:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              Elevated Manager Mode Enabled
            </p>
            <Badge
              variant="outline"
              className="border-amber-300 bg-amber-100 text-amber-900"
            >
              Restricted
            </Badge>
          </div>
          <p className="max-w-3xl text-sm text-muted-foreground">
            You have direct override permissions to void transactions, modify
            quantities, and edit item structures before final POS settling.
          </p>
        </div>
        <Icons.shield size={20} className="hidden shrink-0 text-amber-700 sm:block" />
      </div>
    </div>
  )
}
