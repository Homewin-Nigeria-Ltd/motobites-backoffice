"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { useRiderDetail } from "@/features/riders"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { riderChatKeys } from "../api/keys"
import { ACTIVE_RIDER_STORAGE_KEY } from "../constants"
import {
  appendMessageToCache,
  createPendingMessage,
  removeMessageFromCache,
  replacePendingMessageInCache,
} from "../utils/message-cache"
import { useRiderChatConversations } from "./use-rider-chat-conversations"
import { useRiderChatMessages } from "./use-rider-chat-messages"
import { useRiderChatRealtime } from "./use-rider-chat-realtime"
import { useSendRiderChatMessage } from "./use-send-rider-chat-message"
import type {
  ApiSupportConversation,
  ApiSupportConversationRider,
  RiderChatFilter,
} from "../types"

const SEARCH_DEBOUNCE_MS = 300

function isConversationClosed(
  conversation: ApiSupportConversation,
  closedRiderIds: number[]
) {
  return closedRiderIds.includes(conversation.rider.id)
}

function toConversationRider(rider: {
  id: number
  name: string
  first_name: string
  last_name: string | null
  profile: { avatar: string | null }
}): ApiSupportConversationRider {
  return {
    id: rider.id,
    name: rider.name,
    first_name: rider.first_name,
    last_name: rider.last_name,
    profile: { avatar: rider.profile.avatar },
  }
}

export function useRiderChat(initialRiderId?: number | null) {
  const [filter, setFilter] = useState<RiderChatFilter>("all")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [closedRiderIds, setClosedRiderIds] = useState<number[]>([])
  const [storedRiderId, setStoredRiderId] = useLocalStorage<number | null>(
    ACTIVE_RIDER_STORAGE_KEY,
    null
  )

  const activeRiderId = initialRiderId ?? storedRiderId

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [search])

  const {
    data: conversationsResponse,
    isPending: isConversationsPending,
    isError: isConversationsError,
    error: conversationsError,
  } = useRiderChatConversations({
    page: 1,
    per_page: 20,
  })

  const conversations = useMemo(
    () => conversationsResponse?.data ?? [],
    [conversationsResponse?.data]
  )

  useEffect(() => {
    if (isConversationsPending || conversations.length === 0) {
      return
    }

    if (activeRiderId !== null) {
      return
    }

    setStoredRiderId(conversations[0].rider.id)
  }, [
    activeRiderId,
    conversations,
    isConversationsPending,
    setStoredRiderId,
  ])

  const hasExistingConversation = useMemo(
    () =>
      activeRiderId !== null &&
      conversations.some((conversation) => conversation.rider.id === activeRiderId),
    [activeRiderId, conversations]
  )

  const shouldFetchRiderDetail =
    Boolean(activeRiderId) &&
    !isConversationsPending &&
    !hasExistingConversation

  const {
    data: riderDetail,
    isPending: isRiderDetailPending,
    isError: isRiderDetailError,
    error: riderDetailError,
  } = useRiderDetail(activeRiderId ?? "", {
    enabled: shouldFetchRiderDetail,
  })

  const {
    data: messagesResponse,
    isPending: isMessagesPending,
    isError: isMessagesError,
    error: messagesError,
  } = useRiderChatMessages(activeRiderId)

  const { sendMessage } = useSendRiderChatMessage()
  const queryClient = useQueryClient()

  const messages = useMemo(
    () => messagesResponse?.data ?? [],
    [messagesResponse?.data]
  )

  const filteredConversations = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase()

    return conversations.filter((conversation) => {
      const isClosed = isConversationClosed(conversation, closedRiderIds)

      if (filter === "unread" && conversation.unread_count === 0) {
        return false
      }

      if (filter === "closed" && !isClosed) {
        return false
      }

      if (filter === "all" && isClosed) {
        return false
      }

      if (!query) {
        return true
      }

      const latestMessage = conversation.latest_message?.message ?? ""

      return (
        conversation.rider.name.toLowerCase().includes(query) ||
        latestMessage.toLowerCase().includes(query)
      )
    })
  }, [closedRiderIds, conversations, debouncedSearch, filter])

  const selectedConversation = useMemo(() => {
    return (
      conversations.find((conversation) => conversation.rider.id === activeRiderId) ??
      null
    )
  }, [activeRiderId, conversations])

  const activeRider = useMemo(() => {
    if (selectedConversation) {
      return selectedConversation.rider
    }

    if (!activeRiderId || !riderDetail || riderDetail.id !== activeRiderId) {
      return null
    }

    return toConversationRider(riderDetail)
  }, [activeRiderId, riderDetail, selectedConversation])

  const displayConversations = useMemo(() => {
    if (
      !activeRider ||
      conversations.some((conversation) => conversation.rider.id === activeRider.id)
    ) {
      return filteredConversations
    }

    const draftConversation: ApiSupportConversation = {
      rider: activeRider,
      latest_message: messages.at(-1) ?? null,
      unread_count: 0,
    }

    return [
      draftConversation,
      ...filteredConversations.filter(
        (conversation) => conversation.rider.id !== activeRider.id
      ),
    ]
  }, [activeRider, conversations, filteredConversations, messages])

  const isActiveRiderLoading =
    Boolean(activeRiderId) &&
    !activeRider &&
    (isConversationsPending || isRiderDetailPending)

  const isSelectedClosed = activeRiderId
    ? closedRiderIds.includes(activeRiderId)
    : false

  useRiderChatRealtime(activeRiderId, {
    enabled: Boolean(activeRiderId) && !isSelectedClosed,
  })

  const selectConversation = useCallback(
    (conversationId: string) => {
      const riderId = Number(conversationId)

      if (!Number.isFinite(riderId)) {
        return
      }

      setStoredRiderId(riderId)
    },
    [setStoredRiderId]
  )

  const handleSendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim()

      if (!trimmed || !activeRiderId) {
        return
      }

      const pendingMessage = createPendingMessage(activeRiderId, trimmed)

      appendMessageToCache(queryClient, activeRiderId, pendingMessage)

      sendMessage(
        {
          riderId: activeRiderId,
          message: trimmed,
        },
        {
          onSuccess: (response) => {
            if (response.data) {
              replacePendingMessageInCache(
                queryClient,
                activeRiderId,
                pendingMessage.id,
                response.data
              )
            } else {
              removeMessageFromCache(
                queryClient,
                activeRiderId,
                pendingMessage.id
              )
              void queryClient.invalidateQueries({
                queryKey: riderChatKeys.messages(activeRiderId),
              })
            }
          },
          onError: () => {
            removeMessageFromCache(
              queryClient,
              activeRiderId,
              pendingMessage.id
            )
          },
        }
      )
    },
    [activeRiderId, queryClient, sendMessage]
  )

  const closeConversation = useCallback(() => {
    if (!activeRiderId) {
      return
    }

    setClosedRiderIds((current) =>
      current.includes(activeRiderId) ? current : [...current, activeRiderId]
    )
  }, [activeRiderId])

  const isLoading =
    isConversationsPending ||
    isActiveRiderLoading ||
    (Boolean(activeRiderId) && isMessagesPending)
  const isMessagesLoading = Boolean(activeRiderId) && isMessagesPending

  return {
    filter,
    setFilter,
    search,
    setSearch,
    conversations: displayConversations,
    activeRider,
    activeRiderId,
    selectedConversation,
    messages,
    selectedConversationId: activeRiderId ? String(activeRiderId) : "",
    isSelectedClosed,
    selectConversation,
    sendMessage: handleSendMessage,
    closeConversation,
    isLoading,
    isActiveRiderLoading,
    isMessagesLoading,
    isError:
      isConversationsError ||
      isMessagesError ||
      (shouldFetchRiderDetail && isRiderDetailError),
    error: conversationsError ?? messagesError ?? riderDetailError,
  }
}
