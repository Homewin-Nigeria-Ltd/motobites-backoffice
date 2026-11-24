"use client"

import Link from "next/link"
import { useState } from "react"

import { PROMOTIONS_ROUTES } from "@/features/promotions/constants"
import { useDeleteSpecialGiftOffer } from "@/features/promotions/hooks/use-promotion-mutations"
import type { SpecialGiftOffer } from "@/features/promotions/types"
import { formatSpecialOfferDateRange } from "@/features/promotions/utils/special-gift-offer"
import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

type SpecialGiftOfferCardProps = {
  offer: SpecialGiftOffer
}

export function SpecialGiftOfferCard({ offer }: SpecialGiftOfferCardProps) {
  const { deleteSpecialGiftOffer, isPending } = useDeleteSpecialGiftOffer()
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <Card className="gap-0 py-0 transition-shadow duration-200 hover:shadow-soft">
        <div className="flex items-start gap-4 px-5 py-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
            <Icons.priceTag size={22} className="text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-foreground">
              {offer.name}
            </h3>
            <p className="mt-1 text-xs font-medium text-primary">
              Min basket ₦{offer.minimumBasketValue.toLocaleString("en-NG")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Gift: {offer.giftMenuItemName} × {offer.giftQuantity}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatSpecialOfferDateRange(offer.startsAt, offer.endsAt)}
            </p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {offer.statusLabel}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link
                href={PROMOTIONS_ROUTES.editSpecialGiftOffer(offer.id)}
                aria-label={`Edit ${offer.name}`}
              >
                <Icons.edit size={18} />
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Delete ${offer.name}`}
              disabled={isPending}
              onClick={() => setDeleteOpen(true)}
            >
              <Icons.trash size={18} />
            </Button>
          </div>
        </div>
      </Card>

      <BaseAlertDialog
        title="Delete special offer?"
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        confirmLabel="Delete"
        pendingLabel="Deleting..."
        confirmVariant="destructive"
        isPending={isPending}
        onConfirm={() => {
          void deleteSpecialGiftOffer(offer.id).then((result) => {
            if (result.success) {
              setDeleteOpen(false)
            }
          })
        }}
      >
        This will permanently delete &quot;{offer.name}&quot;. This action
        cannot be undone.
      </BaseAlertDialog>
    </>
  )
}
