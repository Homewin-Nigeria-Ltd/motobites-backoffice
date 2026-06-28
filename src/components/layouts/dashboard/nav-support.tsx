"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useTheme } from "@/hooks/use-theme"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Icon, Icons } from "@/components/ui/icons"
import { Switch } from "@/components/ui/switch"
import type { SupportItem } from "@/config/sidebar"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavSupport({
  items,
}: {
  items: SupportItem[]
}) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Support</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            (item.url != null && pathname === item.url) ||
            item.items?.some(
              (subItem) =>
                pathname === subItem.url ||
                pathname.startsWith(`${subItem.url}/`)
            ) ||
            (item.name === "Customer" &&
              (pathname.startsWith("/customers/tickets") ||
                pathname.startsWith("/customers/chats")))

          if (item.items?.length) {
            return (
              <Collapsible
                key={item.name}
                asChild
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.name} isActive={isActive}>
                      <Icon name={item.icon} size={24} />
                      <span>{item.name}</span>
                      <Icons.chevronRight
                        size={20}
                        className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isSubActive =
                          pathname === subItem.url ||
                          pathname.startsWith(`${subItem.url}/`)

                        return (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubActive}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                tooltip={item.name}
                isActive={isActive}
              >
                <Link href={item.url ?? "#"}>
                  <Icon name={item.icon} size={24} />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
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
