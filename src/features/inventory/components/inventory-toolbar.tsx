"use client"

import { Button } from "@/components/ui/button"

type InventoryToolbarProps = {
  onAddItem: () => void
}

export function InventoryToolbar({ onAddItem }: InventoryToolbarProps) {
  return (
    <div className="flex justify-end">
      <Button
        type="button"
        className="h-11 shrink-0 px-5"
        icon={{ name: "add", position: "left" }}
        onClick={onAddItem}
      >
        Add New Item
      </Button>
    </div>
  )
}
