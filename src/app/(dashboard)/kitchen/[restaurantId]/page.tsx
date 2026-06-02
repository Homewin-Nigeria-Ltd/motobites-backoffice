import { RestaurantMenuSection } from "@/features/restaurant"

type PageProps = {
  params: Promise<{ restaurantId: string }>
}

export default async function RestaurantMenuPage({ params }: PageProps) {
  const { restaurantId } = await params

  return <RestaurantMenuSection restaurantId={decodeURIComponent(restaurantId)} />
}
