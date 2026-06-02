import { mealPlaceholderImage } from "@/lib/placeholder-image"
import type { Menu, OpeningHoursRow, Restaurant } from "../types"

const lorem =
  "Reminisce home-made goodness at its finest with authentic flavours and warm hospitality."

const defaultTags = ["spicy", "Nigerian Food", "Firewood rice", "Local Dish"]

export const defaultOpeningHours: OpeningHoursRow[] = [
  { id: "mon", day: "Monday", startTime: "8:00 Am", endTime: "9:00 Pm" },
  { id: "tue", day: "Tuesday", startTime: "8:00 Am", endTime: "9:00 Pm" },
  { id: "wed", day: "Wednesday", startTime: "8:00 Am", endTime: "9:00 Pm" },
  { id: "thu", day: "Thursday", startTime: "8:00 Am", endTime: "9:00 Pm" },
  { id: "fri", day: "Friday", startTime: "8:00 Am", endTime: "9:00 Pm" },
  { id: "sat", day: "Saturday", startTime: "8:00 Am", endTime: "9:00 Pm" },
]

function createMenus(prefix: string, count: number): Menu[] {
  const names = [
    "Jollof Rice and Chicken",
    "Pancake Breakfast",
    "Egusi Soup with Pounded Yam",
    "Suya Platter",
    "Fried Rice Special",
    "Pepper Soup",
    "Ofada Rice & Sauce",
    "Grilled Fish & Plantain",
  ]

  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-menu-${index}`,
    name: names[index % names.length],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    price: 2500,
    durationMinutes: 20,
    imageUrl: mealPlaceholderImage,
    enabled: true,
  }))
}

const restaurantNames = [
  "Panda Palace (Chinese)",
  "Hometown Eat Hub",
  "Nobbles Hub",
  "Mama Put Restaurant",
  "God is Good Restaurant",
  "Chinese World",
  "Egbon Adugbo Abbatoir",
  "Spice Route",
]

const restaurantHubIds = [
  "chinese",
  "hometown",
  "nobbles",
  "mama-put",
  "god-is-good",
  "chinese",
  "egbon",
  "nobbles",
] as const

export const restaurantsMock: Restaurant[] = restaurantNames.map((name, index) => {
  const id = `restaurant-${index + 1}`
  const hubId = restaurantHubIds[index]

  return {
    id,
    name,
    description: lorem,
    imageUrl: mealPlaceholderImage,
    tags: defaultTags,
    openingHours: defaultOpeningHours.map((row) => ({
      ...row,
      id: `${row.id}-${index}`,
    })),
    hubId,
    menus: createMenus(id, 8),
  }
})
