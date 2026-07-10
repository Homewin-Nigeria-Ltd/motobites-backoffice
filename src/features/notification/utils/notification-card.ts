import type { ApiNotification } from "@/features/notification/types"

const ORDER_PAGE = "/order/pending"

type NotificationCategoryConfig = {
  label: string
  actionLabel: string
  href: string
  accent: "primary" | "muted"
}

const CATEGORY_CONFIG: Record<string, NotificationCategoryConfig> = {
  order_management: {
    label: "ORDER MANAGEMENT",
    actionLabel: "Open Order",
    href: ORDER_PAGE,
    accent: "primary",
  },
  menu_management: {
    label: "MENU MANAGEMENT",
    actionLabel: "Open Menu Management",
    href: "/menu",
    accent: "muted",
  },
  kitchen_workflow: {
    label: "KITCHEN WORKFLOW",
    actionLabel: "Open Kitchen",
    href: "/kitchen",
    accent: "muted",
  },
  customer_support: {
    label: "CUSTOMER SUPPORT",
    actionLabel: "Open Support",
    href: "/customers/tickets",
    accent: "muted",
  },
  delivery_management: {
    label: "DELIVERY MANAGEMENT",
    actionLabel: "Open Delivery",
    href: "/delivery",
    accent: "muted",
  },
  inventory_tracking: {
    label: "INVENTORY MANAGEMENT",
    actionLabel: "Open Inventory",
    href: "/inventory",
    accent: "muted",
  },
  staff_management: {
    label: "STAFF MANAGEMENT",
    actionLabel: "Open Staff",
    href: "/staff",
    accent: "muted",
  },
  settings: {
    label: "SETTINGS",
    actionLabel: "Open Settings",
    href: "/settings",
    accent: "muted",
  },
}

const METADATA_HREF_KEYS = ["url", "href", "path", "link", "route"] as const

const TARGET_ROUTES: Record<string, string> = {
  order_management: ORDER_PAGE,
  kitchen_workflow: "/kitchen",
  menu_management: "/menu",
  revenue_analytics: "/revenue-analytics",
  inventory_tracking: "/inventory",
  delivery_management: "/delivery",
  rider_chat: "/riders/chat",
  performance: "/performance",
  staff_management: "/staff",
  customer_retention_loyalty: "/customers",
  customer_support: "/customers/tickets",
  settings: "/settings",
  restaurant_management: "/kitchen",
  order: ORDER_PAGE,
  orders: ORDER_PAGE,
  kitchen: "/kitchen",
  menu: "/menu",
}

export type NotificationDisplay = {
  key: string
  label: string
  actionLabel: string
  href: string
  accent: "primary" | "muted"
}

function normalizeHref(target: string) {
  if (target.startsWith("http://") || target.startsWith("https://")) {
    try {
      const url = new URL(target)
      return `${url.pathname}${url.search}${url.hash}`
    } catch {
      return "/dashboard"
    }
  }

  if (target.startsWith("/")) {
    return target
  }

  return `/${target}`
}

function normalizeTarget(target: string) {
  return target.replace(/\\/g, "/").replace(/^\/+/, "")
}

function getTargetRoot(target: string) {
  return normalizeTarget(target).split("/")[0] ?? ""
}

function isPaymentSuccessfulNotification(
  metadata?: Record<string, unknown>,
  message?: string,
) {
  if (metadata?.event === "payment_successful") {
    return true
  }

  return message?.toLowerCase().startsWith("payment successful") ?? false
}

function isMenuManagementNotification(
  category: string,
  metadata?: Record<string, unknown>,
  message?: string,
  target?: string,
) {
  if (category === "menu_management") {
    return true
  }

  const normalizedTarget = normalizeTarget(target ?? "")
  if (
    normalizedTarget === "menu_management" ||
    normalizedTarget.startsWith("menu_management/")
  ) {
    return true
  }

  const event = metadata?.event
  if (
    event === "new_meal" ||
    event === "meal_added" ||
    event === "menu_item_created"
  ) {
    return true
  }

  return message?.toLowerCase().startsWith("new meal") ?? false
}

function isOrderManagementTarget(target: string) {
  const normalizedTarget = normalizeTarget(target)
  return (
    normalizedTarget === "order_management" ||
    normalizedTarget.startsWith("order_management/")
  )
}

function getMetadataHref(metadata?: Record<string, unknown>) {
  if (!metadata) {
    return null
  }

  for (const key of METADATA_HREF_KEYS) {
    const value = metadata[key]
    if (typeof value === "string" && value.trim()) {
      return normalizeHref(value.trim())
    }
  }

  return null
}

function resolveCategoryKey({
  category,
  metadata,
  message,
  target,
}: {
  category: string
  metadata?: Record<string, unknown>
  message: string
  target: string
}) {
  if (isPaymentSuccessfulNotification(metadata, message)) {
    return "order_management"
  }

  if (isMenuManagementNotification(category, metadata, message, target)) {
    return "menu_management"
  }

  if (category === "order_management" || isOrderManagementTarget(target)) {
    return "order_management"
  }

  const targetRoot = getTargetRoot(target)
  if (targetRoot && targetRoot in CATEGORY_CONFIG) {
    return targetRoot
  }

  if (category in CATEGORY_CONFIG) {
    return category
  }

  return category
}

function resolveHref(
  target: string,
  metadata: Record<string, unknown> | undefined,
  categoryKey: string,
  fallbackHref: string,
) {
  const metadataHref = getMetadataHref(metadata)
  if (metadataHref) {
    return metadataHref
  }

  const config = CATEGORY_CONFIG[categoryKey]
  if (config) {
    return config.href
  }

  if (!target) {
    return fallbackHref
  }

  if (isOrderManagementTarget(target)) {
    return ORDER_PAGE
  }

  if (
    target.startsWith("/") ||
    target.startsWith("http://") ||
    target.startsWith("https://")
  ) {
    return normalizeHref(target)
  }

  const normalizedTarget = normalizeTarget(target)
  const targetRoot = getTargetRoot(target)

  return (
    TARGET_ROUTES[normalizedTarget] ??
    TARGET_ROUTES[targetRoot] ??
    fallbackHref
  )
}

export function getNotificationDisplay(
  item: Pick<ApiNotification, "category" | "category_label" | "message" | "metadata" | "action">,
): NotificationDisplay {
  const categoryKey = resolveCategoryKey({
    category: item.category,
    metadata: item.metadata,
    message: item.message,
    target: item.action.target,
  })

  const config = CATEGORY_CONFIG[categoryKey]

  if (config) {
    const actionLabel =
      categoryKey === "order_management" &&
      item.metadata?.event === "rider_reassignment_requested"
        ? item.action.label
        : config.actionLabel

    return {
      key: categoryKey,
      label: config.label,
      actionLabel,
      href: resolveHref(
        item.action.target,
        item.metadata,
        categoryKey,
        config.href,
      ),
      accent: config.accent,
    }
  }

  return {
    key: item.category,
    label: item.category_label,
    actionLabel: item.action.label,
    href: resolveHref(
      item.action.target,
      item.metadata,
      item.category,
      "/dashboard",
    ),
    accent: item.category.includes("order") ? "primary" : "muted",
  }
}

export function getNotificationInitials(categoryLabel: string) {
  return categoryLabel
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
