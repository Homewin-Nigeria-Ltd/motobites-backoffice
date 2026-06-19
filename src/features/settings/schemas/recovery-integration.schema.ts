import { z } from "zod/v3"

import type { ApiIntegrationProviderConfig } from "../integration.types"

const logoField = z.custom<File | null>(
  (value) => value === null || value instanceof File
)

export const recoveryIntegrationSchema = z.object({
  environment: z.enum(["test", "live"]),
  secret_key: z.string().min(1, "Secret key is required"),
  public_key: z.string().min(1, "Public key is required"),
  hash: z.string().min(1, "Hash is required"),
  payment_gateway_title: z.string().min(1, "Payment gateway title is required"),
  logo: logoField,
})

export function createRecoveryIntegrationSchema(hasSecretKey: boolean) {
  return recoveryIntegrationSchema.extend({
    secret_key: hasSecretKey
      ? z.string()
      : z.string().min(1, "Secret key is required"),
    logo: logoField,
  })
}

export type RecoveryIntegrationFormValues = z.infer<typeof recoveryIntegrationSchema>

export function getRecoveryIntegrationDefaultValues(
  provider: ApiIntegrationProviderConfig
): RecoveryIntegrationFormValues {
  return {
    environment: provider.environment,
    secret_key: provider.secret_key ?? "",
    public_key: provider.public_key ?? "",
    hash: provider.hash ?? "",
    payment_gateway_title: provider.payment_gateway_title ?? "",
    logo: null,
  }
}
