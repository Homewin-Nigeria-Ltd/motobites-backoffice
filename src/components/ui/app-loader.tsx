"use client"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type AppLoaderProps = {
  className?: string
  spinnerClassName?: string
}

export function AppLoader({ className, spinnerClassName }: AppLoaderProps) {
  return (
    <div
      className={cn("flex items-center justify-center py-12", className)}
      aria-live="polite"
    >
      <Spinner className={cn("size-8 text-primary", spinnerClassName)} />
    </div>
  )
}
