import type {
  OfflineOrderOrderSource,
  OfflineOrderPaymentMethod,
} from "../types"

export const OFFLINE_ORDER_PAYMENT_METHOD_LABELS: Record<
  OfflineOrderPaymentMethod,
  string
> = {
  cash: "Cash",
  pos_card: "POS / Card",
  bank_transfer: "Bank Transfer",
  staff_credit: "Staff Credit",
  chowdeck: "Chowdeck",
  glovo: "Glovo",
}

export const OFFLINE_ORDER_SOURCE_LABELS: Record<
  OfflineOrderOrderSource,
  string
> = {
  walk_in: "Walk-In",
  whatsapp: "WhatsApp",
  web: "Web",
  glovo: "Glovo",
  chowdeck: "Chowdeck",
  staff_credit: "Staff Credit",
}

export const OFFLINE_ORDER_PAYMENT_METHOD_OPTIONS: Array<{
  value: OfflineOrderPaymentMethod
  label: string
}> = [
  { value: "cash", label: OFFLINE_ORDER_PAYMENT_METHOD_LABELS.cash },
  { value: "pos_card", label: OFFLINE_ORDER_PAYMENT_METHOD_LABELS.pos_card },
  {
    value: "bank_transfer",
    label: OFFLINE_ORDER_PAYMENT_METHOD_LABELS.bank_transfer,
  },
  {
    value: "staff_credit",
    label: OFFLINE_ORDER_PAYMENT_METHOD_LABELS.staff_credit,
  },
  { value: "chowdeck", label: OFFLINE_ORDER_PAYMENT_METHOD_LABELS.chowdeck },
  { value: "glovo", label: OFFLINE_ORDER_PAYMENT_METHOD_LABELS.glovo },
]

export const OFFLINE_ORDER_SOURCE_OPTIONS: Array<{
  value: OfflineOrderOrderSource
  label: string
}> = [
  { value: "walk_in", label: OFFLINE_ORDER_SOURCE_LABELS.walk_in },
  { value: "whatsapp", label: OFFLINE_ORDER_SOURCE_LABELS.whatsapp },
  { value: "web", label: OFFLINE_ORDER_SOURCE_LABELS.web },
  { value: "glovo", label: OFFLINE_ORDER_SOURCE_LABELS.glovo },
  { value: "chowdeck", label: OFFLINE_ORDER_SOURCE_LABELS.chowdeck },
  { value: "staff_credit", label: OFFLINE_ORDER_SOURCE_LABELS.staff_credit },
]

const PAYMENT_METHOD_VALUES = new Set<string>(
  OFFLINE_ORDER_PAYMENT_METHOD_OPTIONS.map((option) => option.value),
)

const ORDER_SOURCE_VALUES = new Set<string>(
  OFFLINE_ORDER_SOURCE_OPTIONS.map((option) => option.value),
)

const PAYMENT_METHOD_FOR_ORDER_SOURCE: Partial<
  Record<OfflineOrderOrderSource, OfflineOrderPaymentMethod>
> = {
  chowdeck: "chowdeck",
  glovo: "glovo",
  staff_credit: "staff_credit",
}

export function normalizePaymentMethodFromApi(
  method?: string | null,
): OfflineOrderPaymentMethod {
  const normalized = method?.toLowerCase().trim() ?? "cash"

  if (normalized === "pos" || normalized === "card") {
    return "pos_card"
  }

  if (normalized === "transfer") {
    return "bank_transfer"
  }

  if (PAYMENT_METHOD_VALUES.has(normalized)) {
    return normalized as OfflineOrderPaymentMethod
  }

  return "cash"
}

export function normalizeOrderSourceFromApi(
  source?: string | null,
): OfflineOrderOrderSource {
  const normalized = source?.toLowerCase().trim() ?? "walk_in"

  if (ORDER_SOURCE_VALUES.has(normalized)) {
    return normalized as OfflineOrderOrderSource
  }

  return "walk_in"
}

export function getPaymentMethodLabel(method: string) {
  const normalized = normalizePaymentMethodFromApi(method)
  return OFFLINE_ORDER_PAYMENT_METHOD_LABELS[normalized]
}

export function getOrderSourceLabel(source: string) {
  const normalized = normalizeOrderSourceFromApi(source)
  return OFFLINE_ORDER_SOURCE_LABELS[normalized]
}

export function getPaymentMethodForOrderSource(
  orderSource: OfflineOrderOrderSource,
): OfflineOrderPaymentMethod | undefined {
  return PAYMENT_METHOD_FOR_ORDER_SOURCE[orderSource]
}
