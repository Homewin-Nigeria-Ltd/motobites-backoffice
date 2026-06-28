"use client"

import type { TicketPeriod } from "@/features/ticket/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"

const PERIOD_LABELS: Record<TicketPeriod, string> = {
  monthly: "Monthly",
  weekly: "Weekly",
  daily: "Daily",
}

type TicketPeriodFilterProps = {
  value: TicketPeriod
  onChange: (value: TicketPeriod) => void
}

export function TicketPeriodFilter({ value, onChange }: TicketPeriodFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 gap-2 border-border bg-background px-3 text-sm font-medium"
        >
          {PERIOD_LABELS[value]}
          <Icons.chevronDown size={16} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(PERIOD_LABELS) as TicketPeriod[]).map((period) => (
          <DropdownMenuItem key={period} onClick={() => onChange(period)}>
            {PERIOD_LABELS[period]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
