import { Suspense } from "react"

import { AppLoader } from "@/components/ui/app-loader"
import { CustomerChatPageClient } from "./customer-chat-page-client"

export default function CustomerChatsPage() {
  return (
    <Suspense
      fallback={
        <AppLoader className="min-h-48 flex-1 rounded-2xl border border-border bg-background" />
      }
    >
      <CustomerChatPageClient />
    </Suspense>
  )
}
