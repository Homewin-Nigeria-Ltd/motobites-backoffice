"use client"

import Image from "next/image"
import { useState } from "react"

import { IncreaseCnplEligibilityDialog } from "@/features/customers/components/increase-cnpl-eligibility-dialog"
import type { CustomerCnplTransaction } from "@/features/customers/types"
import { ASSETS } from "@/constants/assets"
import { Button } from "@/components/ui/button"

type CustomerCnplSectionProps = {
  customerId: string
  overdraftBalanceFormatted: string
  overdraftEligibility: number
  transactions: CustomerCnplTransaction[]
}

export function CustomerCnplSection({
  customerId,
  overdraftBalanceFormatted,
  overdraftEligibility,
  transactions,
}: CustomerCnplSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <div className="space-y-8 py-1 md:space-y-10 md:py-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-sm text-muted-foreground">Overdraft Balance</p>
            <p className="text-base font-semibold text-foreground">
              {overdraftBalanceFormatted}
            </p>
          </div>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-sm font-medium text-primary"
            onClick={() => setIsDialogOpen(true)}
          >
            Increase Eligibility
          </Button>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">
            Transaction History
          </p>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No chop now pay later transactions yet.
            </p>
          ) : (
            <div className="divide-y divide-border/60">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 px-1 py-4 first:pt-0 last:pb-0 md:gap-5 md:py-5"
                >
                  <Image
                    src={ASSETS.illustrations.point}
                    alt=""
                    width={30}
                    height={30}
                    className="size-7 shrink-0 md:size-8"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">
                      {transaction.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.description}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-destructive">
                    {transaction.amount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <IncreaseCnplEligibilityDialog
        customerId={customerId}
        currentEligibility={overdraftEligibility}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  )
}
