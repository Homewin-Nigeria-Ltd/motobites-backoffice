"use client"

import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { toast } from "@/lib/toast"

type ChatComposerProps = {
  disabled?: boolean
  onSend: (message: string, file?: File) => void
  onCloseConversation: () => void
}

export function ChatComposer({
  disabled = false,
  onSend,
  onCloseConversation,
}: ChatComposerProps) {
  const [message, setMessage] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canSend = Boolean(message.trim() || image)

  const handleSend = () => {
    if (!canSend || disabled) {
      return
    }

    onSend(message.trim(), image ?? undefined)
    setMessage("")
    setImage(null)
  }

  return (
    <div className="shrink-0 border-t border-border bg-background px-4 py-4 md:px-6">
      {image ? (
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={URL.createObjectURL(image)}
            alt={image.name}
            className="size-12 rounded-lg object-cover"
          />
          <span className="min-w-0 flex-1 truncate text-sm text-foreground">
            {image.name}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 rounded-full"
            aria-label="Remove image"
            onClick={() => setImage(null)}
          >
            <Icons.close size={16} />
          </Button>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 rounded-full"
          disabled={disabled}
          aria-label="Attach image"
          onClick={() => fileInputRef.current?.click()}
        >
          <Icons.camera size={18} />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ""

            if (!file) {
              return
            }

            if (!file.type.startsWith("image/")) {
              toast.error("Only image files are allowed.")
              return
            }

            setImage(file)
          }}
        />

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
          disabled={disabled || !canSend}
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
