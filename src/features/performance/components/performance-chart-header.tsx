"use client"

import type { ReactNode } from "react"

import { Icons } from "@/components/ui/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type PerformanceChartHeaderProps = {
  icon: ReactNode
  title: string
  info?: string
}

export function PerformanceChartHeader({
  icon,
  title,
  info,
}: PerformanceChartHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {info ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground/70 transition-colors hover:text-muted-foreground"
              aria-label={`More info about ${title}`}
            >
              <Icons.circleHelp className="size-3.5" aria-hidden />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">{info}</TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  )
}
