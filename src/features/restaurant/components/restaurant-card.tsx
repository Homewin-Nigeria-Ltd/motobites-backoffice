"use client"

import Image from "next/image"
import Link from "next/link"

import { buildRestaurantMenuHref } from "@/features/restaurant"
import type { Restaurant } from "@/features/restaurant/types"
import { toImageSrc } from "@/lib/image-url"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

type RestaurantCardProps = {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const menuHref = buildRestaurantMenuHref(restaurant.id)
  const description = restaurant.description || "Kitchen details will appear here."

  return (
    <Link href={menuHref} className="block min-w-0 rounded-2xl focus-visible:outline-none">
    <Card className="group/card gap-0 overflow-hidden py-0 transition-shadow duration-200 hover:shadow-soft">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={toImageSrc(restaurant.imageUrl)}
          alt={restaurant.name}
          fill
          className="object-cover transition-transform duration-200 group-hover/card:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
      <CardContent className="flex flex-col gap-3 pt-4">
        <h3 className="text-base font-semibold text-foreground">{restaurant.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {restaurant.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-full border-0 bg-secondary px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between py-4">
        <span className="text-sm font-medium text-muted-foreground">
          View kitchen
        </span>
        <Icons.arrowForward size={18} className="text-primary" />
      </CardFooter>
    </Card>
    </Link>
  )
}
