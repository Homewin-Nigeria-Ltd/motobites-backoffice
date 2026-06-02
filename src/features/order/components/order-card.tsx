"use client"

import Image from "next/image"

import type { Order } from "@/features/order/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

type OrderCardProps = {
  order: Order
  onViewDetails: (order: Order) => void
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm text-muted-foreground">
      <span className="font-medium text-foreground">{label}:</span> {value}
    </p>
  )
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={order.imageUrl}
          alt={order.itemName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
      <CardContent className="flex flex-col gap-3 pt-4">
        <Badge
          variant="secondary"
          className="w-fit rounded-full border-0 bg-secondary px-3 py-1 text-xs font-medium text-primary"
        >
          Order #{order.orderNumber}
        </Badge>
        <h3 className="text-base font-semibold text-foreground">{order.itemName}</h3>
        <div className="space-y-1.5">
          <DetailRow label="Customer Name" value={order.customerName} />
          <DetailRow label="Delivery Address" value={order.deliveryAddress} />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <DetailRow label="Payment Method" value={order.paymentMethod} />
          <DetailRow
            label="Amount Paid"
            value={`₦${order.amountPaid.toLocaleString()}`}
          />
        </div>
        <Badge
          variant="secondary"
          className="w-fit rounded-full border-0 bg-secondary px-3 py-1 text-xs font-medium text-primary"
        >
          {order.statusLabel}
        </Badge>
      </CardContent>
      <CardFooter className="pt-4 pb-5">
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-primary"
          onClick={() => onViewDetails(order)}
        >
          View Order Details
          <Icons.arrowForward size={16} className="ml-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}
