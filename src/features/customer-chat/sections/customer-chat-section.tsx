"use client"

import { ChatComposer } from "../components/chat-composer"
import { ChatConversationList } from "../components/chat-conversation-list"
import { ChatFilterTabs } from "../components/chat-filter-tabs"
import { ChatMessageList } from "../components/chat-message-list"
import { useCustomerChat } from "../hooks/use-customer-chat"
import { AppLoader } from "@/components/ui/app-loader"
import { Input } from "@/components/ui/input"

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

  if (isError) {
    throw error
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="flex h-[calc(100dvh-6.5rem)] min-h-[32rem] overflow-hidden rounded-2xl border border-border bg-background">
        <aside className="flex min-h-0 w-full max-w-sm shrink-0 flex-col overflow-hidden border-r border-border">
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
              onSelect={selectConversation}
            />
          )}
        </aside>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {activeChatId ? (
            <>
              <div className="shrink-0 border-b border-border px-4 py-4 md:px-6">
                <h2 className="text-base font-semibold text-foreground">
                  {activeCustomer?.name ?? "Loading..."}
                </h2>
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
