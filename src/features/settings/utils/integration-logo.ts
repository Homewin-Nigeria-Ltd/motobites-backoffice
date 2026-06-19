import { ASSETS } from "@/constants/assets"
import { toImageSrc } from "@/lib/image-url"

type IntegrationProviderLogoKey = keyof Omit<
  typeof ASSETS.integrations,
  "placeholder"
>

function isIntegrationProviderLogoKey(
  provider: string
): provider is IntegrationProviderLogoKey {
  return provider in ASSETS.integrations && provider !== "placeholder"
}

export function getIntegrationLogo(provider: string, logo_path: string | null) {
  if (logo_path) {
    if (logo_path.startsWith("http") || logo_path.startsWith("/")) {
      return logo_path
    }

    return toImageSrc(logo_path)
  }

  if (isIntegrationProviderLogoKey(provider)) {
    return ASSETS.integrations[provider]
  }

  return ASSETS.integrations.placeholder
}

/** @deprecated Use getIntegrationLogo */
export const getPaymentIntegrationLogo = getIntegrationLogo
