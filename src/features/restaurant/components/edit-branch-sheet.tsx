"use client"

import { useUpdateFulfillmentBranch } from "@/features/restaurant/hooks/use-restaurant-mutations"
import { FulfillmentBranchForm } from "@/features/restaurant/components/fulfillment-branch-form"
import type { FulfillmentBranchFormValues } from "@/features/restaurant/schemas/fulfillment-branch-form.schema"
import type { FulfillmentBranch } from "@/features/restaurant/types"
import { buildFulfillmentBranchPayload } from "@/features/restaurant/utils/build-fulfillment-branch-payload"
import { mapFulfillmentBranchToFormValues } from "@/features/restaurant/utils/fulfillment-branch"
import { SlideInModal } from "@/components/ui/slide-in-modal"

type EditBranchSheetProps = {
  branch: FulfillmentBranch | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditBranchSheet({
  branch,
  open,
  onOpenChange,
}: EditBranchSheetProps) {
  const { updateBranch, isPending } = useUpdateFulfillmentBranch()

  const handleSubmit = async (values: FulfillmentBranchFormValues) => {
    if (!branch) {
      return
    }

    const result = await updateBranch({
      id: branch.id,
      ...buildFulfillmentBranchPayload(values),
    })

    if (!result.success) {
      return
    }

    onOpenChange(false)
  }

  return (
    <SlideInModal
      title="Edit Branch"
      panel="standard"
      open={open}
      onOpenChange={onOpenChange}
      closeLabel="Close edit branch form"
      bodyClassName="space-y-5"
    >
      {open && branch ? (
        <FulfillmentBranchForm
          formKey={`edit-branch-${branch.id}`}
          defaultValues={mapFulfillmentBranchToFormValues(branch)}
          isPending={isPending}
          submitLabel="Save Changes"
          pendingLabel="Saving..."
          onSubmit={handleSubmit}
        />
      ) : null}
    </SlideInModal>
  )
}
