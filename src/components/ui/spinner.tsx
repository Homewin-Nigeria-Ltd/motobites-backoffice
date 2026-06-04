"use client"

import type { SVGAttributes } from "react"

import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

const LoaderIcon = Icons.loader

function Spinner({
  className,
  size = 16,
  ...props
}: SVGAttributes<SVGSVGElement> & { size?: number }) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      size={size}
      className={cn("animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
