import { mealPlaceholderImage } from "@/lib/placeholder-image"
import type { Order, OrderHub } from "../types"

const baseOrder = {
  itemName: "Jollof Rice and Chicken",
  imageUrl: mealPlaceholderImage,
  customerName: "Oluwanifemi Osunsanya",
  deliveryAddress: "14B Milverton Road, Ikoyi, Lagos, Nigeria",
  paymentMethod: "Transfer",
  amountPaid: 2500,
  customerNotes:
    "Please make the jollof extra spicy 🌶️. Leave at the gate if no one answers. Call when you arrive.",
  assignedChef: { name: "Oluwatobi Oluwafemi" },
  assignedRider: { name: "Ogabi Michel" },
  customerCareRep: { name: "Pelumi Adesokan" },
  estimatedPrepMinutes: 20,
  confirmationCode: "2943",
  pickupTime: "2:30 PM",
  deliveryTime: "2:43 PM",
  customerReview:
    "The food arrived hot and tasted amazing. Packaging was neat and the rider was polite. Will order again!",
  customerRemark: "😍",
  riderReview:
    "Smooth delivery. Customer was reachable and the pickup from the kitchen was quick.",
}

function createOrder(
  id: string,
  orderNumber: string,
  tab: Order["tab"],
  status: Order["status"],
  statusLabel: string,
  hubId: string
): Order {
  return {
    id,
    orderNumber,
    tab,
    hubId,
    status,
    statusLabel,
    ...baseOrder,
  }
}

const hometownOrders: Order[] = Array.from({ length: 24 }, (_, index) =>
  createOrder(
    `he-${index + 1}`,
    String(223459 + index),
    "pending",
    "yet_to_be_prepared",
    "yet to be prepared",
    "hometown-eats"
  )
)

const urbanBiteOrders: Order[] = Array.from({ length: 4 }, (_, index) =>
  createOrder(
    `ub-${index + 1}`,
    `2234${60 + index}`,
    index % 2 === 0 ? "processing" : "transit",
    index % 2 === 0 ? "preparing" : "in_transit",
    index % 2 === 0 ? "preparing" : "in transit",
    "urban-bites"
  )
)

export const orderHubsMock: OrderHub[] = [
  { id: "hometown-eats", name: "Hometown Eats Hub", orders: hometownOrders },
  { id: "urban-bites", name: "Urban Bites Hub", orders: urbanBiteOrders },
]

const allOrders = orderHubsMock.flatMap((hub) => hub.orders)

export const orderTabCounts: Record<
  Exclude<Order["tab"], never> | "performance",
  number
> = {
  pending: allOrders.filter((o) => o.tab === "pending").length,
  processing: allOrders.filter((o) => o.tab === "processing").length,
  transit: allOrders.filter((o) => o.tab === "transit").length,
  completed: 0,
  performance: 0,
}
