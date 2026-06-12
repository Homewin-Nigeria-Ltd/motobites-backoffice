import type { CustomerCnplTransaction } from "../types"

export function getDummyCnplTransactions(): CustomerCnplTransaction[] {
  return Array.from({ length: 6 }, (_, index) => ({
    id: `cnpl-${index + 1}`,
    title: "Ordered Meal",
    description: "This order was taken from chop now pay later",
    amount: "-₦2,500",
  }))
}
