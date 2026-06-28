"use client"

import * as React from "react"

import { NavMain } from "@/components/layouts/dashboard/nav-main"
import { NavSupport } from "@/components/layouts/dashboard/nav-support"
import { NavUser } from "@/components/layouts/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { NavItem, SupportItem } from "@/config/sidebar"
import type { AuthUser } from "@/features/auth"

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
  return (
    <Sidebar
      collapsible="icon"
      className="**:data-[slot=sidebar-inner]:px-4 group-data-[collapsible=icon]:**:data-[slot=sidebar-inner]:px-2"
      {...props}
    >
      <SidebarHeader className="pt-12">
        <div className="flex h-8 w-full items-center justify-start group-data-[collapsible=icon]:justify-center">
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            Motobites
          </span>
          <span className="hidden text-sm font-semibold group-data-[collapsible=icon]:block">
            MB
          </span>
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
