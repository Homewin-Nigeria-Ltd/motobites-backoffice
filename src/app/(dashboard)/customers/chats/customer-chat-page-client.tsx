"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import {
  ACTIVE_CHAT_STORAGE_KEY,
  CHAT_ID_PARAM,
} from "@/features/customer-chat/constants"
import { CustomerChatSection } from "@/features/customer-chat"
import { useLocalStorage } from "@/hooks/use-local-storage"

export function CustomerChatPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlChatId = searchParams.get(CHAT_ID_PARAM)
  const [, setStoredChatId] = useLocalStorage<string | null>(
    ACTIVE_CHAT_STORAGE_KEY,
    null
  )

  useEffect(() => {
    if (!urlChatId) {
      return
    }

    setStoredChatId(urlChatId)
    router.replace("/customers/chats")
  }, [router, setStoredChatId, urlChatId])

  return <CustomerChatSection initialChatId={urlChatId} />
}
