import type { ApiInventoryItem } from "../types"

function escapeCsvValue(value: string | number) {
  const stringValue = String(value)

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

export function exportInventoryItemsCsv(items: ApiInventoryItem[], filename = "inventory-items.csv") {
  const headers = [
    "Inventory ID",
    "Item",
    "Quantity",
    "Amount",
    "Category",
    "Purchased By",
    "Date Purchased",
    "Stock Level",
  ]

  const rows = items.map((item) => [
    item.inventory_code,
    item.name,
    item.quantity,
    item.amount_formatted,
    item.category_label,
    item.purchased_by.name,
    item.date_purchased,
    item.stock_level_label,
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
