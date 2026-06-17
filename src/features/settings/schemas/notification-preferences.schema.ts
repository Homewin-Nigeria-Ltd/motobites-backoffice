import { z } from "zod/v3"

export const notificationPreferencesSchema = z.object({
  login_attempts: z.enum(["email", "push", "sms"]),
  login_alert_method: z.enum(["email", "push", "sms"]),
  push_notifications: z.enum(["do_not_notify", "all_activity"]),
  push_notification_mode: z.enum(["none", "all"]),
  reminders: z.enum(["do_not_notify", "important_only", "all_reminders"]),
  reminder_mode: z.enum(["none", "important", "all"]),
  news_and_updates: z.boolean(),
  tips_and_tutorials: z.boolean(),
  subscribe_news: z.boolean(),
  subscribe_tips: z.boolean(),
  email_orders: z.boolean(),
  email_tickets: z.boolean(),
  push_orders: z.boolean(),
  push_tickets: z.boolean(),
})

export type NotificationPreferencesFormValues = z.infer<
  typeof notificationPreferencesSchema
>

export const notificationPreferencesDefaults: NotificationPreferencesFormValues =
  {
    login_attempts: "email",
    login_alert_method: "email",
    push_notifications: "do_not_notify",
    push_notification_mode: "none",
    reminders: "all_reminders",
    reminder_mode: "all",
    news_and_updates: true,
    tips_and_tutorials: true,
    subscribe_news: true,
    subscribe_tips: true,
    email_orders: true,
    email_tickets: true,
    push_orders: true,
    push_tickets: true,
  }
