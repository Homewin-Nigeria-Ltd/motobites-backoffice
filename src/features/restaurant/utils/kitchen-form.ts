import { defaultOpeningHours } from "../data/form-defaults"
import type {
  ApiKitchenDetail,
  ApiKitchenOpeningHour,
  KitchenOpeningHoursPayload,
  OpeningHoursRow,
  Restaurant,
  RestaurantFormValues,
} from "../types"
import { normalizeTimeForApi } from "@/lib/time-format"

export function formValuesToOpeningHours(
  openingHours: RestaurantFormValues["openingHours"]
): KitchenOpeningHoursPayload {
  return openingHours
    .filter((row) => row.enabled !== false)
    .map((row) => ({
      day: row.day,
      start_time: normalizeTimeForApi(row.startTime),
      end_time: normalizeTimeForApi(row.endTime),
    }))
}

function normalizeTags(tags: string[] | string | null | undefined): string[] {
  if (!tags) {
    return []
  }

  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean)
  }

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function appendTags(formData: FormData, tags: string[]) {
  formData.append("tags", JSON.stringify(tags))
}

function appendOpeningHours(
  formData: FormData,
  openingHours: KitchenOpeningHoursPayload
) {
  openingHours.forEach((row, index) => {
    formData.append(`opening_hours[${index}][day]`, row.day)
    formData.append(`opening_hours[${index}][start_time]`, row.start_time)
    formData.append(`opening_hours[${index}][end_time]`, row.end_time)
  })
}

export function buildKitchenFormData(
  values: RestaurantFormValues,
  options: { isUpdate?: boolean } = {}
): FormData {
  const formData = new FormData()
  const name = values.name.trim()
  const openingHours = formValuesToOpeningHours(values.openingHours)

  formData.append("name", name)
  formData.append("restaurant_name", name)
  formData.append("description", values.description.trim())
  appendTags(formData, values.tags)
  appendOpeningHours(formData, openingHours)
  formData.append("is_open", values.isOpen ? "1" : "0")

  if (options.isUpdate) {
    formData.append("_method", "PUT")
  }

  if (values.image) {
    formData.append("image", values.image)
  }

  return formData
}

export function apiOpeningHoursToFormRows(
  openingHours: ApiKitchenOpeningHour[] | undefined
): OpeningHoursRow[] {
  if (!openingHours?.length) {
    return defaultOpeningHours.map((row) => ({ ...row }))
  }

  function normalizeApiTimeForForm(time?: string | null): string {
    if (!time) return ""
    const trimmed = time.trim()
    const match = trimmed.match(/^([0-9]{1,2}:[0-9]{2})(?::[0-9]{2})?\s*(Am|Pm)?$/i)
    if (!match) return trimmed
    const base = match[1]
    const ampm = match[2]
    return ampm ? `${base} ${ampm}` : base
  }

  return openingHours.map((row, index) => ({
    id: `${row.day.toLowerCase()}-${index}`,
    day: row.day,
    startTime: normalizeApiTimeForForm(row.start_time),
    endTime: normalizeApiTimeForForm(row.end_time),
  }))
}

export function mapKitchenDetailToRestaurant(kitchen: ApiKitchenDetail): Restaurant {
  return {
    id: String(kitchen.id),
    name: kitchen.name ?? "",
    description: kitchen.description ?? "",
    imageUrl: kitchen.image ?? "",
    tags: normalizeTags(kitchen.tags),
    openingHours: apiOpeningHoursToFormRows(kitchen.opening_hours),
    hubId: String(kitchen.id),
    menus: [],
    isOpen: kitchen.is_open,
  }
}

export function restaurantToFormValues(restaurant: Restaurant): RestaurantFormValues {
  return {
    name: restaurant.name ?? "",
    description: restaurant.description ?? "",
    tags: [...restaurant.tags],
    openingHours: restaurant.openingHours.map((row) => ({ ...row })),
    isOpen: restaurant.isOpen ?? true,
    image: null,
  }
}
