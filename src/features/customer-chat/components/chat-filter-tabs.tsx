"use client"

import type { CustomerChatFilter } from "../types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tabLabels: Record<CustomerChatFilter, string> = {
  all: "All Chats",
  unread: "Unread",
  closed: "Closed",
}

type ChatFilterTabsProps = {
  value: CustomerChatFilter
  onChange: (value: CustomerChatFilter) => void
}

export function ChatFilterTabs({ value, onChange }: ChatFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Chat filters"
    >
      {(Object.keys(tabLabels) as CustomerChatFilter[]).map((tab) => {
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
