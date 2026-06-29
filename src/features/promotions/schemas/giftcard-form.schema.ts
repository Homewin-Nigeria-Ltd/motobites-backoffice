import { z } from "zod/v3"

import { giftcardCategoryOptions } from "../constants"

const giftcardCategories = giftcardCategoryOptions.map((option) => option.value)

export const giftcardFormSchema = z.object({
  themeName: z.string().trim().min(1, "Theme name is required"),
  name: z.string().trim().min(1, "Name is required"),
  title: z.string().trim().min(1, "Title is required"),
  category: z
    .string()
    .min(1, "Category is required")
    .refine(
      (value) => giftcardCategories.includes(value as (typeof giftcardCategories)[number]),
      "Select a valid category"
    ),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  isActive: z.boolean(),
})

export type GiftcardFormValues = z.infer<typeof giftcardFormSchema>

export const giftcardFormDefaults: GiftcardFormValues = {
  themeName: "",
  name: "",
  title: "",
  category: "birthday",
  amount: 100,
  isActive: true,
}
