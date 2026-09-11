import type {
  SalesTransactionExportParams,
  SalesTransactionListParams,
} from "@/features/sales-transaction/types"

export function buildTransactionFilterQuery(
  params: SalesTransactionExportParams,
) {
  const query: Record<string, string> = {}

  if (params.date_from) {
    query.date_from = params.date_from
  }

  if (params.date_to) {
    query.date_to = params.date_to
  }

  if (params.source) {
    query.source = params.source
  }

  if (params.payment_method) {
    query.payment_method = params.payment_method
  }

  if (params.status) {
    query.status = params.status
  }

  if (params.search) {
    query.search = params.search
  }

  return query
}

export function buildTransactionsQuery(params: SalesTransactionListParams) {
  return {
    ...buildTransactionFilterQuery(params),
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
  }
}
