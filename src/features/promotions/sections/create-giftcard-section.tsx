"use client"

import Link from "next/link"

import { CreateGiftcardForm } from "@/features/promotions/components/create-giftcard-form"
import { PROMOTIONS_ROUTES } from "@/features/promotions/constants"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export function CreateGiftcardSection() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
          <Link href={PROMOTIONS_ROUTES.list} aria-label="Back to promotions">
            <Icons.chevronLeft size={20} />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Create Gift Card
          </h1>
          <p className="text-sm text-muted-foreground">
            Add a new gift card theme and publish it for customers.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <CreateGiftcardForm />
      </div>
    </div>
  )
}
