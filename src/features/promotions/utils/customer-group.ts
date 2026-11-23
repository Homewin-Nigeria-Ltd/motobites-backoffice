import type {
  ApiCustomerGroup,
  ApiCustomerGroupCustomer,
  CustomerGroup,
  CustomerGroupMember,
} from "../types"

function resolveCustomerName(customer: ApiCustomerGroupCustomer) {
  const fullName = customer.full_name?.trim()
  if (fullName) return fullName

  const name = customer.name?.trim()
  if (name) return name

  const joined = [customer.first_name, customer.last_name]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ")

  if (joined) return joined

  return `Customer #${customer.id}`
}

function mapCustomerMember(
  customer: ApiCustomerGroupCustomer
): CustomerGroupMember {
  return {
    id: String(customer.id),
    label: `${resolveCustomerName(customer)} · #${customer.id}`,
  }
}

export function mapApiCustomerGroupToCustomerGroup(
  group: ApiCustomerGroup
): CustomerGroup {
  const customers = Array.isArray(group.customers)
    ? group.customers
        .filter((customer) => Number.isFinite(customer.id))
        .map(mapCustomerMember)
    : []

  const customerIdsFromField = Array.isArray(group.customer_ids)
    ? group.customer_ids.filter((id) => Number.isFinite(id))
    : []

  const customerIds =
    customerIdsFromField.length > 0
      ? customerIdsFromField
      : customers.map((customer) => Number(customer.id))

  return {
    id: String(group.id),
    name: group.name,
    description: group.description?.trim() || "",
    customerIds,
    customers,
    membersCount:
      group.members_count ??
      group.customers_count ??
      customerIds.length,
  }
}
