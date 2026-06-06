"use client"

import { Icons } from "@/components/ui/icons"
import { stepTime } from "@/lib/time-stepper"
import { cn } from "@/lib/utils"

const STEP_MINUTES = 30

type TimeStepperProps = {
  value: string
  onChange: (value: string) => void
  className?: string
  stepMinutes?: number
}

export function TimeStepper({
  value,
  onChange,
  className,
  stepMinutes = STEP_MINUTES,
}: TimeStepperProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange(stepTime(value, -stepMinutes))}
        className="flex size-6 items-center justify-center rounded text-primary hover:bg-muted"
        aria-label="Decrease time"
      >
        <Icons.remove size={14} />
      </button>
      <span className="min-w-[4.5rem] text-center font-medium">{value}</span>
      <button
        type="button"
        onClick={() => onChange(stepTime(value, stepMinutes))}
        className="flex size-6 items-center justify-center rounded text-primary hover:bg-muted"
        aria-label="Increase time"
      >
        <Icons.add size={14} />
      </button>
    </div>
  )
}
