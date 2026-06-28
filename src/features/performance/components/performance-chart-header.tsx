import type { ReactNode } from "react"

import { Icons } from "@/components/ui/icons"

type PerformanceChartHeaderProps = {
  icon: ReactNode
  title: string
  showInfo?: boolean
}

export function PerformanceChartHeader({
  icon,
  title,
  showInfo = true,
}: PerformanceChartHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {showInfo ? (
        <Icons.circleHelp
          className="size-3.5 text-muted-foreground/70"
          aria-hidden
        />
      ) : null}
    </div>
  )
}
