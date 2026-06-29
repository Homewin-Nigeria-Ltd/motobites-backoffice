"use client"

import Link from "next/link"

import { PROMOTIONS_ROUTES } from "@/features/promotions/constants"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

type CreateGiftcardCardProps = {
  className?: string
}

export function CreateGiftcardCard({ className }: CreateGiftcardCardProps) {
  return (
    <Card
      className={cn(
        "gap-0 border border-border bg-secondary py-0 transition-shadow duration-200 hover:shadow-soft",
        className
      )}
    >
      <Link
        href={PROMOTIONS_ROUTES.createGiftcard}
        className="flex min-h-42 flex-col items-center justify-center gap-2 px-5 py-8 text-center focus-visible:outline-none"
      >
        <Icons.add size={24} className="text-primary" />
        <p className="text-sm font-medium text-primary">
          Create a New Gift Card
        </p>
      </Link>
    </Card>
  )
}
