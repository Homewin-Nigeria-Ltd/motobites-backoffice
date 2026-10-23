"use client"

import { useState, type FormEvent } from "react"

import { useDebouncedSearch } from "@/features/restaurant/hooks/use-debounced-search"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"

import { useBroadcastCustomers } from "../hooks/use-broadcast-customers"
import { useBroadcastNotification } from "../hooks/use-broadcast-notification"
import type {
  BroadcastCustomerOption,
  BroadcastNotificationType,
} from "../types"

type Audience = "all" | "selected"

export function BroadcastNotificationSection() {
  const [type, setType] = useState<BroadcastNotificationType>("in_app")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState<Audience>("all")
  const [selected, setSelected] = useState<BroadcastCustomerOption[]>([])
  const { value: search, setValue: setSearch, debouncedValue } =
    useDebouncedSearch("")
  const { sendBroadcast, isPending } = useBroadcastNotification()
  const { data: customers = [], isFetching } = useBroadcastCustomers(
    debouncedValue,
    audience === "selected"
  )

  const toggleCustomer = (customer: BroadcastCustomerOption) => {
    setSelected((current) => {
      const exists = current.some((item) => item.userId === customer.userId)

      if (exists) {
        return current.filter((item) => item.userId !== customer.userId)
      }

      return [...current, customer]
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedMessage = message.trim()

    if (!trimmedTitle || !trimmedMessage) {
      toast.error("Title and message are required.")
      return
    }

    if (audience === "selected" && selected.length === 0) {
      toast.error("Select at least one customer, or send to everyone.")
      return
    }

    try {
      await sendBroadcast({
        type,
        title: trimmedTitle,
        message: trimmedMessage,
        ...(audience === "selected"
          ? { user_ids: selected.map((customer) => customer.userId) }
          : {}),
      })
      setType("in_app")
      setTitle("")
      setMessage("")
      setSelected([])
      setSearch("")
      setAudience("all")
    } catch {
      // The mutation already reports the error.
    }
  }

  return (
    <div className="bg-muted p-4 md:p-6">
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="mx-auto flex max-w-2xl flex-col gap-6 rounded-2xl border border-border bg-background p-5 md:p-8"
      >
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Broadcast
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Send an in-app or SMS message to every customer, or only the people
            you select.
          </p>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-foreground">Type</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="broadcast-type"
              checked={type === "in_app"}
              onChange={() => setType("in_app")}
              disabled={isPending}
            />
            In-app
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="broadcast-type"
              checked={type === "sms"}
              onChange={() => setType("sms")}
              disabled={isPending}
            />
            SMS
          </label>
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="broadcast-title">Title</Label>
          <Input
            id="broadcast-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="A MotoBites update"
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="broadcast-message">Message</Label>
          <Textarea
            id="broadcast-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Enjoy our new menu this week."
            disabled={isPending}
            className="min-h-28"
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-foreground">
            Recipients
          </legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="broadcast-audience"
              checked={audience === "all"}
              onChange={() => setAudience("all")}
              disabled={isPending}
            />
            All customers
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="broadcast-audience"
              checked={audience === "selected"}
              onChange={() => setAudience("selected")}
              disabled={isPending}
            />
            Selected customers
          </label>
        </fieldset>

        {audience === "selected" ? (
          <div className="space-y-3">
            {selected.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selected.map((customer) => (
                  <button
                    key={customer.userId}
                    type="button"
                    onClick={() => toggleCustomer(customer)}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {customer.name} ×
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No customers selected.
              </p>
            )}

            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers"
              disabled={isPending}
            />

            <div className="max-h-64 overflow-y-auto rounded-xl border border-border">
              {isFetching && customers.length === 0 ? (
                <p className="px-3 py-4 text-sm text-muted-foreground">
                  Searching...
                </p>
              ) : customers.length === 0 ? (
                <p className="px-3 py-4 text-sm text-muted-foreground">
                  No customers found.
                </p>
              ) : (
                customers.map((customer) => {
                  const checked = selected.some(
                    (item) => item.userId === customer.userId
                  )

                  return (
                    <label
                      key={customer.userId}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 border-b border-border px-3 py-3 last:border-b-0",
                        checked && "bg-secondary/60"
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleCustomer(customer)}
                        disabled={isPending}
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {customer.name}
                        </span>
                        {customer.email ? (
                          <span className="block truncate text-xs text-muted-foreground">
                            {customer.email}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  )
                })
              )}
            </div>
          </div>
        ) : null}

        <Button type="submit" disabled={isPending} className="w-fit">
          {isPending ? "Sending..." : "Send notification"}
        </Button>
      </form>
    </div>
  )
}
