import {
  deactivateCustomerAction,
  deleteCustomerAction,
  increaseCnplEligibilityAction,
  suspendCustomerAction,
} from "../actions/customer.actions"

export const customerMutations = {
  delete: {
    mutationFn: (id: string) => deleteCustomerAction(id),
  },

  suspend: {
    mutationFn: (id: string) => suspendCustomerAction(id),
  },

  deactivate: {
    mutationFn: (id: string) => deactivateCustomerAction(id),
  },

  increaseCnplEligibility: {
    mutationFn: increaseCnplEligibilityAction,
  },
} as const
