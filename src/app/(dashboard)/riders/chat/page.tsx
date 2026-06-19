import { Suspense } from "react"

import { RiderChatPageClient } from "./rider-chat-page-client"
import { AppLoader } from "@/components/ui/app-loader"

export default function RiderChatPage() {
  return (
    <Suspense
      fallback={
        <AppLoader className="min-h-48 flex-1 rounded-2xl border border-border bg-background" />
      }
    >
      <RiderChatPageClient />
    </Suspense>
  )
}
