"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { NotificationFilter } from "@/features/notification/types"

type NotificationFilterTabsProps = {
  value: NotificationFilter
  onChange: (value: NotificationFilter) => void
  unreadCount: number
}

export function NotificationFilterTabs({
  value,
  onChange,
  unreadCount,
}: NotificationFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2 sm:gap-4"
      role="tablist"
      aria-label="Notification filters"
    >
      <Button
        type="button"
        role="tab"
        aria-selected={value === "all"}
        variant={value === "all" ? "secondary" : "ghost"}
        className={cn(
          "h-auto rounded-md px-4 py-2 text-sm font-medium sm:px-6",
          value === "all"
            ? "text-primary hover:bg-secondary"
            : "text-muted-foreground hover:bg-transparent hover:text-foreground"
        )}
        onClick={() => onChange("all")}
      >
        All
      </Button>
      <Button
        type="button"
        role="tab"
        aria-selected={value === "unread"}
        variant={value === "unread" ? "secondary" : "ghost"}
        className={cn(
          "h-auto rounded-md px-4 py-2 text-sm font-medium sm:px-6",
          value === "unread"
            ? "text-primary hover:bg-secondary"
            : "text-muted-foreground hover:bg-transparent hover:text-foreground"
        )}
        onClick={() => onChange("unread")}
      >
        Unread
        {unreadCount > 0 ? ` (${unreadCount})` : ""}
      </Button>
    </div>
  )
}
