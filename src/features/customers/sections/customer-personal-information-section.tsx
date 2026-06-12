import { CustomerDetailBlock } from "@/features/customers/components/customer-detail-block"
import { CustomerPersonalInfo } from "@/features/customers/components/customer-personal-info"
import type { CustomerDetail } from "@/features/customers/types"

type CustomerPersonalInformationSectionProps = {
  customer: CustomerDetail
}

export function CustomerPersonalInformationSection({
  customer,
}: CustomerPersonalInformationSectionProps) {
  return (
    <CustomerDetailBlock
      title="Personal Information"
      description="View user's personal information here."
      plain
    >
      <CustomerPersonalInfo customer={customer} />
    </CustomerDetailBlock>
  )
}
