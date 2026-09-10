import type {
  SalesTransactionHistoryFilters,
  SalesTransactionHistoryRow,
} from "../types"

export function filterSalesTransactionHistoryRows(
  rows: SalesTransactionHistoryRow[],
  filters: SalesTransactionHistoryFilters,
) {
  const query = filters.search.trim().toLowerCase()

  return rows.filter((row) => {
    if (filters.source !== "all" && row.source !== filters.source) {
      return false
    }

    if (
      filters.method !== "all" &&
      row.paymentMethod.toLowerCase() !== filters.method
    ) {
      return false
    }

    if (filters.status !== "all" && row.status !== filters.status) {
      return false
    }

    if (!query) {
      return true
    }

    return (
      row.transactionNumber.toLowerCase().includes(query) ||
      row.customerName.toLowerCase().includes(query)
    )
  })
}
