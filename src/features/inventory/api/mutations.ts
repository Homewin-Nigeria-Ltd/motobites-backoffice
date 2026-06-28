import {
  createInventoryItemAction,
  updateInventoryItemAction,
} from "../actions/inventory-item.actions"

export const inventoryMutations = {
  createItem: {
    mutationFn: (formData: FormData) => createInventoryItemAction(formData),
  },
  updateItem: {
    mutationFn: ({
      itemId,
      formData,
    }: {
      itemId: number
      formData: FormData
    }) => updateInventoryItemAction(itemId, formData),
  },
} as const
