export function formatApiDateParam(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function formatDisplayDateRange(dateFrom: string, dateTo: string) {
  const from = new Date(`${dateFrom}T00:00:00`)
  const to = new Date(`${dateTo}T00:00:00`)

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return `${dateFrom} - ${dateTo}`
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return `${formatter.format(from).replace(/, \d{4}$/, "")} - ${formatter.format(to)}`
}

export function getDefaultTransactionDateRange(days = 7) {
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - (days - 1))

  return {
    dateFrom: formatApiDateParam(from),
    dateTo: formatApiDateParam(to),
  }
}

export function getDefaultTransactionDateRangePickerValue(days = 7) {
  const { dateFrom, dateTo } = getDefaultTransactionDateRange(days)

  return {
    from: new Date(`${dateFrom}T00:00:00`),
    to: new Date(`${dateTo}T00:00:00`),
  }
}

export function buildTransactionDateQueryParams(dateRange?: {
  from?: Date
  to?: Date
}) {
  if (!dateRange?.from) {
    return getDefaultTransactionDateRange()
  }

  return {
    dateFrom: formatApiDateParam(dateRange.from),
    dateTo: formatApiDateParam(dateRange.to ?? dateRange.from),
  }
}
