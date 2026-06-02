"use client"

import * as React from "react"

import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { SlideInModal } from "@/components/ui/slide-in-modal"
import { PaginationControls } from "@/components/pagination-controls"
import { NotificationCard } from "@/features/notification/components/notification-card"
import { NotificationFilterTabs } from "@/features/notification/components/notification-filter-tabs"
import { useNotifications } from "@/features/notification/hooks/use-notifications"
import type { NotificationFilter } from "@/features/notification/types"
import { Icons } from "@/components/ui/icons"

const PER_PAGE = 20

export function NotificationsPanel({
  trigger,
}: {
  trigger: React.ReactNode
}) {
  const [tab, setTab] = React.useState<NotificationFilter>("all")
  const [page, setPage] = React.useState(1)

  const handleTabChange = React.useCallback((value: NotificationFilter) => {
    setTab(value)
    setPage(1)
  }, [])

  const { data, isPending, isError } = useNotifications({
    filter: tab,
    page,
    per_page: PER_PAGE,
  })

  const items = data?.data ?? []
  const meta = data?.meta
  const unreadCount = meta?.unread_count ?? 0

  return (
    <SlideInModal
      title="Notifications"
      panel="standard"
      trigger={trigger}
      closeLabel="Close notifications"
      toolbar={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <NotificationFilterTabs
            value={tab}
            onChange={handleTabChange}
            unreadCount={unreadCount}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 self-end text-muted-foreground sm:self-auto"
                aria-label="Notification options"
              >
                <Icons.moreHorizontal size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark all as read</DropdownMenuItem>
              <DropdownMenuItem>Notification settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    >
      {isPending && !data ? (
        <div className="flex justify-center py-16">
          <AppLoader />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm font-medium text-foreground">
            Could not load notifications
          </p>
          <p className="text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 ? <Separator className="my-4 sm:my-6" /> : null}
                <NotificationCard item={item} />
              </React.Fragment>
            ))}

            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <p className="text-sm font-medium text-foreground">
                  {tab === "unread"
                    ? "You're all caught up"
                    : "No notifications yet"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tab === "unread"
                    ? "No unread notifications right now."
                    : "Notifications will appear here when something happens."}
                </p>
              </div>
            )}
          </div>

          {meta && meta.last_page > 1 ? (
            <div className="mt-6 border-t pt-6">
              <PaginationControls
                page={meta.current_page}
                totalPages={meta.last_page}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </>
      )}
    </SlideInModal>
  )
}
