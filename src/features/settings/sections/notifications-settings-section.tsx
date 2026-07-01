"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { NotificationCheckboxOption } from "@/features/settings/components/notification-checkbox-option"
import { NotificationPreferenceSection } from "@/features/settings/components/notification-preference-section"
import { NotificationRadioOption } from "@/features/settings/components/notification-radio-option"
import { useNotificationPreferences } from "@/features/settings/hooks/use-notification-preferences"
import { useUpdateNotificationPreferences } from "@/features/settings/hooks/use-update-notification-preferences"
import {
  notificationPreferencesDefaults,
  notificationPreferencesSchema,
  type NotificationPreferencesFormValues,
} from "@/features/settings/schemas/notification-preferences.schema"
import { BackLink } from "@/components/back-link"
import { AppLoader } from "@/components/ui/app-loader"
import { RadioGroup } from "@/components/ui/radio-group"

export function NotificationsSettingsSection() {
  const {
    data: preferences,
    isPending,
    isError,
  } = useNotificationPreferences()
  const { updatePreferences, isPending: isUpdating } =
    useUpdateNotificationPreferences()

  const form = useForm<NotificationPreferencesFormValues>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: notificationPreferencesDefaults,
  })

  useEffect(() => {
    if (!preferences) return

    form.reset({
      login_attempts: preferences.login_attempts,
      login_alert_method: preferences.login_alerts.method,
      push_notifications:
        preferences.push_notifications as NotificationPreferencesFormValues["push_notifications"],
      push_notification_mode:
        preferences.push_notifications_detail.mode as NotificationPreferencesFormValues["push_notification_mode"],
      reminders:
        preferences.reminders as NotificationPreferencesFormValues["reminders"],
      reminder_mode:
        preferences.reminders_detail.mode as NotificationPreferencesFormValues["reminder_mode"],
      news_and_updates: preferences.news_and_updates,
      tips_and_tutorials: preferences.tips_and_tutorials,
      subscribe_news: preferences.email.subscribe_news,
      subscribe_tips: preferences.email.subscribe_tips,
      email_orders: preferences.email.orders,
      email_tickets: preferences.email.tickets,
      push_orders: preferences.push.orders,
      push_tickets: preferences.push.tickets,
    })
  }, [preferences, form])

  async function handlePreferenceUpdate() {
    await updatePreferences(form.getValues())
  }

  if (isPending) {
    return <AppLoader className="flex-1 bg-muted p-12" />
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6 text-sm text-destructive">
        Could not load notification preferences.
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4">
        <BackLink href="/settings" label="settings" />
      </div>
      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Preference</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Set the preference for your account and get notified at any time
              there&apos;s an update.
            </p>
          </div>

          <fieldset
            disabled={isUpdating}
            className="divide-y divide-border disabled:opacity-70"
          >
            <NotificationPreferenceSection
              title="Login attempts"
              description="These are notifications to notify you when your account is being accessed"
            >
              <Controller
                name="login_attempts"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      form.setValue(
                        "login_alert_method",
                        value as NotificationPreferencesFormValues["login_alert_method"]
                      )
                      void handlePreferenceUpdate()
                    }}
                    className="gap-4"
                  >
                    <NotificationRadioOption
                      id="login-attempts-email"
                      value="email"
                      label="Email"
                    />
                    <NotificationRadioOption
                      id="login-attempts-push"
                      value="push"
                      label="Push Notification"
                    />
                    <NotificationRadioOption
                      id="login-attempts-sms"
                      value="sms"
                      label="SMS"
                    />
                  </RadioGroup>
                )}
              />
            </NotificationPreferenceSection>

            <NotificationPreferenceSection
              title="Push Notifications"
              description="These are notifications generated when the app is not open, notifying you of new update, news and messages"
            >
              <Controller
                name="push_notifications"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      form.setValue(
                        "push_notification_mode",
                        value === "all_activity" ? "all" : "none"
                      )
                      void handlePreferenceUpdate()
                    }}
                    className="gap-4"
                  >
                    <NotificationRadioOption
                      id="push-notifications-none"
                      value="do_not_notify"
                      label="Do not notify me"
                    />
                    <NotificationRadioOption
                      id="push-notifications-all"
                      value="all_activity"
                      label="All reminders"
                      description="Notify me for all other activity."
                    />
                  </RadioGroup>
                )}
              />
            </NotificationPreferenceSection>

            <NotificationPreferenceSection
              title="Reminders"
              description="These are notifications to remind you of updates you might have missed."
            >
              <Controller
                name="reminders"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      form.setValue(
                        "reminder_mode",
                        value === "all_reminders"
                          ? "all"
                          : value === "important_only"
                            ? "important"
                            : "none"
                      )
                      void handlePreferenceUpdate()
                    }}
                    className="gap-4"
                  >
                    <NotificationRadioOption
                      id="reminders-none"
                      value="do_not_notify"
                      label="Do not notify me"
                    />
                    <NotificationRadioOption
                      id="reminders-important"
                      value="important_only"
                      label="Important reminders only"
                      description="Only notify me if the reminder is tagged as important."
                    />
                    <NotificationRadioOption
                      id="reminders-all"
                      value="all_reminders"
                      label="All reminders"
                      description="Notify me for all reminders."
                    />
                  </RadioGroup>
                )}
              />
            </NotificationPreferenceSection>

            <NotificationPreferenceSection
              title="Email Notification"
              description="Receive the latest news, updates and industry tutorials from us."
            >
              <div className="space-y-4">
                <Controller
                  name="news_and_updates"
                  control={form.control}
                  render={({ field }) => (
                    <NotificationCheckboxOption
                      id="email-news-updates"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        form.setValue("subscribe_news", checked)
                        void handlePreferenceUpdate()
                      }}
                      label="News and updates"
                      description="News about product and feature updates."
                    />
                  )}
                />

                <Controller
                  name="tips_and_tutorials"
                  control={form.control}
                  render={({ field }) => (
                    <NotificationCheckboxOption
                      id="email-tips-tutorials"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        form.setValue("subscribe_tips", checked)
                        void handlePreferenceUpdate()
                      }}
                      label="Tips and tutorials"
                      description="Tips on getting more out of Untitled."
                    />
                  )}
                />
              </div>
            </NotificationPreferenceSection>
          </fieldset>
        </div>
      </div>
    </div>
  )
}
