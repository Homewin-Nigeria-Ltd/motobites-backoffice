"use client"

import { Icons } from "@/components/ui/icons"
import { MenuCardGrid } from "@/features/restaurant/components/menu-card-grid"
import { MenuCardList } from "@/features/restaurant/components/menu-card-list"
import type { Hub } from "@/features/restaurant/types"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type CatalogHubSectionProps = {
  hub: Hub
  view: "grid" | "list"
}

export function CatalogHubSection({ hub, view }: CatalogHubSectionProps) {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <div className="flex w-full items-center gap-2 py-1">
        <CollapsibleTrigger className="flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-muted">
          <Icons.chevronDown
            size={20}
            className="text-muted-foreground transition-transform group-data-[state=closed]/collapsible:-rotate-90"
          />
        </CollapsibleTrigger>
        <span className="text-base font-semibold text-foreground">{hub.name}</span>
        <span className="text-sm text-muted-foreground">
          {hub.menus.length} Menus
        </span>
      </div>
      <CollapsibleContent className="pt-4">
        {view === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hub.menus.map((menu) => (
              <MenuCardGrid key={menu.id} menu={menu} hubId={hub.id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {hub.menus.map((menu) => (
              <MenuCardList key={menu.id} menu={menu} hubId={hub.id} />
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
