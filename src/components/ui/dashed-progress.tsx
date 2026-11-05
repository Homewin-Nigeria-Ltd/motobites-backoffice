import { cn } from "@/lib/utils"

function filledSegments(value: number, max: number, segments: number) {
  if (max <= 0 || value <= 0) {
    return 0
  }

  const ratio = Math.min(value / max, 1)
  if (ratio >= 1) {
    return segments
  }

  return Math.min(segments, Math.max(1, Math.round(ratio * segments)))
}

function DashedProgress({
  value,
  max,
  segments = 10,
  fill = false,
  className,
}: {
  value: number
  max: number
  segments?: number
  fill?: boolean
  className?: string
}) {
  const filled = filledSegments(value, max, segments)

  return (
    <div
      data-slot="dashed-progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(Math.max(value, 0), max > 0 ? max : 0)}
      className={cn("flex items-center gap-1", fill && "w-full", className)}
    >
      {Array.from({ length: segments }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-2.5 rounded-[4px]",
            fill ? "min-w-0 flex-1" : "w-4",
            index < filled ? "bg-primary" : "bg-foreground/15"
          )}
        />
      ))}
    </div>
  )
}

export { DashedProgress }
