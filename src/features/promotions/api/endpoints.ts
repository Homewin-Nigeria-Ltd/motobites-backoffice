const promotionsPath = "/admin/promotions-management"

export const promotionServerEndpoints = {
  offers: `${promotionsPath}/offers`,
  offer: (id: string | number) =>
    `${promotionsPath}/offers/${encodeURIComponent(String(id))}`,
  giftCards: `${promotionsPath}/gift-cards`,
  giftCard: (id: string | number) =>
    `${promotionsPath}/gift-cards/${encodeURIComponent(String(id))}`,
} as const

export const promotionEndpoints = {
  offers: `/api/proxy${promotionsPath}/offers`,
  offer: (id: string | number) =>
    `/api/proxy${promotionsPath}/offers/${encodeURIComponent(String(id))}`,
  giftCards: `/api/proxy${promotionsPath}/gift-cards`,
  giftCard: (id: string | number) =>
    `/api/proxy${promotionsPath}/gift-cards/${encodeURIComponent(String(id))}`,
} as const
