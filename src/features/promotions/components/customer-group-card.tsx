"use client"

import type { CustomerGroup } from "@/features/promotions/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

type CustomerGroupCardProps = {
  group: CustomerGroup
  onEdit: (group: CustomerGroup) => void
}

export function CustomerGroupCard({ group, onEdit }: CustomerGroupCardProps) {
  return (
    <Card className="gap-0 py-0 transition-shadow duration-200 hover:shadow-soft">
      <div className="flex items-start gap-4 px-5 py-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
          <Icons.group size={22} className="text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-foreground">
            {group.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-primary">
            {group.membersCount.toLocaleString("en-US")}{" "}
            {group.membersCount === 1 ? "customer" : "customers"}
          </p>
          {group.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {group.description}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">No description</p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label={`Edit ${group.name}`}
          onClick={() => onEdit(group)}
        >
          <Icons.edit size={18} />
        </Button>
      </div>
    </Card>
  )
}
