export const riderChatEndpoints = {
  conversations: "/api/proxy/admin/delivery-management/support/conversations",
  messages: (riderId: string | number) =>
    `/api/proxy/admin/delivery-management/support/conversations/${encodeURIComponent(String(riderId))}/messages`,
} as const
