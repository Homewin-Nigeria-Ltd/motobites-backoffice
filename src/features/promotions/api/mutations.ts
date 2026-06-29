import {
  createGiftcardAction,
  updateGiftcardAction,
} from "../actions/giftcard.actions"
import {
  createOfferAction,
  updateOfferAction,
} from "../actions/offer.actions"
import type { OfferInput, UpdateOfferInput } from "../types"

export const promotionMutations = {
  createOffer: {
    mutationFn: (input: OfferInput) => createOfferAction(input),
  },
  updateOffer: {
    mutationFn: ({ offerId, input }: UpdateOfferInput) =>
      updateOfferAction(offerId, input),
  },
  createGiftcard: {
    mutationFn: (formData: FormData) => createGiftcardAction(formData),
  },
  updateGiftcard: {
    mutationFn: ({ giftcardId, formData }: { giftcardId: string; formData: FormData }) =>
      updateGiftcardAction(giftcardId, formData),
  },
} as const
