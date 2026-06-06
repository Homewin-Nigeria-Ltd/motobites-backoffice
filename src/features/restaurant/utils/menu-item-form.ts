import { defaultMenuAvailability } from "@/features/restaurant/data/form-defaults";
import type {
  ApiMenuItemDetail,
  ApiMenuItemTags,
  MenuAvailabilityRow,
  MenuVariation,
} from "@/features/restaurant/types";
import { normalizeTimeForApi } from "@/lib/time-format";

export type MenuItemFormValues = {
  name: string;
  description: string;
  preparationTimeMinutes: string;
  kitchenId: string;
  variations: MenuVariation[];
  tags: string[];
  availability: "all-day" | "custom";
  startTime: string;
  endTime: string;
  customSchedule: MenuAvailabilityRow[];
  image: File | null;
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

function parseVariationRows(variations: MenuVariation[]): Array<{
  name: string;
  price: number;
  preparation_time_minutes: number;
}> {
  return variations
    .filter((row) => row.optionName.trim())
    .map((row) => ({
      name: row.optionName.trim(),
      price: Number.parseFloat(row.price) || 0,
      preparation_time_minutes: Number.parseInt(row.duration, 10) || 0,
    }));
}

function getPrimaryVariation(variations: MenuVariation[]) {
  const filled =
    variations.find(
      (row) => row.optionName.trim() || row.price.trim() || row.duration.trim(),
    ) ?? variations[0];

  return {
    price: Number.parseFloat(filled?.price ?? "") || 0,
    preparation_time_minutes: Number.parseInt(filled?.duration ?? "", 10) || 0,
  };
}

export function createEmptyMenuItemFormValues(
  defaultKitchenId = "",
): MenuItemFormValues {
  return {
    name: "",
    description: "",
    preparationTimeMinutes: "",
    kitchenId: defaultKitchenId,
    variations: [
      { id: "1", optionName: "", price: "", duration: "" },
      { id: "2", optionName: "", price: "", duration: "" },
    ],
    tags: [],
    availability: "all-day",
    startTime: "8:00 Am",
    endTime: "9:00 Pm",
    customSchedule: defaultMenuAvailability.map((row) => ({ ...row })),
    image: null,
  };
}

export function mapApiMenuItemToFormValues(
  item: ApiMenuItemDetail,
): MenuItemFormValues {
  const variations =
    item.variations?.length && item.variations.length > 0
      ? item.variations.map((variation, index) => ({
          id: String(variation.id ?? index + 1),
          optionName: variation.name ?? variation.option_name ?? "",
          price: String(variation.price ?? item.price ?? ""),
          duration: String(
            variation.preparation_time_minutes ??
              item.preparation_time_minutes ??
              "",
          ),
        }))
      : [
          {
            id: "1",
            optionName: item.name,
            price: String(item.price ?? ""),
            duration: String(item.preparation_time_minutes ?? ""),
          },
        ];

  const availabilityType =
    item.availability_type === "custom" ? "custom" : "all-day";

  return {
    name: item.name ?? "",
    description: item.description ?? "",
    preparationTimeMinutes: String(item.preparation_time_minutes ?? ""),
    kitchenId: String(item.kitchen.id),
    variations,
    tags: normalizeTags(item.tags),
    availability: availabilityType,
    startTime: item.availability_start ?? "8:00 Am",
    endTime: item.availability_end ?? "9:00 Pm",
    customSchedule: defaultMenuAvailability.map((row) => ({ ...row })),
    image: null,
  };
}

export function getMenuItemExistingImageUrl(item?: ApiMenuItemDetail | null) {
  return item?.image ?? null;
}

export function buildMenuItemFormData(
  values: MenuItemFormValues,
  options: { isUpdate?: boolean } = {},
): FormData {
  const formData = new FormData();
  const variationRows = parseVariationRows(values.variations);
  const primaryVariation = getPrimaryVariation(values.variations);

  formData.append("name", values.name.trim());
  formData.append("description", values.description.trim());
  formData.append("kitchen_id", values.kitchenId);
  formData.append("price", String(primaryVariation.price));
  formData.append(
    "preparation_time_minutes",
    String(Number.parseInt(values.preparationTimeMinutes, 10) || 0),
  );
  formData.append("variations", JSON.stringify(variationRows));
  formData.append("tags", JSON.stringify(values.tags));
  formData.append(
    "availability_type",
    values.availability === "all-day" ? "all_day" : "custom",
  );

  if (values.availability === "custom") {
    formData.append(
      "availability_start",
      normalizeTimeForApi(values.startTime),
    );
    formData.append("availability_end", normalizeTimeForApi(values.endTime));
  }

  if (options.isUpdate) {
    formData.append("_method", "PUT");
  }

  if (values.image) {
    formData.append("image", values.image);
  }

  return formData;
}
