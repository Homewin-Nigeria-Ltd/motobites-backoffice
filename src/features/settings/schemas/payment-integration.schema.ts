import { z } from "zod/v3"

import type { ApiIntegrationProviderConfig } from "../integration.types"

const logoField = z.custom<File | null>(
  (value) => value === null || value instanceof File
)

export const paymentIntegrationSchema = z.object({
  environment: z.enum(["test", "live"]),
  secret_key: z.string().min(1, "Secret key is required"),
  public_key: z.string().min(1, "Public key is required"),
  hash: z.string().min(1, "Hash is required"),
  payment_gateway_title: z.string().min(1, "Payment gateway title is required"),
  logo: logoField,
})

export function createPaymentIntegrationSchema(hasSecretKey: boolean) {
  return paymentIntegrationSchema.extend({
    secret_key: hasSecretKey
      ? z.string()
      : z.string().min(1, "Secret key is required"),
    logo: logoField,
  })
}

export type PaymentIntegrationFormValues = z.infer<typeof paymentIntegrationSchema>

export function getPaymentIntegrationDefaultValues(
  provider: ApiIntegrationProviderConfig
): PaymentIntegrationFormValues {
  return {
    environment: provider.environment,
    secret_key: provider.secret_key ?? "",
    public_key: provider.public_key ?? "",
    hash: provider.hash ?? "",
    payment_gateway_title: provider.payment_gateway_title ?? "",
    logo: null,
  }
}
