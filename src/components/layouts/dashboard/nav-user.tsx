"use client"

import { useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Icons } from "@/components/ui/icons"
import { LogoutConfirmDialog } from "@/features/auth/components/logout-confirm-dialog"
import { cn } from "@/lib/utils"
import { getUserInitials } from "@/utils/get-initials"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string | null
  }
}) {
  const [logoutOpen, setLogoutOpen] = useState(false)
  const userInitials = getUserInitials(user.name)

  return (
    <SidebarMenu>
      <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <div className="flex w-full min-w-0 items-center group-data-[collapsible=icon]:justify-center">
          <SidebarMenuButton
            asChild
            size="lg"
            tooltip={user.name}
            className="min-w-0 flex-1 group hover:bg-transparent hover:text-sidebar-foreground active:bg-transparent group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:min-h-8! group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:items-center!"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Avatar className="size-8 shrink-0 rounded-lg group-data-[collapsible=icon]:size-7 group-data-[collapsible=icon]:rounded-full">
                <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                <AvatarFallback className="rounded-lg group-data-[collapsible=icon]:rounded-full">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </div>
          </SidebarMenuButton>
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            aria-label="Log out"
            className={cn(
              "mr-2 shrink-0 cursor-pointer rounded-md p-1 text-sidebar-foreground/70 transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "disabled:pointer-events-none disabled:opacity-50",
              "group-data-[collapsible=icon]:hidden"
            )}
          >
            <Icons.logout size={24} />
          </button>
        </div>
      </SidebarMenuItem>

      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </SidebarMenu>
  )
}
