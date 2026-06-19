export type IntegrationCategory = "payment" | "map" | "recovery"

export type IntegrationEnvironment = "test" | "live"

export type ApiIntegration = {
  provider: string
  name: string
  description: string
  logo_path: string | null
  is_enabled: boolean
  environment: IntegrationEnvironment
}

/** @deprecated Use ApiIntegration */
export type ApiPaymentIntegration = ApiIntegration

export type IntegrationsApiResponse = {
  success: boolean
  data: ApiIntegration[]
  message?: string
}

/** @deprecated Use IntegrationsApiResponse */
export type PaymentIntegrationsApiResponse = IntegrationsApiResponse

export type ApiIntegrationProviderConfig = {
  provider: string
  name: string
  description: string
  logo_path: string | null
  is_enabled: boolean
  environment: IntegrationEnvironment
  category: IntegrationCategory
  secret_key: string | null
  public_key: string | null
  hash_key: string | null
  hash: string | null
  display_title: string | null
  payment_gateway_title: string | null
  client_key: string | null
  server_key: string | null
  map_api_key_client: string | null
  map_api_key_server: string | null
  secret_key_masked: string | null
  has_secret_key: boolean
}

export type IntegrationProviderApiResponse = {
  success: boolean
  data: ApiIntegrationProviderConfig
  message?: string
}

export type IntegrationItem = {
  id: string
  name: string
  description: string
  category: IntegrationCategory
  logo_url: string
}

export const INTEGRATION_CATEGORY_LABELS: Record<IntegrationCategory, string> = {
  payment: "Payment Integration",
  map: "Map Apis",
  recovery: "Recovery",
}

export const INTEGRATION_ENVIRONMENT_LABELS: Record<
  IntegrationEnvironment,
  string
> = {
  test: "Test",
  live: "Live",
}
