"use client"

import { useState } from "react"
import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NotificationsPanel,
  NotificationBellTrigger,
} from "@/features/notification"
import { LogoutConfirmDialog } from "@/features/auth/components/logout-confirm-dialog"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Icons } from "@/components/ui/icons"
import type { AuthUser } from "@/features/auth"
import { BranchSelector } from "@/components/layouts/dashboard/branch-selector"
import { getUserInitials } from "@/utils/get-initials"

export function DashboardHeader({ user }: { user: AuthUser }) {
  const userName = user.name
  const userInitials = getUserInitials(userName)
  const [logoutOpen, setLogoutOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-2 bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar className="size-9 cursor-pointer">
                <AvatarImage
                  src={user.profile_photo_url ?? undefined}
                  alt={userName}
                />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/settings/account">
                <Icons.account size={16} />
                Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setLogoutOpen(true)}
            >
              <Icons.logout size={16} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
      </div>
    </header>
  )
}
