import { z } from "zod/v3"

export const inventoryItemFormSchema = z.object({
  name: z.string().trim().min(1, "Item name is required"),
  description: z.string(),
  amount: z.number().min(0, "Amount is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  category: z.string().min(1, "Category is required"),
  stock_level: z.enum(["high", "medium", "low"]),
})

export type InventoryItemFormValues = z.infer<typeof inventoryItemFormSchema>

export const inventoryItemFormDefaults: InventoryItemFormValues = {
  name: "",
  description: "",
  amount: 0,
  quantity: 100,
  category: "",
  stock_level: "high",
}
