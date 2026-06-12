import { CustomerAccountManagement } from "@/features/customers/components/customer-account-management"
import { CustomerDetailBlock } from "@/features/customers/components/customer-detail-block"
import type { CustomerDetail } from "@/features/customers/types"

type CustomerAccountManagementSectionProps = {
  customer: CustomerDetail
}

export function CustomerAccountManagementSection({
  customer,
}: CustomerAccountManagementSectionProps) {
  return (
    <CustomerDetailBlock
      title="Account Management"
      description="These options are essential for administrators to maintain control over user accounts and ensure the security and integrity of the platform."
      plain
      className="border-b-0 pb-4 md:pb-6"
    >
      <CustomerAccountManagement
        customerId={customer.id}
        customerName={customer.name}
        status={customer.status}
      />
    </CustomerDetailBlock>
  )
}
