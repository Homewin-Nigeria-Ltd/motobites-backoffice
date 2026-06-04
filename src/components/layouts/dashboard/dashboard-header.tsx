"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { NotificationsPanel } from "@/features/notification"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Icons } from "@/components/ui/icons"
import type { AuthUser } from "@/features/auth"
import { getUserInitials } from "@/utils/get-initials"

export function DashboardHeader({ user }: { user: AuthUser }) {
  const userName = user.name
  const userAvatar = "/avatars/shadcn.jpg"
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
      <div className="flex shrink-0 items-center gap-1 px-3 sm:gap-2 sm:px-4">
        <NotificationsPanel
          trigger={
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Icons.notifications size={24} />
            </Button>
          }
        />
        <Avatar className="size-9">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
