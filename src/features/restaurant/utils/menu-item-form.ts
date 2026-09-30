import { defaultMenuAvailability } from "@/features/restaurant/data/form-defaults";
import type {
  ApiMenuItemDetail,
  ApiMenuItemTags,
  MenuAvailabilityRow,
} from "@/features/restaurant/types";
import { getMenuItemImageUrl } from "@/features/restaurant/utils/menu-item";
import { normalizeTimeForApi } from "@/lib/time-format";

export type MenuItemModifierOptionFormValue = {
  id: string;
  name: string;
  price: string;
  type?: string;
  description?: string;
};

export type MenuItemModifierGroupFormValue = {
  id: string;
  name: string;
  type: string;
  is_required: boolean;
  min_select: number;
  max_select: number;
  options: MenuItemModifierOptionFormValue[];
};

export type MenuItemModifierFormValue = MenuItemModifierOptionFormValue & {
  group_name?: string;
  is_required?: boolean;
  min_select?: number;
  max_select?: number;
};

export type MenuItemFormValues = {
  name: string;
  categoryName?: string;
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
  modifier_groups: MenuItemModifierGroupFormValue[];
  is_combo: boolean;
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
    categoryName: "",
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
    modifier_groups: [],
    is_combo: false,
  };
}

export function mapApiMenuItemToFormValues(
  item: ApiMenuItemDetail,
): MenuItemFormValues {
  const availabilityType =
    item.availability_type === "custom" ? "custom" : "all-day";

  const groupsMap = new Map<string, MenuItemModifierGroupFormValue>();

  (item.modifiers ?? []).forEach((mod, index) => {
    const rawGroupName = mod.group_name?.trim();
    const groupName =
      rawGroupName ||
      (mod.type ? mod.type.charAt(0).toUpperCase() + mod.type.slice(1) : "Add-ons");

    if (!groupsMap.has(groupName)) {
      groupsMap.set(groupName, {
        id: `group-${groupsMap.size + 1}`,
        name: groupName,
        type: mod.type || "extra",
        is_required: Boolean(mod.is_required),
        min_select: mod.min_select ?? (mod.is_required ? 1 : 0),
        max_select: mod.max_select ?? 1,
        options: [],
      });
    }

    const group = groupsMap.get(groupName)!;
    if (!Array.isArray(group.options)) {
      group.options = [];
    }
    group.options.push({
      id: mod.id ? String(mod.id) : `opt-${index + 1}`,
      name: mod.name ?? "",
      price: String(mod.price ?? "0"),
      type: mod.type ?? group.type ?? "extra",
      description: mod.description ?? "",
    });
  });

  const modifier_groups = Array.from(groupsMap.values());

  return {
    name: item.name ?? "",
    categoryName: item.category?.name ?? "",
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
    modifier_groups,
    is_combo: Boolean(item.is_combo),
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
  if (values.categoryName?.trim()) {
    formData.append("category_name", values.categoryName.trim());
  }
  formData.append("price", String(Number.parseFloat(values.price) || 0));
  formData.append("kitchen_id", values.kitchenId);
  formData.append("is_combo", values.is_combo ? "1" : "0");

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

  // Modifiers (Add-on Groups & Options)
  if (values.modifier_groups && values.modifier_groups.length > 0) {
    const formattedModifiers: Array<{
      name: string;
      price: number;
      type: string;
      description: string | null;
      group_name: string;
      is_required: boolean;
      min_select: number;
      max_select: number;
      sort_order: number;
      is_active: boolean;
    }> = [];

    let sortOrder = 0;

    values.modifier_groups.forEach((group) => {
      const groupName = group.name?.trim() || "Add-ons";
      const isRequired = Boolean(group.is_required);
      const minSelect = isRequired
        ? Math.max(1, Number(group.min_select) || 1)
        : 0;
      const maxSelect = Math.max(1, Number(group.max_select) || 1);
      const groupType = group.type?.trim() || "extra";

      (group.options || []).forEach((opt) => {
        if (!opt.name?.trim()) {
          return;
        }

        formattedModifiers.push({
          name: opt.name.trim(),
          price: Number.parseFloat(opt.price) || 0,
          type: opt.type?.trim() || groupType,
          description: opt.description?.trim() || null,
          group_name: groupName,
          is_required: isRequired,
          min_select: minSelect,
          max_select: maxSelect,
          sort_order: sortOrder++,
          is_active: true,
        });
      });
    });

    if (formattedModifiers.length > 0) {
      formData.append("modifiers", JSON.stringify(formattedModifiers));
    } else if (options.isUpdate) {
      formData.append("modifiers", JSON.stringify([]));
    }
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
