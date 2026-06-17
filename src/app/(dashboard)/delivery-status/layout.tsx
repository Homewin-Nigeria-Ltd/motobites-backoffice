import { DeliveryStatusLayoutClient } from "./delivery-status-layout-client"

export default function DeliveryStatusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DeliveryStatusLayoutClient>{children}</DeliveryStatusLayoutClient>
}
