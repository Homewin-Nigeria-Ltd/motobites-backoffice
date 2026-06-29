"use client"

import Link from "next/link"

import type { Offer } from "@/features/promotions/types"
import { PROMOTIONS_ROUTES } from "@/features/promotions/constants"
import { Button } from "@/components/ui/button"
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
          {offer.promoCode ? (
            <p className="mt-1 truncate text-xs font-medium text-primary">
              {offer.promoCode}
            </p>
          ) : null}
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {offer.description || offer.detailsLabel}
          </p>
        </div>
        <div onClick={(event) => event.stopPropagation()}>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link
              href={PROMOTIONS_ROUTES.edit(offer.id)}
              aria-label={`Edit ${offer.title}`}
            >
              <Icons.edit size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
