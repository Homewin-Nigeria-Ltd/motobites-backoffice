"use client"

import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

type CreateCustomerGroupCardProps = {
  className?: string
  onClick: () => void
}

export function CreateCustomerGroupCard({
  className,
  onClick,
}: CreateCustomerGroupCardProps) {
  return (
    <Card
      className={cn(
        "gap-0 border border-border bg-secondary py-0 transition-shadow duration-200 hover:shadow-soft",
        className
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-42 w-full flex-col items-center justify-center gap-2 px-5 py-8 text-center focus-visible:outline-none"
      >
        <Icons.add size={24} className="text-primary" />
        <p className="text-sm font-medium text-primary">
          Create a Customer Group
        </p>
      </button>
    </Card>
  )
}
