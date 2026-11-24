import { EditSpecialGiftOfferSection } from "@/features/promotions/sections/edit-special-gift-offer-section"

type EditSpecialGiftOfferPageProps = {
  params: Promise<{
    offerId: string
  }>
}

export default async function EditSpecialGiftOfferPage({
  params,
}: EditSpecialGiftOfferPageProps) {
  const { offerId } = await params

  return <EditSpecialGiftOfferSection offerId={offerId} />
}
