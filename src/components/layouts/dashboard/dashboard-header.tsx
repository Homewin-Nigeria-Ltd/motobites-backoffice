"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  NotificationsPanel,
  NotificationBellTrigger,
} from "@/features/notification"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { AuthUser } from "@/features/auth"
import { BranchSelector } from "@/components/layouts/dashboard/branch-selector"
import { getUserInitials } from "@/utils/get-initials"

export function DashboardHeader({ user }: { user: AuthUser }) {
  const userName = user.name
  const userInitials = getUserInitials(userName)

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex min-w-0 flex-1 items-center gap-2 px-3 sm:px-4">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mr-2 hidden data-vertical:h-4 data-vertical:self-auto sm:block"
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="truncate text-sm font-semibold leading-tight sm:text-base">
            Motobite Admin Dashboard
          </h1>
          <p className="hidden truncate text-sm text-muted-foreground sm:block">
            Welcome back, {userName}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <BranchSelector />
        <NotificationsPanel trigger={<NotificationBellTrigger iconSize={24} />} />
        <Avatar className="size-9">
          <AvatarImage src={user.profile_photo_url ?? undefined} alt={userName} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
