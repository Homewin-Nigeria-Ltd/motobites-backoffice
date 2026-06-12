import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type CustomerDetailSection = {
  title: string
  description: string
}

type CustomerDetailBlockProps = {
  title?: string
  description?: string
  sections?: CustomerDetailSection[]
  headerAction?: ReactNode
  children: ReactNode
  className?: string
  plain?: boolean
}

export function CustomerDetailBlock({
  title,
  description,
  sections,
  headerAction,
  children,
  className,
  plain = false,
}: CustomerDetailBlockProps) {
  const blockSections =
    sections ??
    (title && description ? [{ title, description }] : [])

  return (
    <section
      className={cn(
        "grid gap-6 border-b border-border/60 py-8 md:gap-8 md:py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-x-10 xl:grid-cols-[260px_minmax(0,1fr)] xl:gap-x-12",
        className
      )}
    >
      <div className="space-y-2 lg:pr-2">
        {blockSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              {section.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {section.description}
            </p>
          </div>
        ))}
      </div>

      <div className="min-w-0">
        {headerAction ? (
          <div className="mb-6 flex justify-end">{headerAction}</div>
        ) : null}
        <div
          className={cn(
            plain && "px-1 md:px-2",
            !plain &&
              "rounded-2xl border border-border/60 bg-muted/30 p-5 md:p-6 lg:p-8"
          )}
        >
          {children}
        </div>
      </div>
    </section>
  )
}
