import { EditRiderSection } from "@/features/riders/sections/edit-rider-section"

type PageProps = {
  params: Promise<{ riderId: string }>
}

export default async function EditRiderPage({ params }: PageProps) {
  const { riderId } = await params

  return <EditRiderSection riderId={riderId} />
}
