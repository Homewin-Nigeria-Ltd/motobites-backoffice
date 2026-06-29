"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"

import { OfferForm } from "@/features/promotions/components/offer-form"
import { promotionQueries } from "@/features/promotions/api/queries"
import { PROMOTIONS_ROUTES } from "@/features/promotions/constants"
import { mapApiOfferToFormValues } from "@/features/promotions/utils/offer-form"
import { Button } from "@/components/ui/button"
import { AppLoader } from "@/components/ui/app-loader"
import { Icons } from "@/components/ui/icons"

type EditOfferSectionProps = {
  offerId: string
}

export function EditOfferSection({ offerId }: EditOfferSectionProps) {
  const { data: offer, isPending, isError, error } = useQuery(
    promotionQueries.apiOffer(offerId)
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
          <Link
            href={PROMOTIONS_ROUTES.detail(offerId)}
            aria-label="Back to promotion details"
          >
            <Icons.chevronLeft size={20} />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Edit Promo</h1>
          <p className="text-sm text-muted-foreground">
            Update promotion details and save your changes.
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
              : "Failed to load promotion details."}
          </p>
        ) : (
          <OfferForm
            key={offer.id}
            mode="edit"
            offerId={String(offer.id)}
            defaultValues={mapApiOfferToFormValues(offer)}
            isActive={offer.is_active}
          />
        )}
      </div>
    </div>
  )
}
