"use client"

import Link from "next/link"

import type { ApiRider } from "../types"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

type RiderRowActionsProps = {
  rider: ApiRider
}

export function RiderRowActions({ rider }: RiderRowActionsProps) {
  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        asChild
      >
        <Link
          href={`/riders/chat?riderId=${rider.id}`}
          aria-label={`Chat with ${rider.name}`}
        >
          <Icons.messageCircle size={16} />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        asChild
      >
        <Link
          href={`/riders/${rider.id}/edit`}
          aria-label={`Edit ${rider.name}`}
        >
          <Icons.edit size={16} />
        </Link>
      </Button>
      {/* <Button
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
      /> */}
    </div>
  )
}
