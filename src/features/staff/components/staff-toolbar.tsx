"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type StaffToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  onInviteClick: () => void
}

export function StaffToolbar({
  search,
  onSearchChange,
  onInviteClick,
}: StaffToolbarProps) {
  return (
    <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-xl flex-1">
        <Input
          type="search"
          icon={{ name: "search", position: "left" }}
          placeholder="Search for Users"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" icon={{ name: "download", position: "left" }}>
          Export CSV
        </Button>
        <Button
          type="button"
          icon={{ name: "userPlus", position: "left" }}
          onClick={onInviteClick}
        >
          Invite Member
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="border-primary text-primary"
          icon={{ name: "filter", position: "left" }}
          aria-label="Filter staff"
        />
      </div>
    </div>
  )
}
