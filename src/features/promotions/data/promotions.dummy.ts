import type { Giftcard, Offer } from "@/features/promotions/types"

export const DUMMY_OFFERS: Offer[] = [
  {
    id: "offer-1",
    title: "New Customer Offer",
    description: "15% off your first order",
    status: "active",
  },
  {
    id: "offer-2",
    title: "Bundle Discount",
    description: "20% off when you buy 3 or more items",
    status: "active",
  },
  {
    id: "offer-3",
    title: "Holiday Sale",
    description: "10% off for all customers",
    status: "inactive",
  },
  {
    id: "offer-4",
    title: "Shipping Discount",
    description: "Free shipping on orders over $50",
    status: "active",
  },
  {
    id: "offer-5",
    title: "Membership Offer",
    description: "30% off for premium members",
    status: "expired",
  },
]

export const DUMMY_GIFTCARDS: Giftcard[] = [
  {
    id: "giftcard-1",
    theme: "friendship",
    label: "Friendship",
    amount: 50_000,
  },
  {
    id: "giftcard-2",
    theme: "birthday",
    label: "Birthday",
    amount: 30_000,
  },
  {
    id: "giftcard-3",
    theme: "love",
    label: "I Love You",
    amount: 10_000,
  },
]
