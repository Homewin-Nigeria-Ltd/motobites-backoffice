"use client"

import { OrderCard } from "@/features/order/components/order-card"
import type { ApiOrder, ApiOrderGroup } from "@/features/order/types"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Icons } from "@/components/ui/icons"

type OrderHubSectionProps = {
  group: ApiOrderGroup
  onViewDetails: (order: ApiOrder) => void
}

export function OrderHubSection({ group, onViewDetails }: OrderHubSectionProps) {
  const hubName = group.kitchen?.name ?? "Unassigned kitchen"

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <div className="flex w-full items-center gap-2 py-1">
        <CollapsibleTrigger className="flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-muted">
          <Icons.chevronDown
            size={20}
            className="text-muted-foreground transition-transform group-data-[state=closed]/collapsible:-rotate-90"
          />
        </CollapsibleTrigger>
        <span className="text-base font-semibold text-foreground">{hubName}</span>
        <span className="text-sm text-muted-foreground">
          ({group.order_count} orders)
        </span>
      </div>
      <CollapsibleContent className="pt-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {group.orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
