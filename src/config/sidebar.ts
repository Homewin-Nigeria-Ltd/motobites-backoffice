import type { IconName } from "@/components/ui/icons"
import { PERMISSION_KEYS, type PermissionKey } from "@/lib/permissions"

export type NavSubItem = {
  title: string
  url: string
  adminRole?: string
}

export type NavItem = {
  title: string
  url: string
  icon: IconName
  permission: PermissionKey | null
  items?: NavSubItem[]
}

export type SupportItem = {
  name: string
  url?: string
  icon: IconName
  permission: PermissionKey | null
  items?: {
    name: string
    url: string
  }[]
}

export const navMain: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: "dashboard", permission: null },
  {
    title: "Order Management",
    url: "/order",
    icon: "orders",
    permission: PERMISSION_KEYS.orderManagement,
  },
  {
    title: "POS",
    url: "/offline-order",
    icon: "store",
    permission: PERMISSION_KEYS.salesDashboard,
    items: [
      { title: "Overview", url: "/offline-order" },
      { title: "Sales Transaction", url: "/offline-order/sales-transaction" },
      { title: "New Order", url: "/offline-order/new" },
      { title: "All Orders", url: "/offline-order/all" },
      { title: "Saved Orders", url: "/offline-order/saved" },
      {
        title: "Delete Requests",
        url: "/offline-order/delete-request",
        adminRole: "sales-manager",
      },
    ],
  },
  {
    title: "Kitchen",
    url: "/kitchen",
    icon: "kitchen",
    permission: PERMISSION_KEYS.kitchenWorkflow,
    items: [
      { title: "Kitchens", url: "/kitchen" },
      { title: "Branches", url: "/kitchen/branches" },
    ],
  },
  {
    title: "Revenue Analytics",
    url: "/revenue-analytics",
    icon: "revenue",
    permission: PERMISSION_KEYS.revenueAnalytics,
  },
  {
    title: "Inventory Management",
    url: "/inventory",
    icon: "inventory",
    permission: PERMISSION_KEYS.inventoryTracking,
  },
  {
    title: "Menu Management",
    url: "/menu",
    icon: "book",
    permission: PERMISSION_KEYS.menuManagement,
  },
  {
    title: "Delivery Management",
    url: "/delivery",
    icon: "truck",
    permission: PERMISSION_KEYS.deliveryManagement,
  },
  {
    title: "Rider Chat",
    url: "/riders/chat",
    icon: "messageCircle",
    permission: PERMISSION_KEYS.riderChat,
  },
  {
    title: "Performance",
    url: "/performance",
    icon: "performance",
    permission: PERMISSION_KEYS.performance,
  },
  {
    title: "Staff Management",
    url: "/staff",
    icon: "shield",
    permission: PERMISSION_KEYS.staffManagement,
  },
  // {
  //   title: "Technical Report",
  //   url: "/technical-report",
  //   icon: "fileText",
  //   permission: PERMISSION_KEYS.technicalReport,
  // },
  {
    title: "Customer Retention and Loyalty",
    url: "/customers",
    icon: "heart",
    permission: PERMISSION_KEYS.customerRetentionLoyalty,
  },
]

export const navSupport: SupportItem[] = [
  {
    name: "Customer",
    icon: "headphones",
    permission: PERMISSION_KEYS.customerSupport,
    items: [
      { name: "Tickets", url: "/customers/tickets" },
      { name: "Chat", url: "/customers/chats" },
    ],
  },
  {
    name: "Settings",
    url: "/settings",
    icon: "settings",
    permission: PERMISSION_KEYS.settings,
  },
]
