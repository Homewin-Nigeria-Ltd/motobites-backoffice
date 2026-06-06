"use client"

import { useState } from "react"
import Image from "next/image"

import { OrderAssigneeDialog } from "@/features/order/components/order-assignee-dialog"
import { OrderAssigneeField } from "@/features/order/components/order-assignee-field"
import { OrderReceiptModal } from "@/features/order/components/order-receipt-modal"
import {
  useExtendPrepTime,
  useUpdateOrderStatus,
} from "@/features/order/hooks/use-order-mutations"
import { useOrderDetail } from "@/features/order/hooks/use-order-queries"
import type { OrderAssigneeType } from "@/features/order/types"
import {
  ORDER_STATUS_LABELS,
  OrderStatus,
} from "@/features/order/enums/order-status"
import {
  formatOrderReviewRemark,
  formatOrderReviewText,
  getOrderDetailStatusLabel,
} from "@/features/order/utils/order-detail"
import { BaseModal } from "@/components/ui/base-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { AppLoader } from "@/components/ui/app-loader"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { OrderMap } from "@/features/order/components/order-map"
import { getOrderMapCoordinates } from "@/features/order/utils/coordinates"
import { toImageSrc } from "@/lib/image-url"

const ADMIN_STATUS_OPTIONS = [
  OrderStatus.PREPARING,
  OrderStatus.PICKED_UP,
] as const

const detailGrid3 = "grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-3"
const detailGrid2 = "grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2"
const detailField = "min-w-0 space-y-2"
const detailLabel = "text-sm font-normal text-muted-foreground"
const detailValue = "text-sm text-foreground"
const actionLink =
  "h-auto p-0 text-sm font-medium text-primary underline-offset-4 hover:underline"

type OrderDetailsModalProps = {
  orderId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsModal({
  orderId,
  open,
  onOpenChange,
}: OrderDetailsModalProps) {
  const { data: order, isPending, isError, error } = useOrderDetail(
    orderId,
    open
  )
  const { updateStatus, isPending: isUpdatingStatus } = useUpdateOrderStatus()
  const { extendPrepTime, isPending: isExtendingPrepTime } = useExtendPrepTime()
  const [assigneeDialogType, setAssigneeDialogType] =
    useState<OrderAssigneeType | null>(null)
  const [receiptOpen, setReceiptOpen] = useState(false)

  if (!open || !orderId) {
    return null
  }

  if (isError) {
    throw error
  }

  const modalProps = {
    title: "Order Details",
    open,
    onOpenChange,
    layout: "detail" as const,
    size: "xl" as const,
    className: "max-w-[43.75rem]",
    bodyClassName: "font-ui",
  }

  if (isPending || !order) {
    return (
      <BaseModal {...modalProps}>
        <AppLoader className="min-h-64" />
      </BaseModal>
    )
  }

  const mapCoords = getOrderMapCoordinates(order.map)
  const statusLabel = getOrderDetailStatusLabel(order.status, order.display_status)
  const customerRemark = formatOrderReviewRemark(order.reviews.customer)

  const currentAssigneeId =
    assigneeDialogType != null
      ? order.assignments[assigneeDialogType]?.id ?? null
      : null

  return (
    <>
    <BaseModal {...modalProps}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-36 sm:w-44">
          <Image
            src={toImageSrc(order.item.image)}
            alt={order.item.name}
            fill
            className="object-cover"
            sizes="176px"
            priority
          />
        </div>
        <div className="min-w-0 flex-1 space-y-2.5">
          <Badge
            variant="secondary"
            className="w-fit rounded-full border-0 bg-secondary px-3 py-1 text-xs font-medium text-primary"
          >
            Order {order.order_number}
          </Badge>
          <h2 className="text-xl font-semibold leading-tight text-foreground">
            {order.item.name}
          </h2>
          {order.customer_note ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {order.customer_note}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className={detailGrid3}>
          <div className={detailField}>
            <Label className={detailLabel}>Customer Name</Label>
            <p className={cn(detailValue, "font-medium")}>{order.customer_name}</p>
          </div>
          <div className={detailField}>
            <Label className={detailLabel}>Delivery Address</Label>
            <p className={cn(detailValue, "font-medium")}>{order.delivery_address}</p>
          </div>
          <div className={detailField}>
            <Label className={detailLabel}>Amount Paid</Label>
            <p className={cn(detailValue, "font-medium")}>{order.amount_paid_formatted}</p>
          </div>
        </div>

        <div className={detailGrid2}>
          <div className={detailField}>
            <Label className={detailLabel}>Payment Method</Label>
            <div className={cn(detailValue, "space-y-1.5")}>
              <p className="font-medium">{order.payment.method}</p>
              {order.payment.receipt_available ? (
                <Button
                  type="button"
                  variant="link"
                  className={actionLink}
                  onClick={() => setReceiptOpen(true)}
                >
                  View Receipt
                </Button>
              ) : null}
            </div>
          </div>
          <div className={detailField}>
            <Label className={detailLabel}>Status</Label>
            <div className={cn(detailValue, "flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center")}>
              <Badge
                variant="secondary"
                className="h-9 min-w-40 rounded-full border-0 bg-[#E8F4FC] px-4 text-sm font-medium text-[#1E6BB8]"
              >
                {statusLabel}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUpdatingStatus}
                    className="h-9 w-fit gap-2 rounded-lg border-border bg-background px-4 font-normal shadow-none"
                  >
                    {isUpdatingStatus ? "Updating…" : "Update status"}
                    <Icons.chevronDown size={16} className="opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {ADMIN_STATUS_OPTIONS.map((value) => (
                    <DropdownMenuItem
                      key={value}
                      disabled={isUpdatingStatus || order.status === value}
                      onClick={() => {
                        if (!orderId || order.status === value) return
                        updateStatus({ orderId, status: value })
                      }}
                    >
                      {ORDER_STATUS_LABELS[value]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className={detailGrid2}>
          <div className={detailField}>
            <Label className={detailLabel}>Assigned Chef</Label>
            <div className={detailValue}>
              <OrderAssigneeField
                assignee={order.assignments.chef}
                assignLabel="Assign Chef"
                changeLabel="Change Assigned Chef"
                onChangeClick={() => setAssigneeDialogType("chef")}
              />
            </div>
          </div>
          <div className={detailField}>
            <Label className={detailLabel}>Estimated Preparation Time</Label>
            <div className={cn(detailValue, "flex flex-wrap items-center gap-x-2 gap-y-1")}>
              <span className="font-medium">
                {order.timing.estimated_preparation_minutes} Mins
              </span>
              <Button
                type="button"
                variant="link"
                className={actionLink}
                disabled={isExtendingPrepTime}
                onClick={() => extendPrepTime({ orderId })}
              >
                {isExtendingPrepTime ? "Extending…" : "Increase by 5 minute"}
              </Button>
            </div>
          </div>
        </div>

        <div className={detailGrid2}>
          <div className={detailField}>
            <Label className={detailLabel}>Assigned MotoPolit (Rider)</Label>
            <div className={detailValue}>
              <OrderAssigneeField
                assignee={order.assignments.rider}
                assignLabel="Assign MotoPilot"
                changeLabel="Change Assigned Motopolit"
                onChangeClick={() => setAssigneeDialogType("rider")}
              />
            </div>
          </div>
          <div className={detailField}>
            <Label className={detailLabel}>Customer&apos;s Confirmation Code</Label>
            <div className={cn(detailValue, "flex gap-2")}>
              {order.confirmation_code_digits.map((digit, index) => (
                <span
                  key={`${digit}-${index}`}
                  className="flex size-11 items-center justify-center rounded-lg border-2 border-primary bg-primary text-lg font-semibold text-primary-foreground"
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={detailGrid2}>
          <div className={detailField}>
            <Label className={detailLabel}>Pick-up Time</Label>
            <p className={cn(detailValue, "font-medium")}>
              {order.timing.pickup_time ?? "—"}
            </p>
          </div>
          <div className={detailField}>
            <Label className={detailLabel}>Delivery Time</Label>
            <p className={cn(detailValue, "font-medium")}>
              {order.timing.delivered_at ?? "—"}
            </p>
          </div>
        </div>

        <div className={detailField}>
          <Label className={detailLabel}>Assigned Customer Care Representative</Label>
          <div className={detailValue}>
            <OrderAssigneeField
              assignee={order.assignments.support}
              assignLabel="Assign Representative"
              changeLabel="Change"
              onChangeClick={() => setAssigneeDialogType("support")}
            />
          </div>
        </div>
      </div>

      <OrderMap
        kitchen={mapCoords.kitchen}
        customer={mapCoords.customer}
        height="220px"
        className="w-full"
      />

      <div className="grid grid-cols-1 gap-8 border-t border-border pt-8 md:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div className={detailField}>
            <Label className={detailLabel}>Customer&apos;s Review</Label>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {formatOrderReviewText(order.reviews.customer)}
            </p>
          </div>
          <div className={detailField}>
            <Label className={detailLabel}>Rider&apos;s Review</Label>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {formatOrderReviewText(order.reviews.rider)}
            </p>
          </div>
        </div>
        <div className={detailField}>
          <Label className={detailLabel}>Customer Remark</Label>
          {customerRemark ? (
            <span className="text-3xl leading-none">{customerRemark}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      </div>
    </BaseModal>

    {assigneeDialogType ? (
      <OrderAssigneeDialog
        open
        onOpenChange={(next) => {
          if (!next) setAssigneeDialogType(null)
        }}
        orderId={orderId}
        type={assigneeDialogType}
        currentAssigneeId={currentAssigneeId}
      />
    ) : null}

    <OrderReceiptModal
      open={receiptOpen}
      onOpenChange={setReceiptOpen}
      orderId={orderId}
    />
    </>
  )
}
