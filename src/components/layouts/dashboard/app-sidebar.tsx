"use client"

import * as React from "react"

import { NavMain } from "@/components/layouts/dashboard/nav-main"
import { NavSupport } from "@/components/layouts/dashboard/nav-support"
import { NavUser } from "@/components/layouts/dashboard/nav-user"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { NavItem, SupportItem } from "@/config/sidebar"
import type { AuthUser } from "@/features/auth"
import { getAdminRoleLabel } from "@/features/offline-order/utils/admin-role"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: AuthUser
  filteredNavMain: NavItem[]
  filteredSupport: SupportItem[]
}

export function AppSidebar({
  user,
  filteredNavMain,
  filteredSupport,
  ...props
}: AppSidebarProps) {
  const roleLabel = getAdminRoleLabel(user)

  return (
    <Sidebar
      collapsible="icon"
      className="**:data-[slot=sidebar-inner]:px-4 group-data-[collapsible=icon]:**:data-[slot=sidebar-inner]:px-2"
      {...props}
    >
      <SidebarHeader className="pt-12">
        <div className="flex w-full flex-col items-start justify-center gap-1.5 group-data-[collapsible=icon]:items-center">
          <span className="text-lg font-semibold leading-none group-data-[collapsible=icon]:hidden">
            Motobites
          </span>
          <span className="hidden text-sm font-semibold group-data-[collapsible=icon]:block">
            MB
          </span>
          {roleLabel ? (
            <Badge
              className="mt-1 h-6 max-w-full truncate rounded-full border-0 bg-white px-2.5 text-xs font-semibold text-primary hover:bg-white group-data-[collapsible=icon]:hidden"
            >
              {roleLabel}
            </Badge>
          ) : null}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavSupport items={filteredSupport} />
      </SidebarContent>
      <SidebarFooter className="pb-12">
        <NavUser
          user={{
            name: user.name,
            email: user.email,
            avatar: user.profile_photo_url,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
