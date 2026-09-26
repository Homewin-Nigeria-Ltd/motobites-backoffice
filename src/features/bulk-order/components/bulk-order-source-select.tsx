"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { BULK_ORDER_SOURCE_OPTIONS } from "../constants"
import type { BulkOrderSource } from "../types"

type BulkOrderSourceSelectProps = {
  value: BulkOrderSource
  onChange: (value: BulkOrderSource) => void
}

export function BulkOrderSourceSelect({
  value,
  onChange,
}: BulkOrderSourceSelectProps) {
  return (
    <div className="w-full max-w-xs space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">Order Source</p>
      <Select
        value={value}
        onValueChange={(next) => onChange(next as BulkOrderSource)}
      >
        <SelectTrigger size="lg" className="h-10 w-full rounded-xl">
          <SelectValue placeholder="Select order source" />
        </SelectTrigger>
        <SelectContent>
          {BULK_ORDER_SOURCE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
