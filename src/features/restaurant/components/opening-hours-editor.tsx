"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import type { OpeningHoursRow } from "@/features/restaurant/types"

function TimeStepper({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground">
      <button
        type="button"
        onClick={() => onChange(value)}
        className="flex size-6 items-center justify-center rounded text-primary hover:bg-muted"
        aria-label="Decrease time"
      >
        <Icons.remove size={14} />
      </button>
      <span className="min-w-[4.5rem] text-center font-medium">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value)}
        className="flex size-6 items-center justify-center rounded text-primary hover:bg-muted"
        aria-label="Increase time"
      >
        <Icons.add size={14} />
      </button>
    </div>
  )
}

type OpeningHoursEditorProps = {
  rows: OpeningHoursRow[]
  onChange: (rows: OpeningHoursRow[]) => void
}

export function OpeningHoursEditor({ rows, onChange }: OpeningHoursEditorProps) {
  const updateRow = (
    id: string,
    field: keyof Pick<OpeningHoursRow, "startTime" | "endTime">,
    value: string
  ) => {
    onChange(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    )
  }

  const removeRow = (id: string) => {
    onChange(rows.filter((row) => row.id !== id))
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold text-foreground">
        Opening Hours
      </Label>
      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <span className="w-28 shrink-0 text-sm font-medium text-foreground">
              {row.day}
            </span>
            <TimeStepper
              value={row.startTime}
              onChange={(value) => updateRow(row.id, "startTime", value)}
            />
            <span className="text-sm text-muted-foreground">to</span>
            <TimeStepper
              value={row.endTime}
              onChange={(value) => updateRow(row.id, "endTime", value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="bg-destructive/10 text-destructive hover:bg-destructive/20"
              aria-label={`Remove ${row.day} hours`}
              onClick={() => removeRow(row.id)}
            >
              <Icons.trash size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
