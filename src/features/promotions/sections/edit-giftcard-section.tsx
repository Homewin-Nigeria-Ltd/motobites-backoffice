"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"

import { GiftcardForm } from "@/features/promotions/components/giftcard-form"
import { promotionQueries } from "@/features/promotions/api/queries"
import { PROMOTIONS_ROUTES } from "@/features/promotions/constants"
import { mapApiGiftcardToFormValues } from "@/features/promotions/utils/giftcard-form"
import { Button } from "@/components/ui/button"
import { AppLoader } from "@/components/ui/app-loader"
import { Icons } from "@/components/ui/icons"

type EditGiftcardSectionProps = {
  giftcardId: string
}

export function EditGiftcardSection({ giftcardId }: EditGiftcardSectionProps) {
  const { data: giftcard, isPending, isError, error } = useQuery(
    promotionQueries.apiGiftcard(giftcardId)
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
          <Link href={PROMOTIONS_ROUTES.list} aria-label="Back to promotions">
            <Icons.chevronLeft size={20} />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Edit Gift Card</h1>
          <p className="text-sm text-muted-foreground">
            Update gift card details and save your changes.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        {isPending ? (
          <AppLoader className="min-h-48" />
        ) : isError || !giftcard ? (
          <p className="text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Failed to load gift card details."}
          </p>
        ) : (
          <GiftcardForm
            key={giftcard.id}
            mode="edit"
            giftcardId={String(giftcard.id)}
            defaultValues={mapApiGiftcardToFormValues(giftcard)}
            existingImageUrl={giftcard.image_url}
          />
        )}
      </div>
    </div>
  )
}
