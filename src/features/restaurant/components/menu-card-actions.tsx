"use client"

import Link from "next/link"
import { useState } from "react"

import { useToggleMenuItemAvailability } from "@/features/restaurant/hooks/use-restaurant-mutations"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import type { Menu } from "@/features/restaurant/types"

type MenuCardActionsProps = {
  menu: Menu
  detailHref: string
  onEditItem?: (menuId: string) => void
  onViewDetails?: () => void
  onDeleteRequest?: () => void
  suppressNextCardClick?: () => void
  isDeletingItem?: boolean
}

export function MenuCardActions({
  menu,
  detailHref,
  onEditItem,
  onViewDetails,
  onDeleteRequest,
  suppressNextCardClick,
  isDeletingItem = false,
}: MenuCardActionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { toggleAvailability, isPending, pendingItemId } =
    useToggleMenuItemAvailability()
  const isToggling = isPending && pendingItemId === menu.id

  const handleAvailabilityChange = (checked: boolean) => {
    toggleAvailability({
      itemId: menu.id,
      is_available: checked,
    })
  }

  const runDropdownAction = (action: () => void) => {
    suppressNextCardClick?.()
    setDropdownOpen(false)
    window.setTimeout(action, 0)
  }

  return (
    <div className="flex w-full items-center justify-between gap-2">
      {onEditItem ? (
        <button
          type="button"
          data-menu-card-action
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          onClick={(e) => {
            e.stopPropagation()
            onEditItem(menu.id)
          }}
        >
          Edit item
          <Icons.arrowForward size={16} />
        </button>
      ) : (
        <Link
          href={detailHref}
          data-menu-card-action
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Edit item
          <Icons.arrowForward size={16} />
        </Link>
      )}
      <div data-menu-card-action className="flex items-center gap-2">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              aria-label="More options"
              onClick={(e) => e.stopPropagation()}
            >
              <Icons.moreHorizontal size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onPointerDown={(e) => e.preventDefault()}
              onClick={(e) => e.stopPropagation()}
              onSelect={(e) => {
                e.preventDefault()
                runDropdownAction(() => onViewDetails?.())
              }}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              disabled={isDeletingItem}
              onPointerDown={(e) => e.preventDefault()}
              onClick={(e) => e.stopPropagation()}
              onSelect={(e) => {
                e.preventDefault()
                runDropdownAction(() => onDeleteRequest?.())
              }}
            >
              Delete item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Switch
          checked={menu.enabled}
          disabled={isToggling}
          aria-label={`Toggle ${menu.name}`}
          onCheckedChange={handleAvailabilityChange}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  )
}
