"use client"

import { useOrderReceipt } from "@/features/order/hooks/use-order-queries"
import { formatKoboAmount } from "@/features/order/utils/currency"
import { formatDate } from "@/features/order/utils/date"
import { BaseModal } from "@/components/ui/base-modal"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { AppLoader } from "@/components/ui/app-loader"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

const fieldLabel = "text-sm font-normal text-muted-foreground"
const fieldValue = "text-sm font-medium text-foreground"
const detailGrid2 =
  "grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6"

type ReceiptFieldProps = {
  label: string
  value: string
  mono?: boolean
}

function ReceiptField({ label, value, mono }: ReceiptFieldProps) {
  return (
    <div className="min-w-0 space-y-1.5">
      <Label className={fieldLabel}>{label}</Label>
      <p
        className={cn(
          fieldValue,
          mono ? "break-all font-mono text-xs sm:text-sm" : "break-words"
        )}
      >
        {value}
      </p>
    </div>
  )
}

type OrderReceiptModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
}

export function OrderReceiptModal({
  open,
  onOpenChange,
  orderId,
}: OrderReceiptModalProps) {
  const { data: receipt, isPending, isError } = useOrderReceipt(orderId, open)

  const gateway = receipt?.gateway_response
  const authorization = gateway?.authorization
  const customer = gateway?.customer

  return (
    <BaseModal
      title="Payment Receipt"
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      headerIcon={<Icons.fileText size={28} className="text-primary" />}
      bodyClassName="max-h-[min(70vh,28rem)] overflow-y-auto overscroll-contain max-sm:max-h-[70dvh]"
    >
      {isPending ? (
        <AppLoader className="py-10" spinnerClassName="size-6" />
      ) : isError || !receipt ? (
        <p className="text-center text-sm text-destructive">
          Failed to load payment receipt. Please try again.
        </p>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Badge
              variant="secondary"
              className="w-fit rounded-full border-0 bg-secondary px-3 py-1 text-xs font-medium capitalize text-primary"
            >
              {receipt.status}
            </Badge>
            <span className="min-w-0 text-sm break-words text-muted-foreground">
              {gateway?.gateway_response ?? receipt.channel}
            </span>
          </div>

          <div className={detailGrid2}>
            <ReceiptField
              label="Amount"
              value={formatKoboAmount(
                receipt.amount_kobo,
                gateway?.currency ?? "NGN"
              )}
            />
            <ReceiptField
              label="Paid at"
              value={formatDate(receipt.paid_at)}
            />
            <ReceiptField
              label="Reference"
              value={receipt.reference}
              mono
            />
            <ReceiptField
              label="Channel"
              value={receipt.channel}
            />
            <ReceiptField
              label="Transaction ID"
              value={String(gateway?.id ?? "—")}
            />
            <ReceiptField
              label="Fees"
              value={
                gateway?.fees != null
                  ? formatKoboAmount(gateway.fees, gateway.currency)
                  : "—"
              }
            />
          </div>

          <div className="space-y-4 border-t border-border pt-5 sm:pt-6">
            <p className="text-sm font-medium text-foreground">Card details</p>
            <div className={detailGrid2}>
              <ReceiptField
                label="Card"
                value={
                  authorization
                    ? `${authorization.brand.trim()} •••• ${authorization.last4}`
                    : "—"
                }
              />
              <ReceiptField
                label="Card type"
                value={authorization?.card_type?.trim() ?? "—"}
              />
              <ReceiptField label="Bank" value={authorization?.bank ?? "—"} />
              <ReceiptField
                label="Expires"
                value={
                  authorization
                    ? `${authorization.exp_month}/${authorization.exp_year}`
                    : "—"
                }
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-5 sm:pt-6">
            <p className="text-sm font-medium text-foreground">Customer</p>
            <div className={detailGrid2}>
              <ReceiptField
                label="Email"
                value={customer?.email ?? "—"}
                mono
              />
              <ReceiptField
                label="Customer code"
                value={customer?.customer_code ?? "—"}
                mono
              />
            </div>
          </div>
        </div>
      )}
    </BaseModal>
  )
}
