"use client"

import Link from "next/link"

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
}

export function MenuCardActions({ menu, detailHref }: MenuCardActionsProps) {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <Link
        href={detailHref}
        data-menu-card-action
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        Edit item
        <Icons.arrowForward size={16} />
      </Link>
      <div data-menu-card-action className="flex items-center gap-2">
        <DropdownMenu>
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
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={detailHref}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              Delete item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Switch
          checked={menu.enabled}
          disabled
          aria-label={`Toggle ${menu.name}`}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  )
}
