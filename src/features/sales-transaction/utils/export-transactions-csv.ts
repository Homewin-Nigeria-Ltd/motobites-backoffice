import { salesTransactionEndpoints } from "@/features/sales-transaction/api/endpoints"
import type { SalesTransactionExportParams } from "@/features/sales-transaction/types"
import { buildTransactionFilterQuery } from "@/features/sales-transaction/utils/build-transaction-query"

function buildQueryString(params: Record<string, string>) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    query.append(key, value)
  })

  const queryString = query.toString()
  return queryString ? `?${queryString}` : ""
}

function getFilenameFromDisposition(header: string | null) {
  if (!header) {
    return null
  }

  const match = header.match(/filename="?([^"]+)"?/i)
  return match?.[1] ?? null
}

export async function downloadTransactionsCsv(
  params: SalesTransactionExportParams = {},
) {
  const queryString = buildQueryString(buildTransactionFilterQuery(params))
  const response = await fetch(
    `${salesTransactionEndpoints.transactionsExport}${queryString}`,
    {
      method: "GET",
      credentials: "include",
    },
  )

  if (!response.ok) {
    let message = "Failed to export transactions CSV"

    try {
      const data = (await response.json()) as { message?: string }
      if (data.message) {
        message = data.message
      }
    } catch {
      // ignore invalid JSON
    }

    throw new Error(message)
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  const filename =
    getFilenameFromDisposition(response.headers.get("content-disposition")) ??
    `transactions-export-${new Date().toISOString().slice(0, 10)}.csv`

  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
