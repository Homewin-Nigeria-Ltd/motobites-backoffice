import type { ReactNode } from "react"

type RiderProfileFieldProps = {
  label: string
  value: string
  action?: ReactNode
}

export function RiderProfileField({
  label,
  value,
  action,
}: RiderProfileFieldProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex items-center justify-between gap-3 rounded-sm border border-border bg-muted/30 px-3 py-2.5">
        <p className="min-w-0 truncate text-sm text-muted-foreground">{value}</p>
        {action}
      </div>
    </div>
  )
}
