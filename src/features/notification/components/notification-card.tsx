"use client"

import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ApiNotification } from "@/features/notification/types"
import {
  getNotificationActionHref,
  getNotificationInitials,
} from "@/features/notification/utils/notification-card"

export function NotificationCard({ item }: { item: ApiNotification }) {
  return (
    <article className="space-y-3">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <Badge
          variant="secondary"
          className="h-auto w-fit max-w-full truncate px-2.5 py-1 text-xs font-semibold uppercase tracking-wide"
        >
          {item.category_label}
        </Badge>
        <time className="text-xs leading-snug text-muted-foreground sm:shrink-0 sm:text-right">
          {item.formatted_at}
        </time>
      </div>

      <div className="flex min-w-0">
        <div
          className={cn(
            "w-1 shrink-0 rounded-full",
            item.category.includes("order") ? "bg-primary" : "bg-muted-foreground/40"
          )}
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 flex-col gap-3 py-3 pl-3 sm:flex-row sm:items-start sm:gap-3 sm:py-4 sm:pl-4">
          <Avatar className="size-10 shrink-0">
            <AvatarFallback className="text-xs font-medium text-muted-foreground">
              {getNotificationInitials(item.category_label)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground wrap-break-word">
              {item.message}
            </p>
            <Link
              href={getNotificationActionHref(item.action.target)}
              className="w-fit shrink-0 text-sm font-medium text-primary hover:underline sm:max-w-[11rem] sm:text-right"
            >
              {item.action.label}
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
