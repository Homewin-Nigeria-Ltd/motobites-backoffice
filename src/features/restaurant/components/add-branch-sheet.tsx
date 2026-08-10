"use client"

import { useCreateFulfillmentBranch } from "@/features/restaurant/hooks/use-restaurant-mutations"
import { FulfillmentBranchForm } from "@/features/restaurant/components/fulfillment-branch-form"
import {
  fulfillmentBranchFormDefaults,
  type FulfillmentBranchFormValues,
} from "@/features/restaurant/schemas/fulfillment-branch-form.schema"
import { buildFulfillmentBranchPayload } from "@/features/restaurant/utils/build-fulfillment-branch-payload"
import { SlideInModal } from "@/components/ui/slide-in-modal"

type AddBranchSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddBranchSheet({ open, onOpenChange }: AddBranchSheetProps) {
  const { createBranch, isPending } = useCreateFulfillmentBranch()

  const handleSubmit = async (values: FulfillmentBranchFormValues) => {
    const result = await createBranch(buildFulfillmentBranchPayload(values))

    if (!result.success) {
      return
    }

    onOpenChange(false)
  }

  return (
    <SlideInModal
      title="Add Branch"
      panel="standard"
      open={open}
      onOpenChange={onOpenChange}
      closeLabel="Close add branch form"
      bodyClassName="space-y-5"
    >
      {open ? (
        <FulfillmentBranchForm
          formKey="add-branch"
          defaultValues={fulfillmentBranchFormDefaults}
          isPending={isPending}
          submitLabel="Add Branch"
          pendingLabel="Creating..."
          onSubmit={handleSubmit}
        />
      ) : null}
    </SlideInModal>
  )
}
