"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { ACTIVE_RIDER_STORAGE_KEY, RIDER_ID_PARAM } from "@/features/rider-chat/constants"
import { RiderChatSection } from "@/features/rider-chat"
import { useLocalStorage } from "@/hooks/use-local-storage"

function parseRiderId(value: string | null) {
  if (!value) {
    return null
  }

  const riderId = Number(value)

  return Number.isFinite(riderId) ? riderId : null
}

export function RiderChatPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlRiderId = parseRiderId(searchParams.get(RIDER_ID_PARAM))
  const [, setStoredRiderId] = useLocalStorage<number | null>(
    ACTIVE_RIDER_STORAGE_KEY,
    null
  )

  useEffect(() => {
    if (urlRiderId === null) {
      return
    }

    setStoredRiderId(urlRiderId)
    router.replace("/riders/chat")
  }, [router, setStoredRiderId, urlRiderId])

  return <RiderChatSection initialRiderId={urlRiderId} />
}
