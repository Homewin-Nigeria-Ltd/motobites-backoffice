"use client";

import * as React from "react";
import Image from "next/image";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { SlideInModal } from "@/components/ui/slide-in-modal";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { CustomTagInput } from "@/features/restaurant/components/custom-tag-input";
import { RestaurantCombobox } from "@/features/restaurant/components/restaurant-combobox";
import { useMenuItemDetail } from "@/features/restaurant/hooks/use-restaurant-queries";
import {
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItemImage,
  useDeleteMenuItemVideo,
} from "@/features/restaurant/hooks/use-restaurant-mutations";
import {
  buildMenuItemFormData,
  createEmptyMenuItemFormValues,
  mapApiMenuItemToFormValues,
  type MenuItemFormValues,
  type MenuItemModifierFormValue,
} from "@/features/restaurant/utils/menu-item-form";
import type { ApiMenuItemImage, MenuItemVideo } from "@/features/restaurant/types";
import { TimeStepper } from "@/components/ui/time-stepper";
import { AppLoader } from "@/components/ui/app-loader";
import { Icons } from "@/components/ui/icons";
import { toImageSrc } from "@/lib/image-url";
import { cn } from "@/lib/utils";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type AddMenuSheetProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  menuItemId?: string;
  defaultKitchenId?: string;
};

function AddMenuSheetForm({
  initialValues,
  isEdit,
  menuItemId,
  existingImages = [],
  existingVideos = [],
  onOpenChange,
}: {
  initialValues: MenuItemFormValues;
  isEdit: boolean;
  menuItemId?: string;
  existingImages?: ApiMenuItemImage[];
  existingVideos?: MenuItemVideo[];
  onOpenChange: (open: boolean) => void;
}) {
  const [existingImagesList, setExistingImagesList] =
    React.useState<ApiMenuItemImage[]>(existingImages);
  const [existingVideosList, setExistingVideosList] =
    React.useState<MenuItemVideo[]>(existingVideos);

  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const { createMenuItem, isPending: isCreating } = useCreateMenuItem();
  const { updateMenuItem, isPending: isUpdating } = useUpdateMenuItem();
  const { deleteMenuItemImage, isPending: isDeletingImage } =
    useDeleteMenuItemImage();
  const { deleteMenuItemVideo, isPending: isDeletingVideo } =
    useDeleteMenuItemVideo();

  const isSaving = isCreating || isUpdating;

  const modifierSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.string(),
    type: z.string(),
    group_name: z.string().optional(),
    description: z.string().optional(),
    is_required: z.boolean().optional(),
  });

  const formSchema = z
    .object({
      name: z.string().min(1, "Menu name is required"),
      price: z
        .string()
        .min(1, "Price is required")
        .refine(
          (val) => !isNaN(Number(val)) && Number(val) >= 0,
          "Price must be a valid positive number",
        ),
      description: z.string().optional(),
      preparationTimeMinutes: z.string().optional(),
      kitchenId: z.string().min(1, "Restaurant is required"),
      tags: z.array(z.string()).optional(),
      availability: z.enum(["all-day", "custom"]),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      customSchedule: z.any().optional(),
      images: z.array(z.any()).default([]),
      videos: z.array(z.any()).default([]),
      modifiers: z.array(modifierSchema).default([]),
    })
    .superRefine((data, ctx) => {
      const hasNewImages = Array.isArray(data.images) && data.images.length > 0;
      const hasExistingImages =
        Array.isArray(existingImagesList) && existingImagesList.length > 0;

      if (!isEdit) {
        if (!hasNewImages) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "At least one menu image is required",
            path: ["images"],
          });
        }
      } else {
        if (!hasNewImages && !hasExistingImages) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "At least one menu image is required",
            path: ["images"],
          });
        }
      }
    });

  type FormSchema = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema as any),
    defaultValues: initialValues as unknown as FormSchema,
  });

  const { control, handleSubmit, setValue, clearErrors } = form;

  const watchImages = useWatch({ control, name: "images" }) || [];
  const watchVideos = useWatch({ control, name: "videos" }) || [];

  function onSubmit(values: FormSchema) {
    const fd = buildMenuItemFormData(values as unknown as MenuItemFormValues, {
      isUpdate: isEdit,
    });

    if (isEdit && menuItemId) {
      updateMenuItem({ itemId: menuItemId, formData: fd }).then((res) => {
        if (res.success) onOpenChange(false);
      });
      return;
    }

    createMenuItem(fd).then((res) => {
      if (res.success) onOpenChange(false);
    });
  }

  // Modifiers Management
  function addModifier() {
    const id = crypto.randomUUID();
    const current = (form.getValues("modifiers") as MenuItemModifierFormValue[]) || [];
    const next: MenuItemModifierFormValue = {
      id,
      name: "",
      price: "",
      type: "extra",
      group_name: "Add-ons",
      description: "",
    };
    setValue("modifiers", [...current, next]);
  }

  function removeModifier(id: string) {
    const current = (form.getValues("modifiers") as MenuItemModifierFormValue[]) || [];
    setValue(
      "modifiers",
      current.filter((m) => m.id !== id),
    );
  }

  // Images Management
  const handleAddImages = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files).filter(
      (file) => file.size <= 5 * 1024 * 1024,
    );
    const current = (form.getValues("images") as File[]) || [];
    setValue("images", [...current, ...newFiles], { shouldValidate: true });
    clearErrors("images");
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleRemoveNewImage = (index: number) => {
    const current = (form.getValues("images") as File[]) || [];
    setValue(
      "images",
      current.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  // Videos Management
  const handleAddVideos = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files).filter(
      (file) => file.size <= 100 * 1024 * 1024,
    );
    const current = (form.getValues("videos") as File[]) || [];
    setValue("videos", [...current, ...newFiles], { shouldValidate: true });
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleRemoveNewVideo = (index: number) => {
    const current = (form.getValues("videos") as File[]) || [];
    setValue(
      "videos",
      current.filter((_, i) => i !== index),
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Menu Name */}
      <section>
        <div className="mb-2 flex items-center justify-between gap-2">
          <Field>
            <FieldLabel>Menu Name</FieldLabel>
          </Field>
          <span className="text-xs text-muted-foreground">Required</span>
        </div>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="relative">
                <Input
                  {...field}
                  placeholder="Enter item name (e.g Jollof rice and chicken with Pepsi)"
                  className="h-11 rounded-xl bg-background pr-44"
                />
                <Button
                  type="button"
                  size="sm"
                  icon={{ name: "sparkles", position: "left", size: 14 }}
                  className="absolute top-1/2 right-2 h-8 -translate-y-1/2 rounded-lg text-xs"
                  onClick={() => {
                    const generated = `AI ${String(Date.now()).slice(-4)}`;
                    setValue("name", generated, {
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                    clearErrors("name");
                  }}
                  disabled={isSaving}
                >
                  AI Generated Name
                </Button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </section>

      {/* Price & Preparation Time */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="price"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <FieldLabel>Price</FieldLabel>
                <span className="text-xs text-muted-foreground">Required</span>
              </div>
              <div className="relative w-full">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  ₦
                </span>
                <Input
                  {...field}
                  placeholder="e.g. 4500"
                  inputMode="decimal"
                  className="h-11 pl-8"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="preparationTimeMinutes"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <div className="mb-2">
                <FieldLabel>Preparation Time</FieldLabel>
              </div>
              <div className="relative w-full">
                <Input
                  {...field}
                  placeholder="e.g. 20"
                  inputMode="numeric"
                  className="h-11 pr-12"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  Min
                </span>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </section>

      {/* Description */}
      <section>
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="mb-2">Description</FieldLabel>
              <div className="overflow-hidden rounded-xl border border-border bg-background">
                <textarea
                  {...field}
                  placeholder="Enter a description"
                  rows={3}
                  className="block min-h-20 w-full resize-none border-0 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <div className="flex justify-end px-2 pb-2">
                  <Button
                    type="button"
                    size="sm"
                    icon={{ name: "sparkles", position: "left", size: 14 }}
                    className="h-8 rounded-lg text-xs"
                  >
                    AI Generated Description
                  </Button>
                </div>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </section>

      {/* Select Restaurant */}
      <section>
        <Controller
          name="kitchenId"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="mb-2">Select Restaurant</FieldLabel>
              <RestaurantCombobox
                value={field.value}
                onChange={(v) => {
                  field.onChange(v);
                  clearErrors("kitchenId");
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </section>

      {/* Modifiers (Add-ons & Options) - Variations section omitted for UX */}
      <section className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Modifiers (Add-ons & Options)
            </h3>
            <p className="text-xs text-muted-foreground">
              Add-ons or choices customers can select with this meal (e.g. extra protein, toppings, drinks).
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs shrink-0"
            icon={{ name: "add", position: "left", size: 14 }}
            onClick={addModifier}
          >
            Add Option
          </Button>
        </div>

        <Controller
          name="modifiers"
          control={control}
          render={({ field }) => (
            <div className="space-y-2.5 pt-1">
              {(field.value || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    No add-ons or options added yet.
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs text-primary hover:text-primary"
                    icon={{ name: "add", position: "left", size: 14 }}
                    onClick={addModifier}
                  >
                    Add first modifier
                  </Button>
                </div>
              ) : (
                field.value.map((mod: MenuItemModifierFormValue, idx: number) => (
                  <div
                    key={mod.id}
                    className="flex flex-col gap-2.5 rounded-xl border border-border bg-background p-3 sm:flex-row sm:items-center sm:gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">
                        Option Name
                      </span>
                      <Input
                        value={mod.name}
                        onChange={(e) => {
                          const next = [...field.value];
                          next[idx] = { ...next[idx], name: e.target.value };
                          field.onChange(next);
                        }}
                        placeholder="e.g. Extra Beef / Coleslaw"
                        className="h-9 text-sm"
                      />
                    </div>

                    <div className="w-full sm:w-28">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">
                        Price (₦)
                      </span>
                      <div className="relative">
                        <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-muted-foreground">
                          ₦
                        </span>
                        <Input
                          value={mod.price}
                          onChange={(e) => {
                            const next = [...field.value];
                            next[idx] = { ...next[idx], price: e.target.value };
                            field.onChange(next);
                          }}
                          placeholder="0"
                          inputMode="decimal"
                          className="h-9 pl-6 text-sm"
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-36">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">
                        Type / Category
                      </span>
                      <select
                        value={
                          ["extra", "protein", "drink", "side", "topping", "sauce"].includes(
                            mod.type?.toLowerCase(),
                          )
                            ? mod.type.toLowerCase()
                            : "custom"
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          const next = [...field.value];
                          next[idx] = {
                            ...next[idx],
                            type: val === "custom" ? "" : val,
                          };
                          field.onChange(next);
                        }}
                        className="h-9 w-full rounded-lg border border-input bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="extra">Extra</option>
                        <option value="protein">Protein</option>
                        <option value="drink">Drink</option>
                        <option value="side">Side</option>
                        <option value="topping">Topping</option>
                        <option value="sauce">Sauce</option>
                        <option value="custom">Custom / Other...</option>
                      </select>

                      {!["extra", "protein", "drink", "side", "topping", "sauce"].includes(
                        mod.type?.toLowerCase(),
                      ) && (
                        <Input
                          value={mod.type}
                          onChange={(e) => {
                            const next = [...field.value];
                            next[idx] = { ...next[idx], type: e.target.value };
                            field.onChange(next);
                          }}
                          placeholder="e.g. swallow, soup"
                          className="mt-1.5 h-8 text-xs"
                          autoFocus
                        />
                      )}
                    </div>

                    <div className="flex items-end justify-end sm:pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-9 bg-destructive/10 text-destructive hover:bg-destructive/20"
                        aria-label="Remove modifier"
                        onClick={() => removeModifier(mod.id)}
                      >
                        <Icons.trash size={15} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        />
      </section>

      {/* Advance Setting */}
      <section className="space-y-5 border-t border-border pt-4">
        <h3 className="text-base font-semibold text-foreground">
          Advance Setting
        </h3>

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <div>
              <FieldLabel className="mb-2">Tags</FieldLabel>
              <CustomTagInput
                value={field.value ?? []}
                onChange={(v) => field.onChange(v)}
              />
            </div>
          )}
        />

        <div>
          <FieldLabel className="mb-2">Set Availability</FieldLabel>
          <Controller
            name="availability"
            control={control}
            render={({ field }) => (
              <div>
                <div className="inline-flex rounded-lg bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => field.onChange("all-day")}
                    className={cn(
                      "rounded-md px-5 py-2 text-sm font-medium transition-all",
                      field.value === "all-day"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    All Day
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange("custom")}
                    className={cn(
                      "rounded-md px-5 py-2 text-sm font-medium transition-all",
                      field.value === "custom"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Custom
                  </button>
                </div>
                {field.value === "all-day" && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Everyday</span>
                  </div>
                )}
                {field.value === "custom" && (
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Custom</span>
                    <Controller
                      name="startTime"
                      control={control}
                      render={({ field }) => (
                        <TimeStepper
                          value={(field.value as string) ?? ""}
                          onChange={(v) => field.onChange(v)}
                        />
                      )}
                    />
                    <span>to</span>
                    <Controller
                      name="endTime"
                      control={control}
                      render={({ field }) => (
                        <TimeStepper
                          value={(field.value as string) ?? ""}
                          onChange={(v) => field.onChange(v)}
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            )}
          />
        </div>

        {/* Media: Images and Videos */}
        <div className="space-y-5 pt-2">
          {/* Images Section */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <FieldLabel>Menu Images</FieldLabel>
                <p className="text-xs text-muted-foreground">
                  Upload images (PNG, JPG, WEBP, up to 5MB). The first image serves as the primary thumbnail.
                </p>
              </div>
              <span className="text-xs text-muted-foreground">Required</span>
            </div>

            {/* Existing Images Gallery */}
            {existingImagesList.length > 0 && (
              <div className="mb-3 space-y-1.5">
                <p className="text-xs font-medium text-foreground">
                  Current Images ({existingImagesList.length})
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {existingImagesList.map((img, idx) => (
                    <div
                      key={img.id ?? idx}
                      className="group relative size-20 overflow-hidden rounded-xl border border-border bg-muted shadow-xs"
                    >
                      <Image
                        src={toImageSrc(img.image_url || img.image_path)}
                        alt={img.title || "Menu image"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 rounded bg-black/75 px-1 py-0.5 text-[9px] font-medium text-white">
                          Primary
                        </span>
                      )}
                      {menuItemId && img.id && (
                        <button
                          type="button"
                          disabled={isDeletingImage}
                          onClick={async () => {
                            await deleteMenuItemImage({
                              itemId: menuItemId,
                              imageId: img.id!,
                            });
                            setExistingImagesList((prev) =>
                              prev.filter((i) => i.id !== img.id),
                            );
                          }}
                          className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100"
                          title="Remove image"
                        >
                          <Icons.close size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newly Selected Images */}
            {watchImages.length > 0 && (
              <div className="mb-3 space-y-1.5">
                <p className="text-xs font-medium text-foreground">
                  New Images to Upload ({watchImages.length})
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {watchImages.map((file: File, idx: number) => {
                    const previewUrl = URL.createObjectURL(file);
                    return (
                      <div
                        key={`${file.name}-${idx}`}
                        className="group relative size-20 overflow-hidden rounded-xl border border-primary/40 bg-muted shadow-xs"
                      >
                        <Image
                          src={previewUrl}
                          alt={file.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(idx)}
                          className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white opacity-90 transition-opacity hover:opacity-100"
                          title="Remove image"
                        >
                          <Icons.close size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upload Dropzone / Button */}
            <div
              onClick={() => imageInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center transition-colors hover:border-primary/50 hover:bg-muted/60"
            >
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={(e) => handleAddImages(e.target.files)}
              />
              <div className="flex size-9 items-center justify-center rounded-full bg-background text-muted-foreground shadow-xs">
                <Icons.camera size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">
                  Click to select or drop images
                </p>
                <p className="text-[11px] text-muted-foreground">
                  PNG, JPG, WEBP up to 5MB each
                </p>
              </div>
            </div>
            {form.formState.errors.images && (
              <p className="mt-1 text-xs text-destructive">
                {String(form.formState.errors.images.message)}
              </p>
            )}
          </div>

          {/* Videos Section */}
          <div className="pt-2">
            <div className="mb-2">
              <FieldLabel>Menu Videos (Optional)</FieldLabel>
              <p className="text-xs text-muted-foreground">
                Upload short promotional or preparation video (MP4, MOV, WEBM, max 100MB).
              </p>
            </div>

            {/* Existing Videos */}
            {existingVideosList.length > 0 && (
              <div className="mb-3 space-y-1.5">
                <p className="text-xs font-medium text-foreground">Existing Videos</p>
                <div className="space-y-1.5">
                  {existingVideosList.map((vid, idx) => (
                    <div
                      key={vid.id ?? idx}
                      className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icons.video size={15} className="text-primary shrink-0" />
                        <span className="font-medium text-foreground truncate max-w-56">
                          {vid.title || `Video ${idx + 1}`}
                        </span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {vid.video_status || "READY"}
                        </span>
                      </div>
                      {menuItemId && vid.id && (
                        <button
                          type="button"
                          disabled={isDeletingVideo}
                          onClick={async () => {
                            await deleteMenuItemVideo({
                              itemId: menuItemId,
                              videoId: vid.id!,
                            });
                            setExistingVideosList((prev) =>
                              prev.filter((v) => v.id !== vid.id),
                            );
                          }}
                          className="text-destructive hover:opacity-80 p-1"
                          title="Remove video"
                        >
                          <Icons.trash size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newly Selected Videos */}
            {watchVideos.length > 0 && (
              <div className="mb-3 space-y-1.5">
                <p className="text-xs font-medium text-foreground">New Videos to Upload</p>
                <div className="space-y-1.5">
                  {watchVideos.map((file: File, idx: number) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icons.video size={15} className="text-primary shrink-0" />
                        <span className="font-medium text-foreground truncate max-w-56">
                          {file.name}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewVideo(idx)}
                        className="text-destructive hover:opacity-80 p-1 shrink-0"
                        title="Remove video"
                      >
                        <Icons.close size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Video Dropzone */}
            <div
              onClick={() => videoInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center transition-colors hover:border-primary/50 hover:bg-muted/60"
            >
              <input
                ref={videoInputRef}
                type="file"
                multiple
                accept="video/mp4,video/quicktime,video/webm"
                className="hidden"
                onChange={(e) => handleAddVideos(e.target.files)}
              />
              <div className="flex size-9 items-center justify-center rounded-full bg-background text-muted-foreground shadow-xs">
                <Icons.video size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">
                  Click to select or drop video files
                </p>
                <p className="text-[11px] text-muted-foreground">
                  MP4, MOV, WEBM up to 100MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          className="h-12 rounded-xl px-8 text-base font-semibold"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : isEdit ? "Save changes" : "Save and Publish"}
        </Button>
      </div>
    </form>
  );
}

function AddMenuSheetContent({
  menuItemId,
  defaultKitchenId,
  onOpenChange,
}: {
  menuItemId?: string;
  defaultKitchenId?: string;
  onOpenChange: (open: boolean) => void;
}) {
  const isEdit = Boolean(menuItemId);
  const {
    data: menuItem,
    isPending: isMenuItemPending,
    isError,
    error,
  } = useMenuItemDetail(menuItemId, { enabled: isEdit });

  if (isEdit && isMenuItemPending) {
    return <AppLoader className="py-12" />;
  }

  if (isEdit && isError) {
    throw error;
  }

  const initialValues =
    isEdit && menuItem
      ? mapApiMenuItemToFormValues(menuItem)
      : createEmptyMenuItemFormValues(defaultKitchenId ?? "");

  return (
    <AddMenuSheetForm
      key={menuItemId ?? `new-${defaultKitchenId ?? "menu"}`}
      initialValues={initialValues}
      isEdit={isEdit}
      menuItemId={menuItemId}
      existingImages={menuItem?.images ?? []}
      existingVideos={menuItem?.videos ?? []}
      onOpenChange={onOpenChange}
    />
  );
}

export function AddMenuSheet({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  menuItemId,
  defaultKitchenId,
}: AddMenuSheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;
  const isEdit = Boolean(menuItemId);

  return (
    <SlideInModal
      title={isEdit ? "Edit Menu" : "Add Menu"}
      description={
        isEdit
          ? "Update menu item details, pricing, and availability."
          : "Fill in the details to add a new menu item to your kitchen."
      }
      panel="standard"
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
      closeLabel={isEdit ? "Close edit menu form" : "Close add menu form"}
      bodyClassName="space-y-6"
    >
      {open ? (
        <AddMenuSheetContent
          menuItemId={menuItemId}
          defaultKitchenId={defaultKitchenId}
          onOpenChange={setOpen}
        />
      ) : null}
    </SlideInModal>
  );
}
