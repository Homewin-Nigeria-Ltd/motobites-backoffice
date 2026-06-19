import type { IntegrationEnvironment } from "../integration.types"

export type UpdateIntegrationProviderPayload = {
  environment: IntegrationEnvironment
  is_enabled: boolean
  payment_gateway_title?: string
  public_key?: string
  secret_key?: string
  hash?: string
  map_api_key_client?: string
  map_api_key_server?: string
  logo?: File | null
}

export function buildIntegrationProviderFormData(
  payload: UpdateIntegrationProviderPayload
) {
  const formData = new FormData()

  formData.append("environment", payload.environment)
  formData.append("is_enabled", payload.is_enabled ? "true" : "false")

  if (payload.payment_gateway_title !== undefined) {
    formData.append("payment_gateway_title", payload.payment_gateway_title)
  }

  if (payload.public_key !== undefined) {
    formData.append("public_key", payload.public_key)
  }

  if (payload.secret_key) {
    formData.append("secret_key", payload.secret_key)
  }

  if (payload.hash !== undefined) {
    formData.append("hash", payload.hash)
  }

  if (payload.map_api_key_client !== undefined) {
    formData.append("map_api_key_client", payload.map_api_key_client)
  }

  if (payload.map_api_key_server !== undefined) {
    formData.append("map_api_key_server", payload.map_api_key_server)
  }

  if (payload.logo) {
    formData.append("logo", payload.logo)
  }

  return formData
}
