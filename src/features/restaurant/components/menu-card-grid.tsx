"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MenuCardActions } from "@/features/restaurant/components/menu-card-actions"
import { buildMenuItemHref } from "@/features/restaurant"
import type { Menu } from "@/features/restaurant/types"

type MenuCardGridProps = {
  menu: Menu
  hubId: string
}

export function MenuCardGrid({ menu, hubId }: MenuCardGridProps) {
  const router = useRouter()
  const detailHref = buildMenuItemHref(menu.id, hubId)

  const goToDetail = () => router.push(detailHref)

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    if (target.closest("[data-menu-card-action]")) return
    goToDetail()
  }

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      goToDetail()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className="group/card relative min-w-0 cursor-pointer rounded-2xl transition-shadow duration-200 ease-out hover:z-10 hover:shadow-soft focus-visible:outline-none"
    >
      <Card className="gap-0 overflow-hidden py-0">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-t-2xl bg-muted">
          <Image
            src={menu.imageUrl}
            alt={menu.name}
            fill
            className="object-cover transition-transform duration-200 group-hover/card:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5 px-5 pt-4">
          <h3
            className="truncate text-base font-semibold text-foreground"
            title={menu.name}
          >
            {menu.name}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {menu.description}
          </p>
        </div>
        <Separator className="mx-5 my-3" />
        <div className="space-y-0.5 px-5 text-sm text-muted-foreground">
          <p>
            Menu Price:{" "}
            <span className="font-medium text-foreground">
              ₦{menu.price.toLocaleString()}
            </span>
          </p>
          <p>
            Duration:{" "}
            <span className="font-medium text-foreground">
              {menu.durationMinutes} minutes
            </span>
          </p>
        </div>
        <div className="mt-4 px-5 py-4">
          <MenuCardActions menu={menu} detailHref={detailHref} />
        </div>
      </Card>
    </div>
  )
}
