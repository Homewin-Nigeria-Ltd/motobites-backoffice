"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ApiNotification } from "@/features/notification/types"
import {
  getNotificationDisplay,
  getNotificationInitials,
} from "@/features/notification/utils/notification-card"

export function NotificationCard({
  item,
  onNavigate,
}: {
  item: ApiNotification
  onNavigate?: () => void
}) {
  const router = useRouter()
  const display = getNotificationDisplay(item)

  const handleActionClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault()
    onNavigate?.()
    router.push(display.href)
  }

  return (
    <article className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <Badge
          variant="secondary"
          className="h-auto max-w-[calc(100%-5rem)] truncate px-2.5 py-1 text-xs font-semibold uppercase tracking-wide"
        >
          {display.label}
        </Badge>
        <time className="shrink-0 text-xs leading-snug text-muted-foreground">
          {item.formatted_at}
        </time>
      </div>

      <div className="flex min-w-0 gap-3">
        <div
          className={cn(
            "w-1 shrink-0 rounded-full",
            display.accent === "primary"
              ? "bg-primary"
              : "bg-muted-foreground/40"
          )}
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 gap-3 py-1">
          <Avatar className="size-10 shrink-0">
            <AvatarFallback className="text-xs font-medium text-muted-foreground">
              {getNotificationInitials(display.label)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="text-sm leading-relaxed text-muted-foreground wrap-break-word">
              {item.message}
            </p>
            <Link
              href={display.href}
              onClick={handleActionClick}
              className="w-fit text-sm font-medium text-primary hover:underline"
            >
              {display.actionLabel}
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
