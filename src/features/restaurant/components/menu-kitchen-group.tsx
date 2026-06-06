"use client"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Icons } from "@/components/ui/icons"
import { MenuCardGrid } from "@/features/restaurant/components/menu-card-grid"
import { MenuCardList } from "@/features/restaurant/components/menu-card-list"
import type { ApiMenuGroupedItem } from "@/features/restaurant/types"
import { mapApiMenuItemToMenu } from "@/features/restaurant/utils/menu-item"

type MenuKitchenGroupProps = {
  group: ApiMenuGroupedItem
  itemCount: number
  view: "grid" | "list"
  onEditItem?: (menuId: string) => void
}

export function MenuKitchenGroup({
  group,
  itemCount,
  view,
  onEditItem,
}: MenuKitchenGroupProps) {
  const kitchenName = group.kitchen?.name ?? "Kitchen"
  const kitchenId = String(group.kitchen.id)

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <div className="flex w-full items-center gap-2 py-1">
        <CollapsibleTrigger className="flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-muted">
          <Icons.chevronDown
            size={20}
            className="text-muted-foreground transition-transform group-data-[state=closed]/collapsible:-rotate-90"
          />
        </CollapsibleTrigger>

        <span className="text-base font-semibold text-foreground">
          {kitchenName}
        </span>
        <span className="text-sm text-muted-foreground">({itemCount} items)</span>
      </div>

      <CollapsibleContent className="pt-4">
        {view === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {group.items.map((item) => (
              <MenuCardGrid
                key={item.id}
                menu={mapApiMenuItemToMenu(item)}
                hubId={kitchenId}
                onEditItem={onEditItem}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {group.items.map((item) => (
              <MenuCardList
                key={item.id}
                menu={mapApiMenuItemToMenu(item)}
                hubId={kitchenId}
                onEditItem={onEditItem}
              />
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
