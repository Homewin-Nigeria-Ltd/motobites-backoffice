import { api } from "@/lib/api/client"

import type {
  ReviewSalesExecutiveInput,
  SetSalesExecutiveTargetsInput,
  UpdateSalesExecutiveStatusInput,
} from "../types"
import { salesExecutiveEndpoints } from "./endpoints"

export const salesExecutiveMutations = {
  review: {
    mutationFn: ({ id, status, review_notes }: ReviewSalesExecutiveInput) =>
      api.patch(salesExecutiveEndpoints.review(id), {
        status,
        ...(review_notes ? { review_notes } : {}),
      }),
  },
  setTargets: {
    mutationFn: (input: SetSalesExecutiveTargetsInput) =>
      api.put(salesExecutiveEndpoints.targets, {
        month: input.month,
        target: input.target,
        ...(input.all_agents ? { all_agents: true } : { agent_id: input.agent_id }),
        ...(input.note?.trim() ? { note: input.note.trim() } : {}),
      }),
  },
  updateStatus: {
    mutationFn: ({ id, status }: UpdateSalesExecutiveStatusInput) =>
      api.patch(salesExecutiveEndpoints.status(id), { status }),
  },
} as const
