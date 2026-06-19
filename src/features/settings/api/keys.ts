import type { IntegrationCategory } from "../integration.types"

export const settingsKeys = {
  all: ["settings"] as const,
  notifications: () => [...settingsKeys.all, "notifications"] as const,
  integrations: (category: IntegrationCategory) =>
    [...settingsKeys.all, "integrations", category] as const,
  integrationProvider: (provider: string) =>
    [...settingsKeys.all, "integrations", "providers", provider] as const,
}
