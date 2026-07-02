import {
  inviteStaffAction,
  removeStaffAction,
  toggleStaffFavoriteAction,
  updateStaffAction,
  updateStaffStatusAction,
} from "../actions/staff-member.actions"
import type {
  InviteStaffInput,
  UpdateStaffInput,
  UpdateStaffStatusInput,
} from "../types"

export const staffMutations = {
  invite: {
    mutationFn: (input: InviteStaffInput) => inviteStaffAction(input),
  },

  update: {
    mutationFn: (input: UpdateStaffInput) => updateStaffAction(input),
  },

  updateStatus: {
    mutationFn: (input: UpdateStaffStatusInput) =>
      updateStaffStatusAction(input),
  },

  remove: {
    mutationFn: (id: string) => removeStaffAction(id),
  },

  toggleFavorite: {
    mutationFn: (id: string) => toggleStaffFavoriteAction(id),
  },
} as const
