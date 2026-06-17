"use client"

import type { ApiRider } from "../types"
import { Button } from "@/components/ui/button"

type RiderRowActionsProps = {
  rider: ApiRider
}

export function RiderRowActions({ rider }: RiderRowActionsProps) {
  return (
    <div className="flex items-center gap-0.5">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        aria-label={`Edit ${rider.name}`}
        icon={{ name: "edit", position: "left" }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        aria-label={`Delete ${rider.name}`}
        icon={{ name: "trash", position: "left" }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        aria-label={`Favorite ${rider.name}`}
        icon={{ name: "heart", position: "left" }}
      />
    </div>
  )
}
