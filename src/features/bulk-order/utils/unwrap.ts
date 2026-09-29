function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  return null
}

export function unwrapApiData<T>(payload: unknown): T {
  const record = asRecord(payload)

  if (record && "data" in record) {
    return record.data as T
  }

  return payload as T
}

export function extractCollection(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload
  }

  const root = asRecord(payload)
  if (!root) {
    return []
  }

  for (const key of ["items", "menu_items", "data", "orders"]) {
    const value = root[key]
    if (Array.isArray(value)) {
      return value
    }
  }

  const nested = asRecord(root.data)
  if (nested) {
    const listed: unknown[] = []
    for (const key of ["items", "menu_items", "orders"]) {
      const value = nested[key]
      if (Array.isArray(value)) {
        listed.push(...value)
      }
    }

    const grouped = flattenAllocationGroups(nested)
    if (listed.length > 0 || grouped.length > 0) {
      return [...listed, ...grouped]
    }

    if (Array.isArray(nested.kitchens)) {
      return flattenKitchenItems(nested.kitchens)
    }
  }

  const groupedRoot = flattenAllocationGroups(root)
  if (groupedRoot.length > 0) {
    return groupedRoot
  }

  if (Array.isArray(root.kitchens)) {
    return flattenKitchenItems(root.kitchens)
  }

  return []
}

const ALLOCATION_GROUPS: Array<[string, string]> = [
  ["primaries", "primary"],
  ["primary", "primary"],
  ["combos", "primary"],
  ["mains", "primary"],
  ["portions", "primary"],
  ["sides", "side"],
  ["side", "side"],
  ["proteins", "protein"],
  ["protein", "protein"],
  ["drinks", "drink"],
  ["drink", "drink"],
  ["refreshers", "drink"],
]

function flattenAllocationGroups(record: Record<string, unknown>) {
  const items: unknown[] = []

  for (const [key, type] of ALLOCATION_GROUPS) {
    const value = record[key]
    if (!Array.isArray(value) || value.length === 0) {
      continue
    }

    for (const item of value) {
      const itemRecord = asRecord(item)
      items.push(
        itemRecord ? { ...itemRecord, type: itemRecord.type ?? type } : item,
      )
    }
  }

  return items
}

function flattenKitchenItems(kitchens: unknown[]) {
  return kitchens.flatMap((kitchen) => {
    const record = asRecord(kitchen)
    if (!record) {
      return []
    }

    const items = record.menu_items ?? record.items
    if (!Array.isArray(items)) {
      return []
    }

    return items.map((item) => {
      const itemRecord = asRecord(item) ?? {}
      return {
        ...itemRecord,
        kitchen: record,
        kitchen_id: itemRecord.kitchen_id ?? record.id,
      }
    })
  })
}

export function extractMeta(payload: unknown) {
  const root = asRecord(payload)
  const meta = asRecord(root?.meta)

  return {
    current_page:
      typeof meta?.current_page === "number" ? meta.current_page : 1,
    last_page: typeof meta?.last_page === "number" ? meta.last_page : 1,
    saved_orders_count:
      typeof root?.saved_orders_count === "number"
        ? root.saved_orders_count
        : undefined,
  }
}
