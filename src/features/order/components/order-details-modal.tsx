"use client"

import { useState, type ReactNode } from "react"
import Image from "next/image"

import type { Order, OrderStatus } from "@/features/order/types"
import { BaseModal } from "@/components/ui/base-modal"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "yet_to_be_prepared", label: "Yet to be prepared" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "in_transit", label: "In transit" },
  { value: "delivered", label: "Delivered" },
]

type OrderDetailsModalProps = {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function DetailField({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-muted-foreground">{label}</Label>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  )
}

function AssigneeRow({
  name,
  actionLabel,
}: {
  name: string
  actionLabel: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Avatar className="size-8">
        <AvatarFallback className="bg-primary text-xs text-primary-foreground">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <span className="font-medium">{name}</span>
      <Button type="button" variant="link" className="h-auto p-0 text-primary">
        {actionLabel}
      </Button>
    </div>
  )
}

export function OrderDetailsModal({
  order,
  open,
  onOpenChange,
}: OrderDetailsModalProps) {
  const [status, setStatus] = useState<OrderStatus | null>(null)

  if (!order) {
    return null
  }

  const currentStatus = status ?? order.status
  const statusLabel =
    statusOptions.find((option) => option.value === currentStatus)?.label ??
    order.statusLabel

  return (
    <BaseModal
      title="Order Details"
      open={open}
      onOpenChange={onOpenChange}
      layout="detail"
      size="xl"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-48">
          <Image
            src={order.imageUrl}
            alt={order.itemName}
            fill
            className="object-cover"
            sizes="192px"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <Badge
            variant="secondary"
            className="rounded-full border-0 bg-secondary px-3 py-1 text-xs font-medium text-primary"
          >
            Order #{order.orderNumber}
          </Badge>
          <h2 className="text-xl font-semibold text-foreground">{order.itemName}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {order.customerNotes}
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DetailField label="Customer Name">{order.customerName}</DetailField>
        <DetailField label="Delivery Address">{order.deliveryAddress}</DetailField>
        <DetailField label="Amount Paid">
          ₦{order.amountPaid.toLocaleString()}
        </DetailField>

        <DetailField label="Payment Method">
          <div className="space-y-1">
            <p className="font-medium">Flutterwave</p>
            <p className="text-muted-foreground">Online Method</p>
            <Button type="button" variant="link" className="h-auto p-0 text-primary">
              View Receipts
            </Button>
          </div>
        </DetailField>

        <DetailField label="Status">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-9 w-full justify-between bg-secondary/50 font-normal"
              >
                {statusLabel}
                <Icons.chevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setStatus(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </DetailField>

        <DetailField label="Assigned Chef">
          <AssigneeRow
            name={order.assignedChef.name}
            actionLabel="Change Assigned Chef"
          />
        </DetailField>

        <DetailField label="Estimated Preparation Time">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{order.estimatedPrepMinutes} Mins</span>
            <Button type="button" variant="link" className="h-auto p-0 text-primary">
              Increase by 5 minute
            </Button>
          </div>
        </DetailField>

        <DetailField label="Assigned MotoPolit (Rider)">
          <AssigneeRow
            name={order.assignedRider.name}
            actionLabel="Change Assigned Motopolit"
          />
        </DetailField>

        <DetailField label="Customer's Confirmation Code">
          <div className="flex gap-2">
            {order.confirmationCode.split("").map((digit, index) => (
              <span
                key={`${digit}-${index}`}
                className="flex size-10 items-center justify-center rounded-lg border-2 border-primary text-base font-semibold text-primary"
              >
                {digit}
              </span>
            ))}
          </div>
        </DetailField>

        <DetailField label="Pick-up Time">{order.pickupTime}</DetailField>
        <DetailField label="Delivery Time">{order.deliveryTime}</DetailField>

        <DetailField label="Assigned Customer Care Representative" className="sm:col-span-2">
          <AssigneeRow name={order.customerCareRep.name} actionLabel="Change" />
        </DetailField>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
        <div className="flex aspect-[21/9] items-center justify-center bg-foreground/90">
          <span className="rounded-lg bg-background px-6 py-2 text-lg font-semibold text-foreground">
            Closed
          </span>
        </div>
      </div>

      <div className="space-y-6 border-t border-border pt-6">
        <DetailField label="Customer's Review">
          <p className="leading-relaxed text-muted-foreground">
            {order.customerReview}
          </p>
        </DetailField>
        <DetailField label="Customer Remark">
          <span className="text-2xl">{order.customerRemark}</span>
        </DetailField>
        <DetailField label="Rider's Review">
          <p className="leading-relaxed text-muted-foreground">
            {order.riderReview}
          </p>
        </DetailField>
      </div>
    </BaseModal>
  )
}
