"use client"

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

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-border p-4 sm:p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch">
          <div className="relative mx-auto size-44 shrink-0 overflow-hidden rounded-xl bg-muted sm:mx-0">
            <Image
              src={toImageSrc(menu.imageUrl)}
              alt={menu.name}
              fill
              className="object-cover"
              sizes="176px"
            />
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
