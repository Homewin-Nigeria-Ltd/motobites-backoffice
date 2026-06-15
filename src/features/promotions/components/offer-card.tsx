"use client"

import type { Offer } from "@/features/promotions/types"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

type OfferCardProps = {
  offer: Offer
  onClick?: () => void
}

export function OfferCard({ offer, onClick }: OfferCardProps) {
  return (
    <Card
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={cn(
        "gap-0 py-0 transition-shadow duration-200 hover:shadow-soft",
        onClick && "cursor-pointer focus-visible:outline-none"
      )}
    >
      <div className="flex items-center gap-4 px-5 py-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
          <Icons.priceTag size={22} className="text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-foreground">
            {offer.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {offer.description}
          </p>
        </div>
      </div>
    </Card>
  )
}
