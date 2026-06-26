"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { useLocalStorage } from "@/hooks/use-local-storage"
import { customerChatKeys } from "../api/keys"
import { ACTIVE_CHAT_STORAGE_KEY } from "../constants"
import {
  getCustomerAvatar,
  getConversationPreview,
  isChatClosed,
  sortMessagesChronologically,
} from "../utils/chat-helpers"
import {
  appendMessageToCache,
  createPendingMessage,
  removeMessageFromCache,
  replacePendingMessageInCache,
} from "../utils/message-cache"
import {
  useCustomerChatConversations,
  useCustomerChatDetail,
} from "./use-customer-chat-queries"
import {
  useCloseCustomerChatConversation,
  useSendCustomerChatMessage,
} from "./use-customer-chat-mutations"
import { useCustomerChatRealtime } from "./use-customer-chat-realtime"
import type { ApiCustomerChatListItem, CustomerChatFilter } from "../types"

const SEARCH_DEBOUNCE_MS = 300

function matchesFilter(
  conversation: ApiCustomerChatListItem,
  filter: CustomerChatFilter
) {
  const unreadCount = conversation.unread_count ?? 0

  if (filter === "unread" && unreadCount === 0) {
    return false
  }

  if (filter === "closed" && !isChatClosed(conversation)) {
    return false
  }

  if (filter === "all" && isChatClosed(conversation)) {
    return false
  }

  return true
}

export function useCustomerChat(initialChatId?: string | null) {
  const [filter, setFilter] = useState<CustomerChatFilter>("all")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [storedChatId, setStoredChatId] = useLocalStorage<string | null>(
    ACTIVE_CHAT_STORAGE_KEY,
    null
  )

  const activeChatId = initialChatId ?? storedChatId

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
  } = useCustomerChatConversations({
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

    if (activeChatId) {
      return
    }

    setStoredChatId(conversations[0].id)
  }, [activeChatId, conversations, isConversationsPending, setStoredChatId])

  const {
    data: chatDetailResponse,
    isPending: isDetailPending,
    isError: isDetailError,
    error: detailError,
  } = useCustomerChatDetail(activeChatId)

  const { sendMessage } = useSendCustomerChatMessage()
  const { closeConversation: closeConversationMutation } =
    useCloseCustomerChatConversation()
  const queryClient = useQueryClient()

  const selectedConversation = chatDetailResponse?.data ?? null
  const messages = useMemo(
    () => sortMessagesChronologically(selectedConversation?.messages ?? []),
    [selectedConversation?.messages]
  )

  const filteredConversations = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase()

    return conversations.filter((conversation) => {
      if (!matchesFilter(conversation, filter)) {
        return false
      }

      if (!query) {
        return true
      }

      const preview = getConversationPreview(conversation) ?? ""

      return (
        conversation.customer.name.toLowerCase().includes(query) ||
        preview.toLowerCase().includes(query)
      )
    })
  }, [conversations, debouncedSearch, filter])

  const activeCustomer = selectedConversation?.customer ?? null
  const isSelectedClosed = selectedConversation
    ? isChatClosed(selectedConversation)
    : false

  useCustomerChatRealtime(activeChatId, {
    enabled: Boolean(activeChatId) && !isSelectedClosed,
  })

  const selectConversation = useCallback(
    (conversationId: string) => {
      if (!conversationId.trim()) {
        return
      }

      setStoredChatId(conversationId)
    },
    [setStoredChatId]
  )

  const handleSendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim()

      if (!trimmed || !activeChatId || isSelectedClosed) {
        return
      }

      const pendingMessage = createPendingMessage(trimmed)

      appendMessageToCache(queryClient, activeChatId, pendingMessage)

      sendMessage(
        {
          chatId: activeChatId,
          body: trimmed,
        },
        {
          onSuccess: (response) => {
            if (response.data) {
              replacePendingMessageInCache(
                queryClient,
                activeChatId,
                pendingMessage.id,
                response.data
              )
            } else {
              removeMessageFromCache(
                queryClient,
                activeChatId,
                pendingMessage.id
              )
              void queryClient.invalidateQueries({
                queryKey: customerChatKeys.detail(activeChatId),
              })
            }
          },
          onError: () => {
            removeMessageFromCache(
              queryClient,
              activeChatId,
              pendingMessage.id
            )
          },
        }
      )
    },
    [activeChatId, isSelectedClosed, queryClient, sendMessage]
  )

  const closeConversation = useCallback(() => {
    if (!activeChatId || isSelectedClosed) {
      return
    }

    closeConversationMutation({ chatId: activeChatId })
  }, [activeChatId, closeConversationMutation, isSelectedClosed])

  const isLoading =
    isConversationsPending || (Boolean(activeChatId) && isDetailPending)
  const isMessagesLoading = Boolean(activeChatId) && isDetailPending

  return {
    filter,
    setFilter,
    search,
    setSearch,
    conversations: filteredConversations,
    activeCustomer,
    activeChatId,
    selectedConversation,
    messages,
    selectedConversationId: activeChatId ?? "",
    isSelectedClosed,
    selectConversation,
    sendMessage: handleSendMessage,
    closeConversation,
    isLoading,
    isMessagesLoading,
    isError: isConversationsError || isDetailError,
    error: conversationsError ?? detailError,
    customerAvatar: activeCustomer ? getCustomerAvatar(activeCustomer) : null,
  }
}
