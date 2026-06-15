"use client"

import { useMemo, useState } from "react"

import { CreateGiftcardCard } from "@/features/promotions/components/create-giftcard-card"
import { CreateOfferCard } from "@/features/promotions/components/create-offer-card"
import { GiftcardCard } from "@/features/promotions/components/giftcard-card"
import { OfferCard } from "@/features/promotions/components/offer-card"
import { OffersToolbar } from "@/features/promotions/components/offers-toolbar"
import {
  DUMMY_GIFTCARDS,
  DUMMY_OFFERS,
} from "@/features/promotions/data/promotions.dummy"
import type { OfferTab } from "@/features/promotions/types"
import { filterOffers } from "@/features/promotions/utils/promotions"

export function PromotionDiscountSection() {
  const [tab, setTab] = useState<OfferTab>("all")
  const [search, setSearch] = useState("")

  const filteredOffers = useMemo(
    () => filterOffers(DUMMY_OFFERS, tab, search),
    [tab, search]
  )

  const handleTabChange = (value: OfferTab) => {
    setTab(value)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <section className="space-y-4">
        <OffersToolbar
          tab={tab}
          onTabChange={handleTabChange}
          search={search}
          onSearchChange={handleSearchChange}
        />

        {filteredOffers.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="flex items-center justify-center rounded-2xl border border-border bg-background p-12 text-center sm:col-span-2 xl:col-span-2">
              <p className="text-sm text-muted-foreground">
                {search
                  ? `No offers found matching "${search}".`
                  : "No offers found for this filter."}
              </p>
            </div>
            <CreateOfferCard />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
            <CreateOfferCard />
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Giftcards
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {DUMMY_GIFTCARDS.map((giftcard) => (
            <GiftcardCard key={giftcard.id} giftcard={giftcard} />
          ))}
          <CreateGiftcardCard />
        </div>
      </section>
    </div>
  )
}
