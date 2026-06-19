"use client"

import { useTheme } from "@/hooks/use-theme"
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
  const { theme, toggleTheme } = useTheme()

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
          <div className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm text-sidebar-foreground group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-2">
            <Icons.moon size={24} className="shrink-0" />
            <span className="truncate group-data-[collapsible=icon]:hidden">
              Dark Mode
            </span>
            <Switch
              className="ml-auto shrink-0 group-data-[collapsible=icon]:hidden"
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
              onClick={(e) => e.stopPropagation()}
              aria-label="Toggle dark mode"
            />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
