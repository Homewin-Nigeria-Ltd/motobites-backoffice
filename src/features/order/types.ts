export const orderTabs = [
  "pending",
  "processing",
  "transit",
  "completed",
  "performance",
] as const

export type OrderTab = (typeof orderTabs)[number]

export type OrderStatus =
  | "yet_to_be_prepared"
  | "preparing"
  | "ready"
  | "in_transit"
  | "delivered"

export type OrderAssignee = {
  name: string
  avatarUrl?: string
}

export type Order = {
  id: string
  orderNumber: string
  tab: Exclude<OrderTab, "performance">
  itemName: string
  imageUrl: string
  customerName: string
  deliveryAddress: string
  paymentMethod: string
  amountPaid: number
  status: OrderStatus
  statusLabel: string
  hubId: string
  customerNotes: string
  assignedChef: OrderAssignee
  assignedRider: OrderAssignee
  customerCareRep: OrderAssignee
  estimatedPrepMinutes: number
  confirmationCode: string
  pickupTime: string
  deliveryTime: string
  customerReview: string
  customerRemark: string
  riderReview: string
}

export type OrderHub = {
  id: string
  name: string
  orders: Order[]
}
