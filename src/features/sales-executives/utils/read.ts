export function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  return null
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

export function text(value: unknown, fallback = "—") {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value)
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim()
  }

  return fallback
}

export function num(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[^\d.-]/g, ""))
    return Number.isFinite(parsed) ? parsed : fallback
  }

  return fallback
}

export function unwrapData(payload: unknown) {
  const record = asRecord(payload)
  if (record && "data" in record) {
    return record.data
  }

  return payload
}
