"use client"

import { CustomerAccountDetailsSection } from "@/features/customers/sections/customer-account-details-section"
import { CustomerAccountManagementSection } from "@/features/customers/sections/customer-account-management-section"
import { CustomerChopNowPayLaterSection } from "@/features/customers/sections/customer-chop-now-pay-later-section"
import { CustomerPersonalInformationSection } from "@/features/customers/sections/customer-personal-information-section"
import { CustomerTransactionHistorySection } from "@/features/customers/sections/customer-transaction-history-section"
import { useCustomerDetail } from "@/features/customers/hooks/use-customer-detail"
import { AppLoader } from "@/components/ui/app-loader"

type CustomerDetailSectionProps = {
  customerId: string
}

export function CustomerDetailSection({
  customerId,
}: CustomerDetailSectionProps) {
  const { data: customer, isPending, isError, error } =
    useCustomerDetail(customerId)

  if (isError) {
    throw error
  }

  if (isPending || !customer) {
    return <AppLoader className="flex-1 bg-muted p-12" />
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="flex-1 p-4 md:p-6">
        <div className="rounded-2xl bg-background px-4 py-2 md:px-8 md:py-4">
          <CustomerPersonalInformationSection customer={customer} />
          <CustomerTransactionHistorySection customer={customer} />
          <CustomerAccountDetailsSection customer={customer} />
          <CustomerChopNowPayLaterSection customer={customer} />
          <CustomerAccountManagementSection customer={customer} />
        </div>
      </div>
    </div>
  )
}
