"use client"

import { useRef, useState } from "react"
import Image from "next/image"

import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MenuCardActions } from "@/features/restaurant/components/menu-card-actions"
import { useDeleteMenuItem } from "@/features/restaurant/hooks/use-restaurant-mutations"
import { MenuItemDetailsModal } from "@/features/restaurant/components/menu-item-details-modal"
import { buildMenuItemHref } from "@/features/restaurant"
import type { Menu } from "@/features/restaurant/types"
import { toImageSrc } from "@/lib/image-url"

type MenuCardGridProps = {
  menu: Menu
  hubId: string
  onEditItem?: (menuId: string) => void
}

export function MenuCardGrid({ menu, hubId, onEditItem }: MenuCardGridProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const ignoreNextCardClickRef = useRef(false)
  const detailHref = buildMenuItemHref(menu.id, hubId)
  const {
    deleteMenuItem,
    isPending: isDeleting,
    pendingItemId: deletingItemId,
  } = useDeleteMenuItem()
  const isDeletingItem = isDeleting && deletingItemId === menu.id

  const openDetails = () => setDetailsOpen(true)
  const openDelete = () => setDeleteOpen(true)

  const suppressNextCardClick = () => {
    ignoreNextCardClickRef.current = true
  }

  const handleDetailsOpenChange = (open: boolean) => {
    if (!open) {
      ignoreNextCardClickRef.current = true
    }
    setDetailsOpen(open)
  }

  const handleDeleteOpenChange = (open: boolean) => {
    if (!open) {
      ignoreNextCardClickRef.current = true
    }
    setDeleteOpen(open)
  }

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    if (detailsOpen || deleteOpen) return

    if (ignoreNextCardClickRef.current) {
      ignoreNextCardClickRef.current = false
      return
    }

    const target = e.target as HTMLElement
    if (target.closest("[data-menu-card-action]")) return
    openDetails()
  }

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (detailsOpen || deleteOpen) return

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      openDetails()
    }
  }

  return (
    <>
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
              src={toImageSrc(menu.imageUrl)}
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
            <MenuCardActions
              menu={menu}
              detailHref={detailHref}
              onEditItem={onEditItem}
              onViewDetails={openDetails}
              onDeleteRequest={openDelete}
              suppressNextCardClick={suppressNextCardClick}
              isDeletingItem={isDeletingItem}
            />
          </div>
        </Card>
      </div>

      <MenuItemDetailsModal
        menuItemId={menu.id}
        open={detailsOpen}
        onOpenChange={handleDetailsOpenChange}
        onEditItem={onEditItem}
      />
      <BaseAlertDialog
        title="Delete menu item?"
        open={deleteOpen}
        onOpenChange={handleDeleteOpenChange}
        confirmLabel="Delete"
        pendingLabel="Deleting..."
        confirmVariant="destructive"
        isPending={isDeletingItem}
        onConfirm={() => {
          void deleteMenuItem(menu.id)
        }}
      >
        This will permanently delete &quot;{menu.name}&quot;. This action cannot
        be undone.
      </BaseAlertDialog>
    </>
  )
}
