const supportChatsPath = "/admin/support/chats"

export const customerChatEndpoints = {
  chats: `/api/proxy${supportChatsPath}`,
  chat: (id: string) => `/api/proxy${supportChatsPath}/${encodeURIComponent(id)}`,
  messages: (id: string) =>
    `/api/proxy${supportChatsPath}/${encodeURIComponent(id)}/messages`,
  close: (id: string) =>
    `/api/proxy${supportChatsPath}/${encodeURIComponent(id)}/close`,
} as const
