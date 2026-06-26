export function formatTicketCount(value: number) {
  return new Intl.NumberFormat("en-NG").format(value)
}
