"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

type RoleDetailHeaderProps = {
  name: string
  description: string
  onEdit?: () => void
  onDelete?: () => void
}

export function RoleDetailHeader({
  name,
  description,
  onEdit,
  onDelete,
}: RoleDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {name}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-10"
          onClick={onEdit}
          aria-label="Edit role"
        >
          <Icons.edit size={18} />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-10"
          onClick={onDelete}
          aria-label="Delete role"
        >
          <Icons.trash size={18} />
        </Button>
      </div>
    </div>
  )
}
