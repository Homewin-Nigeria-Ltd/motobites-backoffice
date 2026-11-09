"use client"

import { useState } from "react"
import Link from "next/link"

import { ChatComposer } from "../components/chat-composer"
import { ChatConversationList } from "../components/chat-conversation-list"
import { ChatFilterTabs } from "../components/chat-filter-tabs"
import { ChatMessageList } from "../components/chat-message-list"
import { useCustomerChat } from "../hooks/use-customer-chat"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type CustomerChatSectionProps = {
  initialChatId?: string | null
}

export function CustomerChatSection({ initialChatId }: CustomerChatSectionProps) {
  const {
    filter,
    setFilter,
    search,
    setSearch,
    conversations,
    activeCustomer,
    activeChatId,
    messages,
    selectedConversationId,
    isSelectedClosed,
    selectConversation,
    sendMessage,
    closeConversation,
    isLoading,
    isMessagesLoading,
    isError,
    error,
    customerAvatar,
  } = useCustomerChat(initialChatId)
  const [mobilePane, setMobilePane] = useState<"list" | "thread">(
    initialChatId ? "thread" : "list"
  )

  const openConversation = (conversationId: string) => {
    selectConversation(conversationId)
    setMobilePane("thread")
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="flex h-[calc(100dvh-6.5rem)] min-h-[32rem] overflow-hidden rounded-2xl border border-border bg-background">
        <aside
          className={cn(
            "min-h-0 w-full shrink-0 flex-col overflow-hidden border-r border-border md:flex md:max-w-sm",
            mobilePane === "thread" ? "hidden" : "flex"
          )}
        >
          <div className="shrink-0 space-y-4 border-b border-border px-4 py-5">
            <h1 className="text-lg font-semibold text-foreground">Chats</h1>
            <ChatFilterTabs value={filter} onChange={setFilter} />
            <Input
              type="search"
              icon={{ name: "search", position: "left" }}
              placeholder="Search"
              className="h-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {isLoading && conversations.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-6">
              <AppLoader />
            </div>
          ) : (
            <ChatConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelect={openConversation}
            />
          )}
        </aside>

        <section
          className={cn(
            "min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex",
            mobilePane === "thread" ? "flex" : "hidden"
          )}
        >
          {activeChatId ? (
            <>
              <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-4 md:px-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Back to chats"
                  onClick={() => setMobilePane("list")}
                >
                  <Icons.chevronLeft />
                </Button>
                {activeCustomer ? (
                  <h2 className="text-base font-semibold text-foreground">
                    <Link
                      href={`/customers/${activeCustomer.id}`}
                      className="hover:text-primary"
                    >
                      {activeCustomer.name}
                    </Link>
                  </h2>
                ) : (
                  <h2 className="text-base font-semibold text-foreground">
                    Loading...
                  </h2>
                )}
              </div>

              <div className="min-h-0 flex-1 overflow-hidden">
                {isMessagesLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <AppLoader />
                  </div>
                ) : (
                  <ChatMessageList
                    messages={messages}
                    customerAvatar={customerAvatar}
                    customerName={activeCustomer?.name ?? "Customer"}
                    customerId={activeCustomer?.id ?? null}
                  />
                )}
              </div>

              <ChatComposer
                disabled={isSelectedClosed || isMessagesLoading}
                onSend={sendMessage}
                onCloseConversation={closeConversation}
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
              Select a conversation to start chatting with a customer.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
