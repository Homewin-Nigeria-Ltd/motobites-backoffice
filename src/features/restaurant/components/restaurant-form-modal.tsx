"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { CustomTagInput } from "@/features/restaurant/components/custom-tag-input";
import { OpeningHoursEditor } from "@/features/restaurant/components/opening-hours-editor";
import { useKitchenDetailForEdit } from "@/features/restaurant/hooks/use-restaurant-queries";
import {
  useCreateKitchen,
  useUpdateKitchen,
} from "@/features/restaurant/hooks/use-restaurant-mutations";
import { defaultOpeningHours } from "@/features/restaurant";
import type { RestaurantFormValues } from "@/features/restaurant/types";
import {
  buildKitchenFormData,
  restaurantToFormValues,
} from "@/features/restaurant/utils/kitchen-form";
import { BaseModal } from "@/components/ui/base-modal";
import { AppLoader } from "@/components/ui/app-loader";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast";

type RestaurantFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kitchenId?: string;
  onSave?: (values: RestaurantFormValues) => void;
};

function createEmptyValues(): RestaurantFormValues {
  return {
    name: "",
    description: "",
    tags: [],
    openingHours: defaultOpeningHours.map((row, index) => ({
      ...row,
      id: `new-${row.day}-${index}`,
    })),
    isOpen: true,
    image: null,
  };
}

type KitchenFormProps = {
  initialValues: RestaurantFormValues;
  isEdit: boolean;
  kitchenId?: string;
  existingImageUrl?: string;
  existingImageAlt?: string;
  onOpenChange: (open: boolean) => void;
  onSave?: (values: RestaurantFormValues) => void;
};

function KitchenForm({
  initialValues,
  isEdit,
  kitchenId,
  existingImageUrl,
  existingImageAlt,
  onOpenChange,
  onSave,
}: KitchenFormProps) {
  const schema = z
    .object({
      name: z.string().min(1, "Kitchen name is required"),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
      isOpen: z.boolean().optional(),
      image: z.any().nullable().optional(),
    })
    .superRefine((data, ctx) => {
      const image = data.image as unknown;
      const hasFile = !!image && typeof image === "object" && image instanceof File && (image as File).size > 0;

      if (!isEdit) {
        if (!hasFile) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Kitchen image is required",
            path: ["image"],
          });
        }
      } else {
        if (!hasFile && !existingImageUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Kitchen image is required",
            path: ["image"],
          });
        }
      }
    });

  type ZodForm = z.infer<typeof schema>;
  type FormValues = ZodForm & { image?: File | null };
  

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: {
      name: initialValues.name,
      description: initialValues.description,
      tags: initialValues.tags,
      isOpen: initialValues.isOpen,
    },
  });

  const { createKitchen, isPending: isCreating } = useCreateKitchen();
  const { updateKitchen, isPending: isUpdating } = useUpdateKitchen();
  const isSaving = isCreating || isUpdating;

  const [openingHours, setOpeningHours] = useState(initialValues.openingHours);

  async function onSubmit(values: FormValues & { image?: File | null }) {
  const imageFile = (values as unknown as { image?: File | null }).image ?? null;

    const mergedValues: RestaurantFormValues = {
      ...initialValues,
      ...values,
      tags: values.tags ?? initialValues.tags,
      openingHours,
      image: imageFile ?? initialValues.image,
    };

    try {
      if (isEdit && kitchenId) {
        const formData = buildKitchenFormData(mergedValues, { isUpdate: true });
        await updateKitchen({ kitchenId, formData });
        onSave?.(mergedValues);
        onOpenChange(false);
        return;
      }

      await createKitchen(buildKitchenFormData(mergedValues));
      onOpenChange(false);
    } catch {
      toast.error("Failed to save kitchen");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor="restaurant-name">Kitchen Name</Label>
            <Input
              {...field}
              id="restaurant-name"
              placeholder="Kitchen name"
              className="h-11"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && (
              <p className="text-sm text-destructive">
                {fieldState.error?.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="restaurant-description">Kitchen Description</Label>
            <Textarea
              {...field}
              id="restaurant-description"
              placeholder="Enter a description for this kitchen"
              rows={4}
              className="resize-none rounded-sm border border-border bg-transparent px-2.5 py-1 text-base transition-colors duration-200 outline-none focus-visible:outline-none placeholder:text-muted-foreground md:text-sm"
            />
          </div>
        )}
      />

      <Controller
        name="tags"
        control={form.control}
        render={({ field }) => (
          <CustomTagInput
            value={field.value ?? []}
            onChange={(tags) => field.onChange(tags)}
            placeholder="Add a tag that best describes your kitchen"
          />
        )}
      />

      <div className="space-y-2">
        <Label>Kitchen Image</Label>
        <Controller
          name="image"
          control={form.control}
          defaultValue={initialValues.image ?? null}
          render={({ field }) => (
            <>
                <ImageUpload
                  value={field.value ?? null}
                  existingImageUrl={isEdit ? existingImageUrl : null}
                  existingImageAlt={existingImageAlt ?? "Kitchen image"}
                  onChange={(file) => {
                    field.onChange(file);
                    form.clearErrors("image");
                  }}
                />
              {form.formState.errors.image?.message && (
                <p className="text-sm text-destructive">{String(form.formState.errors.image?.message)}</p>
              )}
            </>
          )}
        />
      </div>

      <Controller
        name="isOpen"
        control={form.control}
        render={({ field }) => (
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Kitchen open
              </p>
              <p className="text-sm text-muted-foreground">
                Allow this kitchen to accept orders
              </p>
            </div>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-label="Kitchen open"
            />
          </div>
        )}
      />

      <OpeningHoursEditor
        rows={openingHours}
        onChange={(rows) => setOpeningHours(rows)}
      />

      <Button type="submit" className="mt-2 h-11 w-full" disabled={isSaving}>
        {isSaving ? "Saving..." : isEdit ? "Save changes" : "Add kitchen"}
      </Button>
    </form>
  );
}

function RestaurantFormModalContent({
  onOpenChange,
  kitchenId,
  onSave,
}: Omit<RestaurantFormModalProps, "open">) {
  const isEdit = Boolean(kitchenId);
  const {
    data: kitchen,
    isPending: isKitchenPending,
    isError,
    error,
  } = useKitchenDetailForEdit(isEdit ? kitchenId : undefined);

  if (isEdit && isKitchenPending) {
    return (
      <BaseModal
        title="Edit Kitchen"
        open
        onOpenChange={onOpenChange}
        layout="detail"
        size="lg"
        className="max-w-2xl"
      >
        <AppLoader className="py-12" />
      </BaseModal>
    );
  }

  if (isEdit && isError) {
    throw error;
  }

  const initialValues =
    isEdit && kitchen ? restaurantToFormValues(kitchen) : createEmptyValues();

  return (
    <BaseModal
      title={isEdit ? "Edit Kitchen" : "Add New Kitchen"}
      open
      onOpenChange={onOpenChange}
      layout="detail"
      size="lg"
      className="max-w-2xl"
    >
      <KitchenForm
        key={kitchenId ?? "new"}
        initialValues={initialValues}
        isEdit={isEdit}
        kitchenId={kitchenId}
        existingImageUrl={kitchen?.imageUrl}
        existingImageAlt={kitchen?.name}
        onOpenChange={onOpenChange}
        onSave={onSave}
      />
    </BaseModal>
  );
}

export function RestaurantFormModal({
  open,
  onOpenChange,
  kitchenId,
  onSave,
}: RestaurantFormModalProps) {
  if (!open) {
    return null;
  }

  return (
    <RestaurantFormModalContent
      key={kitchenId ?? "new"}
      kitchenId={kitchenId}
      onOpenChange={onOpenChange}
      onSave={onSave}
    />
  );
}
