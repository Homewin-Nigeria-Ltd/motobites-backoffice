import { EditGiftcardSection } from "@/features/promotions/sections/edit-giftcard-section"

type EditGiftcardPageProps = {
  params: Promise<{
    giftcardId: string
  }>
}

export default async function EditGiftcardPage({ params }: EditGiftcardPageProps) {
  const { giftcardId } = await params

  return <EditGiftcardSection giftcardId={giftcardId} />
}
