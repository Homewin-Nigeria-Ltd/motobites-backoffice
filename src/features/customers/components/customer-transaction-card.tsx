import Image from "next/image"

import type { CustomerTransaction } from "@/features/customers/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const detailField = "min-w-0 space-y-1.5"
const detailLabel = "text-sm text-muted-foreground"
const detailValue = "text-xs text-foreground"

type CustomerTransactionCardProps = {
  transaction: CustomerTransaction
}

export function CustomerTransactionCard({
  transaction,
}: CustomerTransactionCardProps) {
  return (
    <article className="min-w-0 flex-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {transaction.itemImage ? (
            <Image
              src={transaction.itemImage}
              alt={transaction.mealName}
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-lg object-cover"
            />
          ) : null}
          <h3 className="text-base font-semibold text-foreground">
            {transaction.mealName}
          </h3>
        </div>
        <p className="text-sm font-semibold text-foreground">
          Amount Paid: {transaction.amountPaid}
        </p>
      </div>

      <div className="mt-5 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm font-medium text-primary">
            {transaction.orderNumber}
          </p>
          <div className={detailField}>
            <p className={detailLabel}>Customer Name</p>
            <p className={cn(detailValue, "font-medium")}>
              {transaction.customerName}
            </p>
          </div>
          <div className={detailField}>
            <p className={detailLabel}>Delivery Address</p>
            <p className={cn(detailValue, "font-medium")}>
              {transaction.deliveryAddress}
            </p>
          </div>
          <div className={detailField}>
            <p className={detailLabel}>Status</p>
            <Badge
              variant="secondary"
              className="h-8 rounded-full border-0 bg-[#E8F4FC] px-4 text-sm font-medium text-[#1E6BB8]"
            >
              {transaction.displayStatus}
            </Badge>
          </div>
          <div className={detailField}>
            <p className={detailLabel}>Name of Rider</p>
            <p className={cn(detailValue, "font-medium")}>
              {transaction.riderName}
            </p>
          </div>
          <div className={detailField}>
            <p className={detailLabel}>Customer Remark</p>
            <p className={cn(detailValue, "font-medium leading-none")}>
              {transaction.customerRemark}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className={detailField}>
            <p className={detailLabel}>Date and Time</p>
            <p className={cn(detailValue, "font-medium")}>
              {transaction.orderedAt}
            </p>
          </div>
          <div className={detailField}>
            <p className={detailLabel}>Payment Method</p>
            <div className="flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#F5A623] text-xs font-bold text-white">
                F
              </span>
              <p className={cn(detailValue, "font-medium")}>
                {transaction.paymentMethod}
              </p>
            </div>
          </div>
          <div className={detailField}>
            <p className={detailLabel}>Delivery Time</p>
            <p className={cn(detailValue, "font-medium")}>
              {transaction.deliveryTime}
            </p>
          </div>
          <div className={detailField}>
            <p className={detailLabel}>Customer&apos;s Review</p>
            <p className={cn(detailValue, "leading-relaxed")}>
              {transaction.customerReview}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-1.5">
        <p className={detailLabel}>Rider&apos;s Review</p>
        <p className={cn(detailValue, "leading-relaxed")}>
          {transaction.riderReview}
        </p>
      </div>
    </article>
  )
}
