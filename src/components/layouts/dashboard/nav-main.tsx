"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Icon, Icons } from "@/components/ui/icons"
import type { NavItem } from "@/config/sidebar"

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            pathname === item.url ||
            item.items?.some((sub) => pathname === sub.url) ||
            (item.url === "/menu" && pathname === "/menu") ||
            (item.url === "/kitchen" && pathname.startsWith("/kitchen")) ||
            (item.url === "/order" && pathname.startsWith("/order")) ||
            (item.url === "/delivery" && pathname.startsWith("/delivery")) ||
            (item.url === "/inventory" && pathname.startsWith("/inventory")) ||
            (item.url === "/performance" && pathname.startsWith("/performance")) ||
            (item.url === "/customers" &&
              (pathname === "/customers" ||
                (pathname.startsWith("/customers/") &&
                  !pathname.startsWith("/customers/tickets") &&
                  !pathname.startsWith("/customers/chats"))))

          return item.items?.length ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon ? <Icon name={item.icon} size={24} /> : null}
                    <span>{item.title}</span>
                    <Icons.chevronRight size={20}
                      className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
              >
                <Link href={item.url}>
                  {item.icon ? <Icon name={item.icon} size={24} /> : null}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
