"use client";

import * as React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { SlideInModal } from "@/components/ui/slide-in-modal";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { CustomTagInput } from "@/features/restaurant/components/custom-tag-input";
import { RestaurantCombobox } from "@/features/restaurant/components/restaurant-combobox";
import { useMenuItemDetail } from "@/features/restaurant/hooks/use-restaurant-queries";
import {
  useCreateMenuItem,
  useUpdateMenuItem,
} from "@/features/restaurant/hooks/use-restaurant-mutations";
import {
  buildMenuItemFormData,
  createEmptyMenuItemFormValues,
  getMenuItemExistingImageUrl,
  mapApiMenuItemToFormValues,
  type MenuItemFormValues,
} from "@/features/restaurant/utils/menu-item-form";
import type { MenuVariation } from "@/features/restaurant/types";
import { TimeStepper } from "@/components/ui/time-stepper";
import { AppLoader } from "@/components/ui/app-loader";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

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
  existingImageUrl,
  onOpenChange,
}: {
  initialValues: MenuItemFormValues;
  isEdit: boolean;
  menuItemId?: string;
  existingImageUrl?: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { createMenuItem, isPending: isCreating } = useCreateMenuItem();
  const { updateMenuItem, isPending: isUpdating } = useUpdateMenuItem();
  const isSaving = isCreating || isUpdating;

  const variationSchema = z.object({
    id: z.string(),
  optionName: z.string(),
  price: z.string(),
  duration: z.string(),
  });

  const formSchema = z
    .object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
      preparationTimeMinutes: z.string().optional(),
      kitchenId: z.string().min(1, "Restaurant is required"),
      variations: z.array(variationSchema).min(1),
      tags: z.array(z.string()).optional(),
      availability: z.enum(["all-day", "custom"]),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      customSchedule: z.any().optional(),
      image: z.any().nullable().optional(),
    })
    .superRefine((data, ctx) => {
      const image = data.image as unknown;
      const hasFile = !!image && typeof image === "object" && image instanceof File && (image as File).size > 0;

      if (!isEdit) {
        if (!hasFile) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Menu image is required",
            path: ["image"],
          });
        }
      } else {
        if (!hasFile && !existingImageUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Menu image is required",
            path: ["image"],
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

  function addVariation() {
    const id = crypto.randomUUID();
    const current = (form.getValues("variations") as MenuVariation[]) || [];
    const next: MenuVariation = { id, optionName: "", price: "", duration: "" };
    setValue("variations", [...current, next]);
  }

  function removeVariation(id: string) {
    const current = (form.getValues("variations") as MenuVariation[]) || [];
    if (current.length <= 1) return;
    setValue("variations", current.filter((v) => v.id !== id));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  onClick={async () => {
          const generated = `AI ${String(Date.now()).slice(-4)}`;
          setValue("name", generated, { shouldTouch: true, shouldValidate: true });
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

      <section>
        <Controller
          name="preparationTimeMinutes"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="mb-2">Preparation Time</FieldLabel>
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

      <section>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Menu Variation
        </h3>
        <div className="space-y-3">
          <Controller
            name="variations"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                {(field.value || []).map((row: MenuVariation, idx: number) => (
                  <div
                    key={row.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 w-full"
                  >
                    <button
                      type="button"
                      className="shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                      aria-label="Reorder variation"
                    >
                      <Icons.dragIndicator size={20} />
                    </button>

                    <div className="min-w-0 flex-1 sm:flex-3">
                      <Input
                        value={row.optionName}
                        onChange={(e) => {
                          const next = [...field.value];
                          next[idx] = { ...next[idx], optionName: e.target.value };
                          field.onChange(next);
                        }}
                        placeholder="Option Name"
                        className="h-10 w-full"
                      />
                    </div>

                    <div className="flex items-center gap-3 sm:gap-2">
                      <div className="flex items-center gap-2">
                        <FieldLabel className="hidden sm:block">Price</FieldLabel>
                        <div className="relative w-full sm:w-24">
                          <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">
                            ₦
                          </span>
                          <Input
                            value={row.price}
                            onChange={(e) => {
                              const next = [...field.value];
                              next[idx] = { ...next[idx], price: e.target.value };
                              field.onChange(next);
                            }}
                            placeholder=""
                            inputMode="decimal"
                            className="h-10 pl-7 w-full"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FieldLabel className="hidden sm:block">Duration</FieldLabel>
                        <div className="relative w-full sm:w-24">
                          <Input
                            value={row.duration}
                            onChange={(e) => {
                              const next = [...field.value];
                              next[idx] = { ...next[idx], duration: e.target.value };
                              field.onChange(next);
                            }}
                            placeholder=""
                            inputMode="numeric"
                            className="h-10 pr-10 w-full"
                          />
                          <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-sm text-muted-foreground">
                            Min
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                        aria-label={`Remove variation ${row.optionName || row.id}`}
                        disabled={(field.value || []).length <= 1}
                        onClick={() => removeVariation(row.id)}
                      >
                        <Icons.trash size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary"
                  icon={{ name: "add", position: "left" }}
                  onClick={addVariation}
                >
                  Add variation
                </Button>
              </div>
            )}
          />
        </div>
      </section>

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
                  rows={4}
                  className="block min-h-24 w-full resize-none border-0 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
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

      <section>
        <Controller
          name="kitchenId"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="mb-2">Select Restaurant</FieldLabel>
              <RestaurantCombobox
                value={field.value}
                onChange={(v) => field.onChange(v)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </section>

      <section className="space-y-5 border-t border-border pt-2">
        <h3 className="text-base font-semibold text-foreground">
          Advance Setting
        </h3>

        <Controller
          name="tags"
          control={control}
            render={({ field }) => (
              <CustomTagInput value={field.value ?? []} onChange={(v) => field.onChange(v)} />
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

        <div>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUpload
                value={field.value}
                existingImageUrl={isEdit && !field.value ? existingImageUrl : null}
                existingImageAlt={form.getValues("name") || "Menu item image"}
                onChange={(image) => field.onChange(image)}
              />
            )}
          />
        </div>
      </section>

      <div className="flex justify-end">
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
      existingImageUrl={getMenuItemExistingImageUrl(menuItem)}
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
