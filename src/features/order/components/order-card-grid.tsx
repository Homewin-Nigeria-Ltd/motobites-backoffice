"use client"

import { OrderCard } from "./order-card"
import type { ApiOrder } from "../types"

type OrderCardGridProps = {
  orders: ApiOrder[]
  onViewDetails: (order: ApiOrder) => void
}

export function OrderCardGrid({ orders, onViewDetails }: OrderCardGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  )
}
