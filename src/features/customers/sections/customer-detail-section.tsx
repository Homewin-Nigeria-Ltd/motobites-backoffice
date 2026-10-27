"use client"

import { useEffect, useState } from "react"

import { CustomerAccountDetailsSection } from "@/features/customers/sections/customer-account-details-section"
import { CustomerAccountManagementSection } from "@/features/customers/sections/customer-account-management-section"
import { CustomerChopNowPayLaterSection } from "@/features/customers/sections/customer-chop-now-pay-later-section"
import { CustomerPersonalInformationSection } from "@/features/customers/sections/customer-personal-information-section"
import { CustomerReferralsSection } from "@/features/customers/sections/customer-referrals-section"
import { CustomerTransactionHistorySection } from "@/features/customers/sections/customer-transaction-history-section"
import { useCustomerDetail } from "@/features/customers/hooks/use-customer-detail"
import { AppLoader } from "@/components/ui/app-loader"

type CustomerDetailSectionProps = {
  customerId: string
}

function parseFundedAmount(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  const amount = Number(trimmed)

  if (!Number.isFinite(amount) || amount < 0) {
    return undefined
  }

  return amount
}

export function CustomerDetailSection({
  customerId,
}: CustomerDetailSectionProps) {
  const [fundedAmountInput, setFundedAmountInput] = useState("")
  const [fundedAmount, setFundedAmount] = useState<number | undefined>()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFundedAmount(parseFundedAmount(fundedAmountInput))
    }, 300)

    return () => window.clearTimeout(timer)
  }, [fundedAmountInput])

  const { data: customer, isPending, isFetching, isError, error } =
    useCustomerDetail(customerId, fundedAmount)

  if (isError) {
    throw error
  }

  if (isPending || !customer) {
    return <AppLoader className="flex-1 bg-muted p-12" />
  }

  return (
    <div className="bg-muted">
      <div className="flex-1 p-4 md:p-6">
        <div className="rounded-2xl bg-background px-4 py-2 md:px-8 md:py-4">
          <CustomerPersonalInformationSection customer={customer} />
          <CustomerReferralsSection
            customer={customer}
            fundedAmount={fundedAmountInput}
            onFundedAmountChange={setFundedAmountInput}
            isFiltering={isFetching && fundedAmount !== undefined}
          />
          <CustomerTransactionHistorySection customer={customer} />
          <CustomerAccountDetailsSection customer={customer} />
          <CustomerChopNowPayLaterSection customer={customer} />
          <CustomerAccountManagementSection customer={customer} />
        </div>
      </div>
    </div>
  )
}
