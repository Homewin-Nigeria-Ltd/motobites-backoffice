"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type RiderFormSectionProps = {
  title: string
  description: string
  children: ReactNode
  className?: string
}

export function RiderFormSection({
  title,
  description,
  children,
  className,
}: RiderFormSectionProps) {
  return (
    <section
      className={cn(
        "grid gap-6 border-b border-border py-8 last:border-b-0 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-10",
        className
      )}
    >
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  )
}
