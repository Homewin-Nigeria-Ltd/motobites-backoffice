import type { SalesExecutiveListParams } from "../types"

export const salesExecutiveKeys = {
  all: ["sales-executives"] as const,
  lists: () => [...salesExecutiveKeys.all, "list"] as const,
  list: (params: SalesExecutiveListParams) =>
    [...salesExecutiveKeys.lists(), params] as const,
  application: (id: number) =>
    [...salesExecutiveKeys.all, "application", id] as const,
}
