"use client"

import type { FulfillmentBranch } from "@/features/restaurant/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

type BranchCardProps = {
  branch: FulfillmentBranch
}

function StatusBadge({
  active,
  label,
}: {
  active: boolean
  label: string
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-full border-0 px-2.5 py-0.5 text-xs font-medium",
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-muted text-muted-foreground"
      )}
    >
      {label}
    </Badge>
  )
}

export function BranchCard({ branch }: BranchCardProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              {branch.name}
            </h3>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {branch.key}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            <StatusBadge active={branch.isActive} label="Active" />
            <StatusBadge
              active={branch.isOpen}
              label={branch.isOpen ? "Open" : "Closed"}
            />
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Icons.mapPin size={16} className="mt-0.5 shrink-0 text-primary" />
          <p className="leading-relaxed">{branch.address}</p>
        </div>

        <p className="text-xs text-muted-foreground">
          {branch.latitude.toFixed(6)}, {branch.longitude.toFixed(6)}
        </p>
      </CardContent>
    </Card>
  )
}
