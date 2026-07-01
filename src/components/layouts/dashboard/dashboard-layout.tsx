"use client"

import { usePathname } from "next/navigation"

import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/layouts/dashboard/dashboard-header"
import type { NavItem, SupportItem } from "@/config/sidebar"
import type { AuthUser } from "@/features/auth"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function DashboardLayout({
  children,
  user,
  filteredNavMain,
  filteredSupport,
  showDashboardHeader,
}: {
  children: React.ReactNode
  user: AuthUser
  filteredNavMain: NavItem[]
  filteredSupport: SupportItem[]
  showDashboardHeader?: boolean
}) {
  const pathname = usePathname()
  const kitchenSegment = pathname.match(/^\/kitchen\/([^/]+)$/)?.[1]
  const isMenuDetailPage =
    kitchenSegment != null && kitchenSegment !== "branches"
  const shouldShowHeader = showDashboardHeader ?? !isMenuDetailPage

  return (
    <SidebarProvider>
      <AppSidebar
        user={user}
        filteredNavMain={filteredNavMain}
        filteredSupport={filteredSupport}
      />
      <SidebarInset className="flex min-h-0 min-w-0 flex-1 flex-col">
        {shouldShowHeader ? <DashboardHeader user={user} /> : null}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
