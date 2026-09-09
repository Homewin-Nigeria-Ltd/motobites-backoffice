"use client"

import { Input } from "@/components/ui/input"

type OfflineOrderSearchToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  placeholder?: string
}

export function OfflineOrderSearchToolbar({
  search,
  onSearchChange,
  placeholder = "Search...",
}: OfflineOrderSearchToolbarProps) {
  return (
    <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-xl flex-1">
        <Input
          type="search"
          icon={{ name: "search", position: "left" }}
          placeholder={placeholder}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-10"
        />
      </div>
    </div>
  )
}
