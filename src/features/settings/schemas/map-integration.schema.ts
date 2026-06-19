import { z } from "zod/v3"

import type { ApiIntegrationProviderConfig } from "../integration.types"

export const mapIntegrationSchema = z.object({
  map_api_key_client: z.string().min(1, "Map API key (Client) is required"),
  map_api_key_server: z.string().min(1, "Map API key (Server) is required"),
})

export type MapIntegrationFormValues = z.infer<typeof mapIntegrationSchema>

export function getMapIntegrationDefaultValues(
  provider: ApiIntegrationProviderConfig
): MapIntegrationFormValues {
  return {
    map_api_key_client: provider.map_api_key_client ?? "",
    map_api_key_server: provider.map_api_key_server ?? "",
  }
}
