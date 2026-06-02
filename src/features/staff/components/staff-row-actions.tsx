"use client"

import type { StaffMember } from "@/features/staff/types"
import { Button } from "@/components/ui/button"

type StaffRowActionsProps = {
  member: StaffMember
}

export function StaffRowActions({ member }: StaffRowActionsProps) {
  return (
    <div className="flex items-center gap-0.5">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        aria-label={`Edit ${member.name}`}
        icon={{ name: "edit", position: "left" }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        aria-label={`Delete ${member.name}`}
        icon={{ name: "trash", position: "left" }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        aria-label={`Favorite ${member.name}`}
        icon={{ name: "heart", position: "left" }}
      />
    </div>
  )
}
