"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ChatComposerProps = {
  disabled?: boolean
  onSend: (message: string) => void
  onCloseConversation: () => void
}

export function ChatComposer({
  disabled = false,
  onSend,
  onCloseConversation,
}: ChatComposerProps) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    const trimmed = message.trim()

    if (!trimmed || disabled) {
      return
    }

    setMessage("")
    onSend(trimmed)
  }

  return (
    <div className="shrink-0 border-t border-border bg-background px-4 py-4 md:px-6">
      <div className="flex items-center gap-3">
        <Input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type your message..."
          className="h-11 flex-1"
          disabled={disabled}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              handleSend()
            }
          }}
        />

        <Button
          type="button"
          className="h-11 shrink-0 rounded-xl px-4"
          disabled={disabled || !message.trim()}
          onClick={handleSend}
          icon={{ name: "send", position: "left" }}
        >
          Send
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="h-11 shrink-0 rounded-xl px-4"
          disabled={disabled}
          onClick={onCloseConversation}
        >
          Close Conversation
        </Button>
      </div>
    </div>
  )
}
