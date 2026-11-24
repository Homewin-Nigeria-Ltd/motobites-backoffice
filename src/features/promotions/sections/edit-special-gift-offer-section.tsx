"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"

import { SpecialGiftOfferForm } from "@/features/promotions/components/special-gift-offer-form"
import { promotionQueries } from "@/features/promotions/api/queries"
import { PROMOTIONS_ROUTES } from "@/features/promotions/constants"
import { mapSpecialGiftOfferToFormValues } from "@/features/promotions/utils/special-gift-offer-form"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

type EditSpecialGiftOfferSectionProps = {
  offerId: string
}

export function EditSpecialGiftOfferSection({
  offerId,
}: EditSpecialGiftOfferSectionProps) {
  const { data: offer, isPending, isError, error } = useQuery(
    promotionQueries.specialGiftOffer(offerId)
  )

  return (
    <div className="flex flex-col bg-muted p-4 md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
          <Link href={PROMOTIONS_ROUTES.list} aria-label="Back to promotions">
            <Icons.chevronLeft size={20} />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Edit Special Offer
          </h1>
          <p className="text-sm text-muted-foreground">
            Update special offer details and save your changes.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        {isPending ? (
          <AppLoader className="min-h-48" />
        ) : isError || !offer ? (
          <p className="text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Failed to load special offer details."}
          </p>
        ) : (
          <SpecialGiftOfferForm
            key={offer.id}
            mode="edit"
            offerId={offer.id}
            defaultValues={mapSpecialGiftOfferToFormValues(offer)}
            giftMenuItemLabel={offer.giftMenuItemName}
          />
        )}
      </div>
    </div>
  )
}
