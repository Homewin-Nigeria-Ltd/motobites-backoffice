"use client"

import type { ApiOrderAssignee } from "@/features/order/types"
import { getInitials } from "@/utils/get-initials"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const actionLink =
  "h-auto p-0 text-sm font-medium text-primary underline-offset-4 hover:underline"

type OrderAssigneeFieldProps = {
  assignee: ApiOrderAssignee
  changeLabel: string
  assignLabel: string
  onChangeClick: () => void
  className?: string
}

export function OrderAssigneeField({
  assignee,
  changeLabel,
  assignLabel,
  onChangeClick,
  className,
}: OrderAssigneeFieldProps) {
  if (!assignee) {
    return (
      <Button
        type="button"
        variant="link"
        className={cn(actionLink, className)}
        onClick={onChangeClick}
      >
        {assignLabel}
      </Button>
    )
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">
          {getInitials(assignee.name)}
        </AvatarFallback>
      </Avatar>
      <span className="font-medium">{assignee.name}</span>
      <Button type="button" variant="link" className={actionLink} onClick={onChangeClick}>
        {changeLabel}
      </Button>
    </div>
  )
}
