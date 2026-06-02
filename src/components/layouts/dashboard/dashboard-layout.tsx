"use client"

import { usePathname } from "next/navigation"

import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/layouts/dashboard/dashboard-header"
import type { AuthUser } from "@/features/auth"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function DashboardLayout({
  children,
  user,
  showDashboardHeader,
}: {
  children: React.ReactNode
  user: AuthUser
  showDashboardHeader?: boolean
}) {
  const pathname = usePathname()
  const isMenuDetailPage = pathname.startsWith("/menu/catalog/")
  const shouldShowHeader = showDashboardHeader ?? !isMenuDetailPage

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="flex min-h-0 flex-1 flex-col">
        {shouldShowHeader ? <DashboardHeader user={user} /> : null}
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
