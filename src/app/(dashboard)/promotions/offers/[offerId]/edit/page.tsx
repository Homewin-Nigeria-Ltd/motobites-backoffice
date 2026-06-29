import { EditOfferSection } from "@/features/promotions/sections/edit-offer-section"

type EditOfferPageProps = {
  params: Promise<{
    offerId: string
  }>
}

export default async function EditOfferPage({ params }: EditOfferPageProps) {
  const { offerId } = await params

  return <EditOfferSection offerId={offerId} />
}
