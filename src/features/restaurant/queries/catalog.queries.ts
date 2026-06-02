import { mealPlaceholderImage } from "@/lib/placeholder-image"
import type { FeedbackTag, Hub, Menu, MenuDetailItem } from "../types"

export const HUB_TAB_ALL = "All"

export const hubTabs = [
  HUB_TAB_ALL,
  "Hometown Eats Hub",
  "Nobbles Hub",
  "Mama Put",
  "God is Good Kitchen",
  "Egbon Adugbo Abbatoir",
  "Chinese World",
] as const

export const restaurantOptions = [
  "God is Good Kitchen",
  "Hometown Eats Hub",
  "Nobbles Hub",
  "Mama Put",
  "Egbon Adugbo Abbatoir",
  "Chinese World",
]

export const defaultMenuTags = [
  "spicy",
  "Jollof",
  "Firewood rice",
  "Local Dish",
  "Nigerian Food",
]

export const defaultMenuAvailability = [
  { id: "mon", day: "Monday", startTime: "8:00 Am", endTime: "9:00 Pm" },
  { id: "tue", day: "Tuesday", startTime: "8:00 Am", endTime: "9:00 Pm" },
  { id: "wed", day: "Wednesday", startTime: "8:00 Am", endTime: "9:00 Pm" },
  { id: "thu", day: "Thursday", startTime: "8:00 Am", endTime: "9:00 Pm" },
  { id: "fri", day: "Friday", startTime: "8:00 Am", endTime: "9:00 Pm" },
  { id: "sat", day: "Saturday", startTime: "8:00 Am", endTime: "9:00 Pm" },
]

const menuNames = [
  "Jollof Rice and Chicken",
  "Egusi Soup with Pounded Yam",
  "Suya Platter",
  "Fried Rice Special",
  "Pepper Soup",
  "Ofada Rice & Sauce",
  "Moi Moi Combo",
  "Grilled Fish & Plantain",
]

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."

function createMenus(prefix: string, count: number): Menu[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i}`,
    name: menuNames[i % menuNames.length],
    description: lorem,
    price: 2500,
    durationMinutes: 20,
    imageUrl: mealPlaceholderImage,
    enabled: true,
  }))
}

export const hubs: Hub[] = [
  { id: "hometown", name: "Hometown Eats Hub", menus: createMenus("hometown", 8) },
  { id: "nobbles", name: "Nobbles Hub", menus: createMenus("nobbles", 8) },
  { id: "mama-put", name: "Mama Put", menus: createMenus("mama-put", 8) },
  { id: "god-is-good", name: "God is Good Kitchen", menus: createMenus("god-is-good", 8) },
  { id: "egbon", name: "Egbon Adugbo Abbatoir", menus: createMenus("egbon", 4) },
  { id: "chinese", name: "Chinese World", menus: createMenus("chinese", 4) },
]

export const complimentTags: FeedbackTag[] = [
  { label: "Food Quality", count: 83 },
  { label: "Service Excellence", count: 14 },
  { label: "Special Dietary Accommodations", count: 92 },
  { label: "Consistency in Quality", count: 83 },
  { label: "Ambiance and Atmosphere", count: 11 },
  { label: "Value for Money", count: 7 },
  { label: "Innovative Menu Items", count: 5 },
  { label: "Efficient Order Processing", count: 9 },
  { label: "Friendly Staff", count: 12 },
  { label: "Cleanliness and Hygiene", count: 15 },
  { label: "Quick Response to Feedback", count: 6 },
  { label: "Seasonal Menu Updates", count: 4 },
  { label: "Online Ordering Experience", count: 8 },
  { label: "Loyalty Program Benefits", count: 10 },
  { label: "Community Engagement", count: 3 },
  { label: "Sustainability Practices", count: 2 },
  { label: "Catering Services", count: 5 },
  { label: "Event Hosting Capabilities", count: 1 },
  { label: "Takeout Packaging Quality", count: 4 },
  { label: "Delivery Accuracy", count: 6 },
]

export const improvementTags: FeedbackTag[] = [
  { label: "Speed of Service", count: 3 },
  { label: "Menu Clarity", count: 4 },
  { label: "Promotion Clarity", count: 92 },
  { label: "Consistency Across Dishes", count: 83 },
  { label: "Staff Training", count: 11 },
  { label: "Wait Times During Peak Hours", count: 7 },
  { label: "Portion Sizes", count: 5 },
  { label: "Pricing Transparency", count: 9 },
  { label: "Reservation System", count: 12 },
  { label: "Noise Levels", count: 15 },
  { label: "Parking Availability", count: 6 },
  { label: "Accessibility Features", count: 4 },
  { label: "Allergen Information", count: 8 },
  { label: "Payment Options", count: 10 },
  { label: "Restroom Cleanliness", count: 3 },
  { label: "Outdoor Seating Comfort", count: 2 },
  { label: "Social Media Engagement", count: 5 },
  { label: "Feedback Collection Methods", count: 1 },
  { label: "Seasonal Ingredient Availability", count: 4 },
  { label: "Waste Reduction Practices", count: 6 },
]

export const menuDetailItems: MenuDetailItem[] = [
  {
    id: "1",
    hub: "Hometown Eats Hub",
    name: "Ofada Tuntun",
    description: lorem,
    imageUrl: mealPlaceholderImage,
    rating: 4,
    itemsSold: 20,
    reviewCount: 20,
    itemErrors: 0,
    isPopular: true,
  },
  {
    id: "2",
    hub: "Hometown Eats Hub",
    name: "Pancakes",
    description: lorem,
    imageUrl: mealPlaceholderImage,
    rating: 4,
    itemsSold: 20,
    reviewCount: 20,
    itemErrors: 0,
    isPopular: true,
  },
  {
    id: "3",
    hub: "Hometown Eats Hub",
    name: "Jollof Rice and Chicken",
    description: lorem,
    imageUrl: mealPlaceholderImage,
    rating: 4,
    itemsSold: 20,
    reviewCount: 20,
    itemErrors: 0,
    isPopular: true,
  },
]

export function getHubById(hubId: string) {
  return hubs.find((hub) => hub.id === hubId)
}

export function getHubNameById(hubId: string) {
  return getHubById(hubId)?.name
}

export function getHubIdByName(name: string) {
  return hubs.find((hub) => hub.name === name)?.id
}

export function getMenuById(menuId: string) {
  for (const hub of hubs) {
    const menu = hub.menus.find((m) => m.id === menuId)
    if (menu) return { menu, hub }
  }
  return undefined
}

export function getMenuNameById(menuId: string) {
  return getMenuById(menuId)?.menu.name
}

export function buildMenuItemHref(menuId: string, hubId?: string) {
  const path = `/menu/catalog/${encodeURIComponent(menuId)}`
  if (!hubId) return path
  return `${path}?hub=${encodeURIComponent(hubId)}`
}
