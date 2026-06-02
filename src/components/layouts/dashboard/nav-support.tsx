"use client"

import * as React from "react"

import { Icon, Icons, type IconName } from "@/components/ui/icons"
import { Switch } from "@/components/ui/switch"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSupport({
  items,
}: {
  items: {
    name: string
    url: string
    icon: IconName
  }[]
}) {
  const [darkMode, setDarkMode] = React.useState(false)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Support</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <Icon name={item.icon} size={24} />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip="Dark Mode"
            className="hover:bg-transparent hover:text-sidebar-foreground active:bg-transparent"
          >
            <div>
              <Icons.moon size={24} />
              <span>Dark Mode</span>
              <Switch
                className="shrink-0"
                checked={darkMode}
                onCheckedChange={setDarkMode}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
