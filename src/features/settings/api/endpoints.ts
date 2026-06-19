import type { IntegrationCategory } from "../integration.types"

export const settingsEndpoints = {
  notifications: "/api/proxy/admin/settings/notifications",
  integrations: (category: IntegrationCategory) =>
    `/api/proxy/admin/settings/integrations/${category}`,
  integrationProvider: (provider: string) =>
    `/api/proxy/admin/settings/integrations/providers/${encodeURIComponent(provider)}`,
} as const
