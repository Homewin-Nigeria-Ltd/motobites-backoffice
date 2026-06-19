import { IntegrationDetailSection } from "@/features/settings"

type PageProps = {
  params: Promise<{ integrationId: string }>
}

export default async function IntegrationDetailPage({ params }: PageProps) {
  const { integrationId } = await params

  return (
    <IntegrationDetailSection integrationId={decodeURIComponent(integrationId)} />
  )
}
