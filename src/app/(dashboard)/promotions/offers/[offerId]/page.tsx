import { OfferDetailSection } from "@/features/promotions/sections/offer-detail-section"

type OfferDetailPageProps = {
  params: Promise<{
    offerId: string
  }>
}

export default async function OfferDetailPage({ params }: OfferDetailPageProps) {
  const { offerId } = await params

  return <OfferDetailSection offerId={offerId} />
}
