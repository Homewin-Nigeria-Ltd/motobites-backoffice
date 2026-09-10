"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icons"
import { SALES_TRANSACTION_ANALYTICS_PERIOD } from "@/features/sales-transaction/constants/analytics-mock-data"

export function SalesTransactionAnalyticsToolbar() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Button
        type="button"
        variant="outline"
        className="h-10 w-fit gap-2 px-3 text-sm font-normal text-foreground"
      >
        <span className="text-muted-foreground">Analysis Period:</span>
        {SALES_TRANSACTION_ANALYTICS_PERIOD}
        <Icon name="chevronDown" className="size-4 opacity-70" />
      </Button>

      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="flex size-4 items-center justify-center rounded-full border border-border text-[10px]">
          ↻
        </span>
        Auto-updates live
      </p>
    </div>
  )
}
