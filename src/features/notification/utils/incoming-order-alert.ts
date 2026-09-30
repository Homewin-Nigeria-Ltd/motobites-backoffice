import { formatKoboAmount } from "@/features/order/utils/currency"

export type IncomingOrderAlert = {
  id: string
  orderId: string
  title: string
  message?: string
  canReview: boolean
  fields: { label: string; value: string }[]
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null
  }

  return value as Record<string, unknown>
}

function unwrap(value: unknown): unknown {
  if (typeof value !== "string") {
    return value
  }

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function asString(value: unknown) {
  if (typeof value === "string" && value.trim()) {
    return value.trim()
  }

  if (typeof value === "number") {
    return String(value)
  }

  return null
}

function walk(value: unknown, depth = 0): Record<string, unknown>[] {
  const record = asRecord(unwrap(value))
  if (!record || depth > 5) {
    return []
  }

  return [
    record,
    ...walk(record.notification, depth + 1),
    ...walk(record.metadata, depth + 1),
    ...walk(record.meta, depth + 1),
    ...walk(record.data, depth + 1),
  ]
}

function addField(
  fields: IncomingOrderAlert["fields"],
  label: string,
  value: string | null
) {
  if (value) {
    fields.push({ label, value })
  }
}

export function getIncomingOrderAlert(event: unknown): IncomingOrderAlert | null {
  const nodes = walk(event)
  const orderId = nodes
    .map((node) => asString(node.order_id) ?? asString(node.orderId))
    .find(Boolean)

  if (!orderId) {
    return null
  }

  const metadata =
    nodes.find(
      (node) =>
        node.order_id ||
        node.order_reference ||
        node.customer_name ||
        node.amount_kobo != null
    ) ?? {}
  const notification = nodes.find((node) => node.message || node.category) ?? {}
  const branch = asRecord(metadata.fulfillment_branch)
  const status = asString(metadata.order_status)?.toLowerCase()
  const amountKobo = Number(metadata.amount_kobo)
  const fields: IncomingOrderAlert["fields"] = []

  addField(fields, "Order", asString(metadata.order_reference))
  addField(fields, "Status", asString(metadata.order_status))
  addField(fields, "Customer", asString(metadata.customer_name))
  addField(
    fields,
    "Amount",
    Number.isFinite(amountKobo) ? formatKoboAmount(amountKobo) : null
  )
  addField(fields, "Payment method", asString(metadata.channel))
  addField(fields, "Payment reference", asString(metadata.payment_reference))
  addField(fields, "Kitchen", asString(metadata.kitchen_name))
  addField(fields, "Branch", asString(branch?.name))
  addField(fields, "Branch address", asString(branch?.address))

  const reference = asString(metadata.order_reference)
  const notificationId = asString(notification.id)

  return {
    id: notificationId ?? orderId,
    orderId,
    title: reference ? `New Order ${reference}` : "New Order",
    message: asString(notification.message) ?? undefined,
    canReview: !status || status === "pending",
    fields,
  }
}
