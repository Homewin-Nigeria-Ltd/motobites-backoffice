"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { TimeStepper } from "@/components/ui/time-stepper"
import { Icons } from "@/components/ui/icons"
import type { OpeningHoursRow } from "@/features/restaurant/types"

type OpeningHoursEditorProps = {
  rows: OpeningHoursRow[]
  onChange: (rows: OpeningHoursRow[]) => void
  label?: string | false
}

export function OpeningHoursEditor({
  rows,
  onChange,
  label = "Opening Hours",
}: OpeningHoursEditorProps) {
  const updateRow = (
    id: string,
    field: keyof Pick<OpeningHoursRow, "startTime" | "endTime" | "enabled">,
    value: string | boolean
  ) => {
    onChange(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    )
  }

  return (
    <div className="space-y-3">
      {label ? (
        <Label className="text-base font-semibold text-foreground">{label}</Label>
      ) : null}
      <div className="space-y-3">
        {rows.map((row) => {
          const isEnabled = row.enabled !== false

          return (
            <div
              key={row.id}
              className="flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <span className="w-28 shrink-0 text-sm font-medium text-foreground">
                {row.day}
              </span>
              {isEnabled ? (
                <>
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
                    onClick={() => updateRow(row.id, "enabled", false)}
                  >
                    <Icons.trash size={16} />
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-sm text-muted-foreground">Closed</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                    aria-label={`Add ${row.day} hours`}
                    onClick={() => updateRow(row.id, "enabled", true)}
                  >
                    <Icons.add size={16} />
                  </Button>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
