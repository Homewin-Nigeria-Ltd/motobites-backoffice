"use client"

import Image from "next/image"

import type { Giftcard } from "@/features/promotions/types"
import { formatGiftcardAmount } from "@/features/promotions/utils/promotions"
import { ASSETS } from "@/constants/assets"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ThemeStyle = {
  text: string
  image: string
  imageAlt: string
  layout: "svg-background" | "gradient-with-image"
  background?: string
  imageWrapperClassName: string
  imageClassName: string
}

const themeStyles: Record<Giftcard["theme"], ThemeStyle> = {
  friendship: {
    text: "text-primary-foreground",
    image: ASSETS.illustrations.happyCustomer,
    imageAlt: "Friendship gift card background",
    layout: "svg-background",
    imageWrapperClassName: "inset-0",
    imageClassName: "object-cover object-center",
  },
  birthday: {
    text: "text-primary-foreground",
    image: ASSETS.illustrations.gift,
    imageAlt: "Birthday gift card illustration",
    layout: "gradient-with-image",
    background: "bg-gradient-to-r from-primary via-primary/90 to-primary/70",
    imageWrapperClassName: "inset-y-0 right-0 w-[55%]",
    imageClassName: "object-contain object-right-bottom",
  },
  love: {
    text: "text-foreground",
    image: ASSETS.illustrations.roses,
    imageAlt: "Love gift card background",
    layout: "svg-background",
    imageWrapperClassName: "inset-0",
    imageClassName: "object-cover object-center",
  },
}

type GiftcardCardProps = {
  giftcard: Giftcard
  onEdit?: (giftcard: Giftcard) => void
}

export function GiftcardCard({ giftcard, onEdit }: GiftcardCardProps) {
  const styles = themeStyles[giftcard.theme]

  return (
    <Card className="relative gap-0 overflow-hidden border-0 py-0 shadow-none">
      {styles.background ? (
        <div className={cn("absolute inset-0", styles.background)} aria-hidden />
      ) : null}

      <div
        className={cn(
          "pointer-events-none absolute",
          styles.imageWrapperClassName
        )}
      >
        <Image
          src={styles.image}
          alt={styles.imageAlt}
          fill
          className={styles.imageClassName}
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      <div className="relative flex min-h-42 flex-col justify-between p-5">
        <div className={cn("max-w-[58%]", styles.text)}>
          <p className="text-sm font-medium uppercase tracking-[0.08em]">
            {giftcard.label}
          </p>
          <p className="mt-2 text-2xl font-semibold leading-none tracking-tight">
            {formatGiftcardAmount(giftcard.amount)}
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            className="h-8 rounded-lg border border-primary-foreground px-4"
            onClick={() => onEdit?.(giftcard)}
          >
            Edit Giftcard
          </Button>
        </div>
      </div>
    </Card>
  )
}
