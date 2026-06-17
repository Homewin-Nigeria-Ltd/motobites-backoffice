import type { IconName } from "@/components/ui/icons"

export type SettingsItemId =
  | "account"
  | "notifications"
  | "permissions"
  | "integration"

export type SettingsItem = {
  id: SettingsItemId
  title: string
  description: string
  icon: IconName
  iconVariant?: "default" | "danger"
  href: string
}

export const SETTINGS_LEFT_COLUMN: SettingsItem[] = [
  {
    id: "account",
    title: "Account Settings",
    description:
      "Profile settings for individual admins, including name, email, profile picture,",
    icon: "account",
    href: "/settings/account",
  },
  {
    id: "notifications",
    title: "Notifications",
    description:
      "Ability to customize notification preferences based on user roles",
    icon: "notifications",
    href: "/settings/notifications",
  },
]

export const SETTINGS_RIGHT_COLUMN: SettingsItem[] = [
  {
    id: "permissions",
    title: "Control and Permission",
    description: "user accounts with different permission levels",
    icon: "shield",
    href: "/settings/permissions",
  },
  {
    id: "integration",
    title: "Integration Setting",
    description: "API settings for developers to integrate custom functionalities",
    icon: "link",
    href: "/settings/integration",
  },
]

export type LoginAlertMethod = "email" | "push" | "sms"

export type ApiNotificationPreferences = {
  login_attempts: LoginAlertMethod
  push_notifications: string
  reminders: string
  news_and_updates: boolean
  tips_and_tutorials: boolean
  login_alerts: {
    method: LoginAlertMethod
    options: LoginAlertMethod[]
  }
  push_notifications_detail: {
    mode: string
    ui_value: string
    options: string[]
  }
  reminders_detail: {
    mode: string
    ui_value: string
    options: string[]
  }
  email_notification: {
    news_and_updates: boolean
    tips_and_tutorials: boolean
  }
  email: {
    orders: boolean
    tickets: boolean
    subscribe_news: boolean
    subscribe_tips: boolean
  }
  push: {
    orders: boolean
    tickets: boolean
  }
}

export type NotificationPreferencesApiResponse = {
  success: boolean
  data: ApiNotificationPreferences
  message?: string
}

export type UpdateNotificationPreferencesApiResponse = {
  success: boolean
  data?: ApiNotificationPreferences
  message?: string
}

