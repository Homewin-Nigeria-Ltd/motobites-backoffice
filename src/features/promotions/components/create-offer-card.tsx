"use client"

import Link from "next/link"

import { PROMOTIONS_ROUTES } from "@/features/promotions/constants"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

type CreateOfferCardProps = {
  href?: string
}

export function CreateOfferCard({
  href = PROMOTIONS_ROUTES.create,
}: CreateOfferCardProps) {
  return (
    <Link href={href} className="block focus-visible:outline-none">
      <Card className="gap-0 border-dashed py-0 transition-shadow duration-200 hover:shadow-soft">
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
    </Link>
  )
}
