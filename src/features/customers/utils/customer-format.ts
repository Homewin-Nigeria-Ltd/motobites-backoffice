export function formatCustomerCount(value: number) {
  return new Intl.NumberFormat("en-NG").format(value)
}

export function formatNairaAmount(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
