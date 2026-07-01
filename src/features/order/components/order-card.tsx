"use client"

import Image from "next/image"

import type { ApiOrder } from "@/features/order/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { toImageSrc } from "@/lib/image-url"

type OrderCardProps = {
  order: ApiOrder
  onViewDetails: (order: ApiOrder) => void
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
          src={toImageSrc(order.item_image)}
          alt={order.item_name}
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
          Order {order.order_number}
        </Badge>
        <h3 className="text-base font-semibold text-foreground">{order.item_name}</h3>
        <div className="space-y-1.5">
          <DetailRow label="Customer Name" value={order.customer_name} />
          <DetailRow label="Delivery Address" value={order.delivery_address} />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <DetailRow label="Payment Method" value={order.payment_method} />
          <DetailRow label="Amount Paid" value={order.amount_paid_formatted} />
        </div>
        <Badge
          variant="secondary"
          className="w-fit rounded-full border-0 bg-secondary px-3 py-1 text-xs font-medium text-primary"
        >
          {order.display_status}
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
