"use client"

import * as React from "react"

import { Icons } from "@/components/ui/icons"
import type { FieldIcon } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const inputClassName =
  "h-8 w-full min-w-0 rounded-sm border border-border bg-transparent px-2.5 py-1 text-base transition-colors duration-200 outline-none focus-visible:outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm"

function Input({
  className,
  type,
  icon,
  ...props
}: React.ComponentProps<"input"> & {
  icon?: FieldIcon
}) {
  if (!icon) {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(inputClassName, className)}
        {...props}
      />
    )
  }

  const position = icon.position
  const iconSize = icon.size ?? 16

  const IconComponent = Icons[icon.name]

  return (
    <div data-slot="input-group" className="relative w-full">
      <IconComponent
        size={iconSize}
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground",
          position === "left" ? "left-3" : "right-3",
          icon.className
        )}
      />
      <input
        type={type}
        data-slot="input"
        className={cn(
          inputClassName,
          position === "left" && "pl-9",
          position === "right" && "pr-9",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }
