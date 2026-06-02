export const orderKeys = {
  all: ["orders"] as const,
  hubs: () => [...orderKeys.all, "hubs"] as const,
}
