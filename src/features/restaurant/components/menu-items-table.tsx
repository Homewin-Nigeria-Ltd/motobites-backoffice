"use client"

import Image from "next/image"
import { Icons } from "@/components/ui/icons"
import type { MenuDetailItem } from "@/features/restaurant/types"
import { toImageSrc } from "@/lib/image-url"
import { cn } from "@/lib/utils"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icons.star
          key={i}
          size={16}
          color={i < rating ? "#fbbf24" : "#e5e7eb"}
        />
      ))}
    </div>
  )
}

export function MenuItemsTable({
  items,
  activeItemId,
  activeItemName,
  onViewDetails,
}: {
  items: MenuDetailItem[]
  kitchenId?: string
  activeItemId?: string | null
  activeItemName?: string | null
  onViewDetails?: (itemId: string) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      <div className="hidden border-b border-border/60 bg-muted px-4 py-3 text-sm font-medium text-muted-foreground md:grid md:grid-cols-[minmax(0,2fr)_120px_100px_100px_80px_120px] md:gap-4 md:px-6">
        <span>Item</span>
        <span>Popularity</span>
        <span>Items Sold</span>
        <span>Review</span>
        <span>Item Error</span>
        <span className="sr-only">Action</span>
      </div>

      <ul className="divide-y divide-border/60">
        {items.map((item) => {
          const isHighlighted =
            activeItemId === item.id ||
            (activeItemName != null && item.name === activeItemName)

          const openDetails = () => onViewDetails?.(item.id)

          const handleRowClick = (e: React.MouseEvent<HTMLElement>) => {
            const target = e.target as HTMLElement
            if (target.closest("[data-menu-row-action]")) return
            openDetails()
          }

          return (
            <li
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={handleRowClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  openDetails()
                }
              }}
              className={cn(
                "flex cursor-pointer flex-col gap-4 p-4 transition-colors hover:bg-muted/40 md:grid md:grid-cols-[minmax(0,2fr)_120px_100px_100px_80px_120px] md:items-center md:gap-4 md:px-6 md:py-5",
                isHighlighted && "bg-primary/5"
              )}
            >
              <div className="flex gap-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24">
                  <Image
                    src={toImageSrc(item.imageUrl)}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{item.hub}</p>
                  <h3 className="mt-0.5 text-base font-semibold text-foreground">
                    {item.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-2">
                    <StarRating rating={item.rating} />
                  </div>
                </div>
              </div>

              <div className="md:contents">
                <div>
                  {item.isPopular ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-primary">
                      <Icons.flame size={16} />
                      Popularity
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
                <p className="text-sm font-medium text-foreground md:text-center">
                  {item.itemsSold}
                </p>
                <p className="text-sm font-medium text-primary md:text-center">
                  {item.reviewCount} Review
                </p>
                <p className="text-sm font-medium text-destructive md:text-center">
                  {item.itemErrors}
                </p>
                <div className="md:flex md:justify-end">
                  <button
                    type="button"
                    data-menu-row-action
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-primary/10 px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
                    onClick={(e) => {
                      e.stopPropagation()
                      openDetails()
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
