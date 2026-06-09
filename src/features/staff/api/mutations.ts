import {
  inviteStaffAction,
  removeStaffAction,
  toggleStaffFavoriteAction,
  updateStaffAction,
} from "../actions/staff-member.actions"
import type { InviteStaffInput, UpdateStaffInput } from "../types"

export const staffMutations = {
  invite: {
    mutationFn: (input: InviteStaffInput) => inviteStaffAction(input),
  },

  update: {
    mutationFn: (input: UpdateStaffInput) => updateStaffAction(input),
  },

  remove: {
    mutationFn: (id: string) => removeStaffAction(id),
  },

  toggleFavorite: {
    mutationFn: (id: string) => toggleStaffFavoriteAction(id),
  },
} as const
