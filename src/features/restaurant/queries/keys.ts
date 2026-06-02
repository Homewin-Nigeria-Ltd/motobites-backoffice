export const restaurantKeys = {
  all: ["restaurants"] as const,
  lists: () => [...restaurantKeys.all, "list"] as const,
  hubs: () => [...restaurantKeys.all, "hubs"] as const,
  detail: (id: string) => [...restaurantKeys.all, "detail", id] as const,
}
