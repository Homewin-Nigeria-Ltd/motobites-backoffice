import { RestaurantMenuSection } from "@/features/restaurant"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function KitchenMenuItemsPage({ params }: PageProps) {
  const { id } = await params

  return (
    <RestaurantMenuSection restaurantId={decodeURIComponent(id)} />
  )
}
