"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { CreateGiftcardCard } from "@/features/promotions/components/create-giftcard-card"
import { CreateOfferCard } from "@/features/promotions/components/create-offer-card"
import { GiftcardCard } from "@/features/promotions/components/giftcard-card"
import { OfferCard } from "@/features/promotions/components/offer-card"
import { OffersToolbar } from "@/features/promotions/components/offers-toolbar"
import { PROMOTIONS_ROUTES } from "@/features/promotions/constants"
import {
  useGiftcards,
  usePromotionOffers,
} from "@/features/promotions/hooks/use-promotion-queries"
import type { OfferTab } from "@/features/promotions/types"
import { filterOffers } from "@/features/promotions/utils/promotions"
import { AppLoader } from "@/components/ui/app-loader"

export function PromotionDiscountSection() {
  const router = useRouter()
  const [tab, setTab] = useState<OfferTab>("all")
  const [search, setSearch] = useState("")
  const {
    data: offers = [],
    isPending,
    isError,
    error,
    isFetching,
  } = usePromotionOffers({ tab })
  const {
    data: giftcards = [],
    isPending: isGiftcardsPending,
    isError: isGiftcardsError,
    error: giftcardsError,
    isFetching: isGiftcardsFetching,
  } = useGiftcards()

  const filteredOffers = useMemo(
    () => filterOffers(offers, search),
    [offers, search]
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

        {isPending && offers.length === 0 ? (
          <AppLoader className="min-h-48" />
        ) : isError ? (
          <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Failed to load offers."}
          </div>
        ) : filteredOffers.length === 0 ? (
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
          <div
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            aria-busy={isFetching}
          >
            {filteredOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onClick={() => router.push(PROMOTIONS_ROUTES.detail(offer.id))}
              />
            ))}
            <CreateOfferCard />
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Giftcards
        </h2>

        <div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-busy={isGiftcardsFetching}
        >
          {isGiftcardsPending && giftcards.length === 0 ? (
            <AppLoader className="min-h-42 sm:col-span-2 xl:col-span-2" />
          ) : isGiftcardsError ? (
            <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive sm:col-span-2 xl:col-span-2">
              {giftcardsError instanceof Error
                ? giftcardsError.message
                : "Failed to load gift cards."}
            </div>
          ) : (
            giftcards.map((giftcard) => (
              <GiftcardCard key={giftcard.id} giftcard={giftcard} />
            ))
          )}
          <CreateGiftcardCard />
        </div>
      </section>
    </div>
  )
}
