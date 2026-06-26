"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"

type InventoryItemQuantityStepperProps = {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function InventoryItemQuantityStepper({
  value,
  onChange,
  disabled,
}: InventoryItemQuantityStepperProps) {
  return (
    <div className="flex h-11 items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={disabled || value <= 1}
        className="shrink-0 border-primary text-primary"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Icons.remove size={16} />
      </Button>
      <Input
        type="number"
        min={1}
        step={1}
        value={value}
        disabled={disabled}
        className="h-11 text-center"
        onChange={(event) => {
          const next = Number(event.target.value)
          onChange(Number.isFinite(next) && next >= 1 ? Math.round(next) : 1)
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={disabled}
        className="shrink-0 border-primary text-primary"
        onClick={() => onChange(value + 1)}
      >
        <Icons.add size={16} />
      </Button>
    </div>
  )
}
