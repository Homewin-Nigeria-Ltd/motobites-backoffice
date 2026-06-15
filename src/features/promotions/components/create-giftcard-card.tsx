"use client"

import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

type CreateGiftcardCardProps = {
  onClick?: () => void
}

export function CreateGiftcardCard({ onClick }: CreateGiftcardCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onClick?.()
        }
      }}
      className={cn(
        "gap-0 border border-border bg-secondary py-0 transition-shadow duration-200 hover:shadow-soft",
        onClick && "cursor-pointer focus-visible:outline-none"
      )}
    >
      <div className="flex min-h-42 flex-col items-center justify-center gap-2 px-5 py-8 text-center">
        <Icons.add size={24} className="text-primary" />
        <p className="text-sm font-medium text-primary">
          Create a New Gift Card
        </p>
      </div>
    </Card>
  )
}
