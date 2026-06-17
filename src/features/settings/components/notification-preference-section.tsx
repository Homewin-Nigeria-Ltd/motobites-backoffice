"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type NotificationPreferenceSectionProps = {
  title: string
  description: string
  children: ReactNode
  className?: string
}

export function NotificationPreferenceSection({
  title,
  description,
  children,
  className,
}: NotificationPreferenceSectionProps) {
  return (
    <section
      className={cn(
        "grid gap-6 py-8 first:pt-0 last:pb-0 lg:grid-cols-2 lg:gap-10",
        className
      )}
    >
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div>{children}</div>
    </section>
  )
}
