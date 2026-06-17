export const settingsKeys = {
  all: ["settings"] as const,
  notifications: () => [...settingsKeys.all, "notifications"] as const,
}
