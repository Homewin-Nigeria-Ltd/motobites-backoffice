import { formatNairaAmount } from "@/features/customers/utils/customer-format"
import { formatDate } from "@/utils/date"
import { getInitials } from "@/utils/get-initials"

import type {
  ApiCustomer,
  ApiCustomerCnplTransaction,
  ApiCustomerDetailData,
  ApiCustomerTransaction,
  CustomerCnplTransaction,
  CustomerDetail,
  CustomerTransaction,
} from "../types"
import { mapApiCustomerToCustomer } from "./customer"

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return { firstName: "", lastName: "" }
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] }
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  }
}

function formatAmount(
  amount: number | undefined,
  formatted?: string
) {
  if (formatted) {
    return formatted
  }

  if (amount === undefined) {
    return formatNairaAmount(0)
  }

  return formatNairaAmount(amount)
}

function formatHomeAddresses(
  addresses?: ApiCustomerDetailData["profile"]["home_addresses"]
) {
  if (!addresses?.length) {
    return "—"
  }

  return addresses
    .map((address) =>
      typeof address === "string" ? address : address.address || "—"
    )
    .join("\n")
}

function formatOrderLabel(
  orderNumber?: string,
  referenceNumber?: string,
  orderId?: number | string
) {
  if (orderNumber?.startsWith("#") || orderNumber?.startsWith("Order")) {
    return orderNumber
  }

  if (orderNumber) {
    return `Order ${orderNumber}`
  }

  if (referenceNumber) {
    return referenceNumber.startsWith("#")
      ? referenceNumber
      : `#${referenceNumber}`
  }

  if (orderId !== undefined) {
    return `Order ${orderId}`
  }

  return "—"
}

function formatDisplayStatus(
  displayStatus?: string,
  status?: string
) {
  const value = displayStatus || status

  if (!value) {
    return "—"
  }

  if (value.includes(" ")) {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function formatOrderedAt(transaction: ApiCustomerTransaction) {
  if (transaction.created_at) {
    return formatDate(transaction.created_at)
  }

  return transaction.ordered_at || "—"
}

function mapApiTransaction(
  transaction: ApiCustomerTransaction,
  index: number
): CustomerTransaction {
  const status = transaction.status || "—"
  const displayStatus = formatDisplayStatus(
    transaction.display_status,
    transaction.status
  )

  return {
    id: String(transaction.id ?? index),
    orderNumber: formatOrderLabel(
      transaction.order_number,
      transaction.reference_number,
      transaction.order_id
    ),
    referenceNumber: transaction.reference_number || "—",
    mealName: transaction.item_name || transaction.meal_name || "Order",
    itemImage: transaction.item_image ?? null,
    amountPaid: formatAmount(
      transaction.amount_paid,
      transaction.amount_paid_formatted
    ),
    customerName: transaction.customer_name || "—",
    deliveryAddress: transaction.delivery_address || "—",
    status,
    displayStatus,
    riderName: transaction.rider_name || "—",
    customerRemark: transaction.customer_remark || "—",
    orderedAt: formatOrderedAt(transaction),
    paymentMethod: transaction.payment_method || "—",
    deliveryTime: transaction.delivery_time || "—",
    customerReview: transaction.customer_review || "—",
    riderReview: transaction.rider_review || "—",
    kitchen: transaction.kitchen ?? null,
  }
}

function mapApiCnplTransaction(
  transaction: ApiCustomerCnplTransaction,
  index: number
): CustomerCnplTransaction {
  const amount = formatAmount(
    transaction.amount,
    transaction.amount_formatted
  )

  return {
    id: String(transaction.id ?? index),
    title: transaction.title || "Ordered Meal",
    description:
      transaction.description ||
      "This order was taken from chop now pay later",
    amount: amount.startsWith("-") ? amount : `-${amount}`,
  }
}

function mapApiCustomerToCustomerDetail(
  customer: ApiCustomer
): CustomerDetail {
  const base = mapApiCustomerToCustomer(customer)
  const fullName =
    customer.full_name || customer.name || customer.email || "Customer"
  const split = splitName(fullName)
  const transactions = (
    customer.transaction_history ??
    customer.transactions ??
    []
  ).map(mapApiTransaction)
  const cnplTransactions = (
    customer.cnpl_transactions ??
    customer.chop_now_pay_later_transactions ??
    []
  ).map(mapApiCnplTransaction)
  const overdraftBalance = customer.overdraft_balance ?? 0

  return {
    ...base,
    firstName: customer.first_name || split.firstName,
    lastName: customer.last_name || split.lastName,
    homeAddress: customer.home_address || "—",
    avatar: null,
    ordersCount: customer.orders_count ?? 0,
    overdraftBalance,
    overdraftBalanceFormatted:
      customer.overdraft_balance_formatted ??
      formatNairaAmount(overdraftBalance),
    overdraftEligibility: customer.overdraft_eligibility ?? 0,
    cnplEnabled: false,
    transactions,
    cnplTransactions,
    initials: customer.initials || getInitials(fullName),
  }
}

export function mapApiCustomerDetailToCustomerDetail(
  data: ApiCustomerDetailData
): CustomerDetail {
  const { profile, account = {}, cnpl = {} } = data

  const base = mapApiCustomerToCustomer({
    id: profile.id,
    first_name: profile.first_name,
    last_name: profile.last_name,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    status: profile.status,
    joined_at: profile.joined_at,
    wallet_balance: account.wallet_balance,
    wallet_balance_formatted: account.wallet_balance_formatted,
    orders_count: account.orders_count,
    today_transaction: account.today_transaction,
    today_transaction_formatted: account.today_transaction_formatted,
  })

  const overdraftBalance = cnpl.overdraft_balance ?? 0
  const fullName = profile.name || profile.email || "Customer"
  const split = splitName(fullName)

  return {
    ...base,
    firstName: profile.first_name || split.firstName,
    lastName: profile.last_name || split.lastName,
    homeAddress: formatHomeAddresses(profile.home_addresses),
    avatar: profile.avatar ?? null,
    ordersCount: account.orders_count ?? 0,
    overdraftBalance,
    overdraftBalanceFormatted:
      cnpl.overdraft_balance_formatted ??
      formatNairaAmount(overdraftBalance),
    overdraftEligibility: cnpl.eligibility_limit ?? 0,
    cnplEnabled: cnpl.is_enabled ?? false,
    transactions: (data.recent_orders ?? []).map(mapApiTransaction),
    cnplTransactions: (data.cnpl_transactions ?? []).map(mapApiCnplTransaction),
    initials: getInitials(fullName),
  }
}

export { mapApiCustomerToCustomerDetail }
