import { defaultMenuAvailability } from "@/features/restaurant/data/form-defaults";
import type {
  ApiMenuItemDetail,
  ApiMenuItemTags,
  MenuAvailabilityRow,
} from "@/features/restaurant/types";
import { getMenuItemImageUrl } from "@/features/restaurant/utils/menu-item";
import { normalizeTimeForApi } from "@/lib/time-format";

export type MenuItemModifierFormValue = {
  id: string;
  name: string;
  price: string;
  type: string;
  group_name?: string;
  description?: string;
  is_required?: boolean;
};

export type MenuItemFormValues = {
  name: string;
  price: string;
  preparationTimeMinutes: string;
  kitchenId: string;
  description: string;
  tags: string[];
  availability: "all-day" | "custom";
  startTime: string;
  endTime: string;
  customSchedule: MenuAvailabilityRow[];
  images: File[];
  videos: File[];
  modifiers: MenuItemModifierFormValue[];
};

function isApiMenuItemTags(tags: unknown): tags is ApiMenuItemTags {
  return typeof tags === "object" && tags !== null && !Array.isArray(tags);
}

function normalizeTags(tags: unknown): string[] {
  if (!tags) {
    return [];
  }

  if (isApiMenuItemTags(tags)) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags !== "string") {
    return [];
  }

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function createEmptyMenuItemFormValues(
  defaultKitchenId = "",
): MenuItemFormValues {
  return {
    name: "",
    price: "",
    description: "",
    preparationTimeMinutes: "20",
    kitchenId: defaultKitchenId,
    tags: [],
    availability: "all-day",
    startTime: "08:00",
    endTime: "21:00",
    customSchedule: defaultMenuAvailability.map((row) => ({ ...row })),
    images: [],
    videos: [],
    modifiers: [],
  };
}

export function mapApiMenuItemToFormValues(
  item: ApiMenuItemDetail,
): MenuItemFormValues {
  const availabilityType =
    item.availability_type === "custom" ? "custom" : "all-day";

  const modifiers: MenuItemModifierFormValue[] = (item.modifiers ?? []).map(
    (mod, index) => ({
      id: mod.id ? String(mod.id) : `mod-${index + 1}`,
      name: mod.name ?? "",
      price: String(mod.price ?? ""),
      type: mod.type ?? "extra",
      group_name: mod.group_name ?? "Add-ons",
      description: mod.description ?? "",
      is_required: Boolean(mod.is_required),
    }),
  );

  return {
    name: item.name ?? "",
    price: String(item.price ?? ""),
    description: item.description ?? "",
    preparationTimeMinutes: String(item.preparation_time_minutes ?? "20"),
    kitchenId: String(item.kitchen?.id ?? ""),
    tags: normalizeTags(item.tags),
    availability: availabilityType,
    startTime: item.availability_start ?? "08:00",
    endTime: item.availability_end ?? "21:00",
    customSchedule: defaultMenuAvailability.map((row) => ({ ...row })),
    images: [],
    videos: [],
    modifiers,
  };
}

export function getMenuItemExistingImageUrl(item?: ApiMenuItemDetail | null) {
  return getMenuItemImageUrl(item);
}

export function buildMenuItemFormData(
  values: MenuItemFormValues,
  options: { isUpdate?: boolean } = {},
): FormData {
  const formData = new FormData();

  if (options.isUpdate) {
    formData.append("_method", "PUT");
  }

  formData.append("name", values.name.trim());
  formData.append("price", String(Number.parseFloat(values.price) || 0));
  formData.append("kitchen_id", values.kitchenId);

  if (values.description?.trim()) {
    formData.append("description", values.description.trim());
  }

  if (values.preparationTimeMinutes) {
    formData.append(
      "preparation_time_minutes",
      String(Number.parseInt(values.preparationTimeMinutes, 10) || 20),
    );
  }

  if (values.tags && values.tags.length > 0) {
    formData.append("tags", JSON.stringify(values.tags));
  }

  formData.append(
    "availability_type",
    values.availability === "all-day" ? "all_day" : "custom",
  );

  if (values.availability === "custom") {
    if (values.startTime) {
      formData.append(
        "availability_start",
        normalizeTimeForApi(values.startTime),
      );
    }
    if (values.endTime) {
      formData.append("availability_end", normalizeTimeForApi(values.endTime));
    }
  }

  // Modifiers (Add-ons & Options)
  if (values.modifiers && values.modifiers.length > 0) {
    const formattedModifiers = values.modifiers
      .filter((m) => m.name.trim())
      .map((m, index) => ({
        name: m.name.trim(),
        price: Number.parseFloat(m.price) || 0,
        type: m.type?.trim() || "extra",
        description: m.description?.trim() || null,
        group_name: m.group_name?.trim() || "Add-ons",
        is_required: Boolean(m.is_required),
        min_select: 0,
        max_select: 1,
        sort_order: index,
        is_active: true,
      }));
    formData.append("modifiers", JSON.stringify(formattedModifiers));
  } else if (options.isUpdate) {
    formData.append("modifiers", JSON.stringify([]));
  }

  // Images: "for images and viddeos, i waant to use the images field(not image) and videos not video."
  if (values.images && values.images.length > 0) {
    values.images.forEach((file) => {
      formData.append("images[]", file);
    });
  }

  // Videos: "and videos not video."
  if (values.videos && values.videos.length > 0) {
    values.videos.forEach((file) => {
      formData.append("videos[]", file);
    });
  }

  return formData;
}
