"use client"

import { CreateSpecialGiftOfferCard } from "@/features/promotions/components/create-special-gift-offer-card"
import { SpecialGiftOfferCard } from "@/features/promotions/components/special-gift-offer-card"
import { useSpecialGiftOffers } from "@/features/promotions/hooks/use-promotion-queries"
import { AppLoader } from "@/components/ui/app-loader"

export function SpecialGiftOffersSection() {
  const {
    data: offers = [],
    isPending,
    isError,
    error,
    isFetching,
  } = useSpecialGiftOffers()

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Special offers
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage special gift offers shown to customers.
        </p>
      </div>

      <div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        aria-busy={isFetching}
      >
        {isPending && offers.length === 0 ? (
          <AppLoader className="min-h-42 sm:col-span-2 xl:col-span-2" />
        ) : isError ? (
          <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive sm:col-span-2 xl:col-span-2">
            {error instanceof Error
              ? error.message
              : "Failed to load special offers."}
          </div>
        ) : (
          offers.map((offer) => (
            <SpecialGiftOfferCard key={offer.id} offer={offer} />
          ))
        )}
        <CreateSpecialGiftOfferCard />
      </div>
    </section>
  )
}
