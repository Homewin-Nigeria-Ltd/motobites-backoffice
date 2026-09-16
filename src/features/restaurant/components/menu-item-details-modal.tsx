"use client"

import { useState } from "react"
import Image from "next/image"
import { BaseModal } from "@/components/ui/base-modal"
import { AppLoader } from "@/components/ui/app-loader"
import { Icons } from "@/components/ui/icons"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  useFulfillmentBranches,
  useMenuItemDetail,
} from "@/features/restaurant/hooks/use-restaurant-queries"
import { useToggleMenuItemAvailability } from "@/features/restaurant/hooks/use-restaurant-mutations"
import { mapApiMenuItemToMenu } from "@/features/restaurant/utils/menu-item"
import { getMenuItemBranchAvailability } from "@/features/restaurant/utils/menu-item-branch-availability"
import type { ApiMenuItemDetail, Menu } from "@/features/restaurant/types"
import { toImageSrc } from "@/lib/image-url"
import { cn } from "@/lib/utils"

type MenuItemDetailsModalProps = {
  menuItemId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditItem?: (menuId: string) => void
}

function MenuBranchAvailabilitySection({ item }: { item: ApiMenuItemDetail }) {
  const { data: branches = [], isPending: branchesLoading } =
    useFulfillmentBranches()
  const { toggleAvailability, isPending, pendingBranchKey } =
    useToggleMenuItemAvailability()

  const activeBranches = branches.filter((branch) => branch.isActive)

  if (branchesLoading) {
    return <AppLoader className="min-h-24" />
  }

  if (activeBranches.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No active branches found.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {activeBranches.map((branch) => {
        const branchKey = `${item.id}:${branch.id}`
        const isAvailable = getMenuItemBranchAvailability(item, branch.id)
        const isToggling = isPending && pendingBranchKey === branchKey

        return (
          <div
            key={branch.id}
            className={cn(
              "flex items-center justify-between gap-3 rounded-xl border px-4 py-3",
              isAvailable
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-border bg-muted/30"
            )}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {branch.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {branch.address}
              </p>
            </div>
            <Switch
              checked={isAvailable}
              disabled={isToggling}
              aria-label={
                isAvailable
                  ? `Make ${item.name} unavailable at ${branch.name}`
                  : `Make ${item.name} available at ${branch.name}`
              }
              onCheckedChange={(checked) => {
                toggleAvailability({
                  itemId: item.id,
                  is_available: checked,
                  fulfillment_branch_id: Number(branch.id),
                })
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

function MenuItemDetailsContent({
  item,
  menu,
  onOpenChange,
  onEditItem,
}: {
  item: ApiMenuItemDetail
  menu: Menu
  onOpenChange: (open: boolean) => void
  onEditItem?: (menuId: string) => void
}) {
  const { toggleAvailability, isPending, pendingItemId } =
    useToggleMenuItemAvailability()
  const isTogglingAvailability = isPending && pendingItemId === menu.id

  const handleEditItem = () => {
    onOpenChange(false)
    onEditItem?.(menu.id)
  }

  const handleAvailabilityChange = (isAvailable: boolean) => {
    toggleAvailability({
      itemId: menu.id,
      is_available: isAvailable,
      unavailable_today: isAvailable ? false : true,
    })
  }

  const images = (
    Array.isArray(item.images) && item.images.length > 0 ? item.images : []
  ).filter((img) => Boolean(img?.image_url || img?.image_path))

  const [selectedImgIndex, setSelectedImgIndex] = useState(0)
  const activeImageUrl =
    images[selectedImgIndex]?.image_url ||
    images[selectedImgIndex]?.image_path ||
    menu.imageUrl

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-border p-4 sm:p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <div className="relative mx-auto size-44 shrink-0 overflow-hidden rounded-xl bg-muted sm:mx-0">
              <Image
                src={toImageSrc(activeImageUrl)}
                alt={menu.name}
                fill
                className="object-cover"
                sizes="176px"
              />
            </div>
            {images.length > 1 ? (
              <div className="flex max-w-44 gap-1.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img.id ?? idx}
                    type="button"
                    onClick={() => setSelectedImgIndex(idx)}
                    className={cn(
                      "relative size-10 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                      selectedImgIndex === idx
                        ? "border-primary ring-1 ring-primary"
                        : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={toImageSrc(img.image_url || img.image_path)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                {menu.name}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {menu.description}
              </p>

              {menu.isPopular ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-primary">
                  <Icons.flame size={16} />
                  Popularity
                </span>
              ) : null}
            </div>

            <Separator className="my-4" />

            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                Meal Price:{" "}
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

            {onEditItem ? (
              <div className="mt-auto flex justify-end pt-4">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  onClick={handleEditItem}
                >
                  Edit item
                  <Icons.arrowForward size={16} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div
          className={cn(
            "flex gap-3 rounded-xl px-4 py-4",
            menu.enabled
              ? "bg-emerald-500/10"
              : "border border-border bg-muted"
          )}
        >
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              menu.enabled
                ? "bg-emerald-500 text-white"
                : "bg-muted-foreground text-background"
            )}
          >
            <Icons.check size={18} />
          </div>
          <div className="min-w-0">
            <p
              className={cn(
                "text-sm font-semibold",
                menu.enabled ? "text-emerald-700" : "text-foreground"
              )}
            >
              {menu.enabled ? "Available" : "Unavailable"}
            </p>
            <p className="text-sm text-muted-foreground">
              {menu.enabled
                ? "This meal is available for customer view, order and purchase."
                : "This meal is currently hidden from customers."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary px-4 py-4">
          <span className="text-sm font-medium text-primary">
            {menu.enabled ? "Make Unavailable for today" : "Make available"}
          </span>
          <Switch
            checked={menu.enabled}
            disabled={isTogglingAvailability}
            aria-label={
              menu.enabled
                ? `Make ${menu.name} unavailable for today`
                : `Make ${menu.name} available`
            }
            onCheckedChange={handleAvailabilityChange}
          />
        </div>
      </div>

      {Array.isArray(item.videos) && item.videos.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Icons.video size={16} className="text-primary" />
            <h4 className="text-sm font-semibold text-foreground">
              Menu Videos ({item.videos.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {item.videos.map((vid, idx) => {
              const isReady = vid.video_status === "READY" && Boolean(vid.video_url);
              const isFailed = vid.video_status === "FAILED";

              return (
                <div
                  key={vid.id ?? idx}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <span
                      className="truncate text-xs font-medium text-foreground"
                      title={vid.title ?? undefined}
                    >
                      {vid.title || `Video ${idx + 1}`}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        isReady
                          ? "bg-emerald-500/10 text-emerald-600"
                          : isFailed
                            ? "bg-destructive/10 text-destructive"
                            : "bg-amber-500/10 text-amber-600"
                      )}
                    >
                      {vid.video_status || "PROCESSING"}
                    </span>
                  </div>

                  {isReady && vid.video_url ? (
                    <video
                      src={vid.video_url}
                      controls
                      preload="metadata"
                      className="aspect-video w-full rounded-lg bg-black object-contain"
                    />
                  ) : isFailed ? (
                    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg bg-destructive/5 p-3 text-center">
                      <Icons.alertCircle size={20} className="mb-1 text-destructive" />
                      <p className="text-xs font-medium text-destructive">
                        Transcoding Failed
                      </p>
                      {vid.failure_reason && (
                        <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                          {vid.failure_reason}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg bg-muted/40 p-3 text-center">
                      <Icons.loader className="mb-2 size-5 animate-spin text-primary" />
                      <p className="text-xs font-medium text-foreground">
                        Video Processing...
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        HLS streaming will be ready once transcoding completes.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            Branch availability
          </h4>
          <p className="text-sm text-muted-foreground">
            Control whether this meal is available at each branch.
          </p>
        </div>
        <MenuBranchAvailabilitySection item={item} />
      </section>
    </div>
  )
}

export function MenuItemDetailsModal({
  menuItemId,
  open,
  onOpenChange,
  onEditItem,
}: MenuItemDetailsModalProps) {
  const {
    data: item,
    isPending,
    isError,
    error,
  } = useMenuItemDetail(menuItemId ?? undefined, {
    enabled: open && Boolean(menuItemId),
  })

  if (!open || !menuItemId) {
    return null
  }

  if (isError) {
    throw error
  }

  const modalProps = {
    title: "Meal Details",
    open,
    onOpenChange,
    layout: "detail" as const,
    size: "lg" as const,
    className: "max-w-2xl",
    bodyClassName: "font-ui",
  }

  if (isPending || !item) {
    return (
      <BaseModal {...modalProps}>
        <AppLoader className="min-h-64" />
      </BaseModal>
    )
  }

  const menu = mapApiMenuItemToMenu(item)

  return (
    <BaseModal {...modalProps}>
      <MenuItemDetailsContent
        item={item}
        menu={menu}
        onOpenChange={onOpenChange}
        onEditItem={onEditItem}
      />
    </BaseModal>
  )
}
