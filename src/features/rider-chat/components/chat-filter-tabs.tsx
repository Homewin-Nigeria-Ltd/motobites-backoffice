"use client"

import type { RiderChatFilter } from "../types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tabLabels: Record<RiderChatFilter, string> = {
  all: "All Chats",
  unread: "Unread",
  closed: "Closed",
}

type ChatFilterTabsProps = {
  value: RiderChatFilter
  onChange: (value: RiderChatFilter) => void
}

export function ChatFilterTabs({ value, onChange }: ChatFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Chat filters"
    >
      {(Object.keys(tabLabels) as RiderChatFilter[]).map((tab) => {
        const isActive = value === tab

        return (
          <Button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "h-auto rounded-lg px-4 py-2 text-sm font-medium",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:bg-transparent hover:text-foreground"
            )}
            onClick={() => onChange(tab)}
          >
            {tabLabels[tab]}
          </Button>
        )
      })}
    </div>
  )
}
