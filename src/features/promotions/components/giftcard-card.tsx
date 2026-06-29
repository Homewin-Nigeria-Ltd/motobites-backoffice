"use client"

import Image from "next/image"
import Link from "next/link"

import type { Giftcard } from "@/features/promotions/types"
import { PROMOTIONS_ROUTES } from "@/features/promotions/constants"
import { ASSETS } from "@/constants/assets"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toImageSrc } from "@/lib/image-url"
import { cn } from "@/lib/utils"

type ThemeStyle = {
  text: string
  image: string
  imageAlt: string
  background?: string
  imageWrapperClassName: string
  imageClassName: string
}

const themeStyles: Record<string, ThemeStyle> = {
  friendship: {
    text: "text-primary-foreground",
    image: ASSETS.illustrations.happyCustomer,
    imageAlt: "Friendship gift card background",
    imageWrapperClassName: "inset-0",
    imageClassName: "object-cover object-center",
  },
  birthday: {
    text: "text-primary-foreground",
    image: ASSETS.illustrations.gift,
    imageAlt: "Birthday gift card illustration",
    background: "bg-gradient-to-r from-primary via-primary/90 to-primary/70",
    imageWrapperClassName: "inset-y-0 right-0 w-[55%]",
    imageClassName: "object-contain object-right-bottom",
  },
  love: {
    text: "text-foreground",
    image: ASSETS.illustrations.roses,
    imageAlt: "Love gift card background",
    imageWrapperClassName: "inset-0",
    imageClassName: "object-cover object-center",
  },
}

type GiftcardCardProps = {
  giftcard: Giftcard
}

export function GiftcardCard({ giftcard }: GiftcardCardProps) {
  const fallbackStyles = themeStyles[giftcard.category] ?? themeStyles.birthday
  const hasRemoteImage = Boolean(giftcard.imageUrl?.trim())
  const displayAmount =
    giftcard.amountFormatted || `₦ ${giftcard.amount.toLocaleString("en-NG")}`

  return (
    <Card className="relative gap-0 overflow-hidden border-0 py-0 shadow-none">
      {hasRemoteImage ? (
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={toImageSrc(giftcard.imageUrl)}
            alt={giftcard.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute inset-0 bg-foreground/25" aria-hidden />
        </div>
      ) : (
        <>
          {fallbackStyles.background ? (
            <div
              className={cn("absolute inset-0", fallbackStyles.background)}
              aria-hidden
            />
          ) : null}
          <div
            className={cn(
              "pointer-events-none absolute",
              fallbackStyles.imageWrapperClassName
            )}
          >
            <Image
              src={fallbackStyles.image}
              alt={fallbackStyles.imageAlt}
              fill
              className={fallbackStyles.imageClassName}
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </>
      )}

      <div className="relative flex min-h-42 flex-col justify-between p-5">
        <div
          className={cn(
            "max-w-[58%]",
            hasRemoteImage ? "text-primary-foreground" : fallbackStyles.text
          )}
        >
          <p className="text-sm font-medium uppercase tracking-[0.08em]">
            {giftcard.categoryLabel || giftcard.title}
          </p>
          <p className="mt-2 text-2xl font-semibold leading-none tracking-tight">
            {displayAmount}
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            className="h-8 rounded-lg border border-primary-foreground px-4"
            asChild
          >
            <Link href={PROMOTIONS_ROUTES.editGiftcard(giftcard.id)}>
              Edit Giftcard
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
