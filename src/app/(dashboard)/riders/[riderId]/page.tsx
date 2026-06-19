import { RiderProfileSection } from "@/features/riders/sections/rider-profile-section"

type PageProps = {
  params: Promise<{ riderId: string }>
}

export default async function RiderProfilePage({ params }: PageProps) {
  const { riderId } = await params

  return <RiderProfileSection riderId={riderId} />
}
