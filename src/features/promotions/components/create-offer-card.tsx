"use client"

import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

type CreateOfferCardProps = {
  onClick?: () => void
}

export function CreateOfferCard({ onClick }: CreateOfferCardProps) {
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
        "gap-0 border-dashed py-0 transition-shadow duration-200 hover:shadow-soft",
        onClick && "cursor-pointer focus-visible:outline-none"
      )}
    >
      <div className="flex items-center gap-4 px-5 py-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
          <Icons.add size={22} className="text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground">
            Create a New Offer
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Make your promotion stand out
          </p>
        </div>
      </div>
    </Card>
  )
}
