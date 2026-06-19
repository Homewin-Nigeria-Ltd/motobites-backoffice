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
import type { IconName } from "@/components/ui/icons"
import type { AuthUser } from "@/features/auth"

const data = {
  navMain: [
    { title: "Overview", url: "/dashboard", icon: "dashboard" as IconName },
    { title: "Order Management", url: "/order", icon: "orders" as IconName },
    {
      title: "Kitchen Workflow",
      url: "/kitchen",
      icon: "kitchen" as IconName,
    },
    { title: "Revenue Analytics", url: "/revenue-analytics", icon: "revenue" as IconName },
    { title: "Inventory Tracking", url: "/inventory-tracking", icon: "inventory" as IconName },
    { title: "Menu Management", url: "/menu", icon: "book" as IconName },
    { title: "Delivery Management", url: "/delivery", icon: "truck" as IconName },
    { title: "Rider Chat", url: "/riders/chat", icon: "messageCircle" as IconName },
    { title: "Performance", url: "/performance", icon: "performance" as IconName },
    {
      title: "Staff Management",
      url: "/staff",
      icon: "shield" as IconName,
    },
    { title: "Technical Report", url: "/technical-report", icon: "fileText" as IconName },
    {
      title: "Customer Retention and Loyalty",
      url: "/customers",
      icon: "heart" as IconName,
    },
  ],
  support: [
    { name: "Customer Support", url: "/customer-support", icon: "headphones" as IconName },
    { name: "Settings", url: "/settings", icon: "settings" as IconName },
  ],
}

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: AuthUser }) {
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
        <NavMain items={data.navMain} />
        <NavSupport items={data.support} />
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
