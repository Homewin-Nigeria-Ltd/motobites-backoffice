import {
  createCustomerGroupAction,
  updateCustomerGroupAction,
} from "../actions/customer-group.actions"
import {
  createGiftcardAction,
  updateGiftcardAction,
} from "../actions/giftcard.actions"
import {
  createOfferAction,
  deleteOfferAction,
  updateOfferAction,
} from "../actions/offer.actions"
import type {
  CustomerGroupInput,
  OfferInput,
  UpdateCustomerGroupInput,
  UpdateOfferInput,
} from "../types"

export const promotionMutations = {
  createOffer: {
    mutationFn: (input: OfferInput) => createOfferAction(input),
  },
  updateOffer: {
    mutationFn: ({ offerId, input }: UpdateOfferInput) =>
      updateOfferAction(offerId, input),
  },
  deleteOffer: {
    mutationFn: (offerId: string) => deleteOfferAction(offerId),
  },
  createGiftcard: {
    mutationFn: (formData: FormData) => createGiftcardAction(formData),
  },
  updateGiftcard: {
    mutationFn: ({ giftcardId, formData }: { giftcardId: string; formData: FormData }) =>
      updateGiftcardAction(giftcardId, formData),
  },
  createCustomerGroup: {
    mutationFn: (input: CustomerGroupInput) => createCustomerGroupAction(input),
  },
  updateCustomerGroup: {
    mutationFn: ({ groupId, input }: UpdateCustomerGroupInput) =>
      updateCustomerGroupAction(groupId, input),
  },
} as const
