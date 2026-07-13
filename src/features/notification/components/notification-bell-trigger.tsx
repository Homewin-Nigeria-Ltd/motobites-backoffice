"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { useUnreadNotificationCount } from "@/features/notification/hooks/use-unread-notification-count"

type NotificationBellTriggerProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "children"
> & {
  iconSize?: number
}

export const NotificationBellTrigger = React.forwardRef<
  HTMLButtonElement,
  NotificationBellTriggerProps
>(function NotificationBellTrigger(
  { iconSize = 24, className, "aria-label": ariaLabel, ...props },
  ref,
) {
  const { data: unreadCount = 0 } = useUnreadNotificationCount()

  return (
    <Button
      ref={ref}
      type="button"
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      aria-label={
        ariaLabel ??
        (unreadCount > 0
          ? `Notifications, ${unreadCount} unread`
          : "Notifications")
      }
      {...props}
    >
      <Icons.notifications size={iconSize} />
      {unreadCount > 0 ? (
        <span
          className="pointer-events-none absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground"
          aria-hidden
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}
    </Button>
  )
})
