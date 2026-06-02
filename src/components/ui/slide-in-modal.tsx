"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Icons } from "@/components/ui/icons"
import { OverlayPortalContainer } from "@/components/overlay-portal-container"
import { cn } from "@/lib/utils"

export type SlideInPanelSize = "standard" | "wide"

/** Overrides SheetContent defaults (w-3/4 + sm:max-w-sm) on desktop */
const panelWidth: Record<SlideInPanelSize, string> = {
  standard:
    "data-[side=right]:w-full data-[side=right]:max-w-full sm:data-[side=right]:w-[32.5rem] sm:data-[side=right]:max-w-[32.5rem]",
  wide:
    "data-[side=right]:w-full data-[side=right]:max-w-full sm:data-[side=right]:w-[42.5rem] sm:data-[side=right]:max-w-[42.5rem]",
}

export type SlideInModalProps = {
  title: string
  children: React.ReactNode
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  closeLabel?: string
  toolbar?: React.ReactNode
  footer?: React.ReactNode
  panel?: SlideInPanelSize
  className?: string
  bodyClassName?: string
  asForm?: boolean
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}

export function SlideInModal({
  title,
  children,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  closeLabel = "Close",
  toolbar,
  footer,
  panel = "standard",
  className,
  bodyClassName,
  asForm = false,
  onSubmit,
}: SlideInModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const body = (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto px-4 sm:px-6",
        footer ? "pb-4 sm:pb-6" : "pb-6 sm:pb-8",
        bodyClassName
      )}
    >
      {children}
    </div>
  )

  const footerNode = footer ? (
    <div className="shrink-0 border-t border-border px-4 py-4 sm:px-6 sm:py-5">
      {footer}
    </div>
  ) : null

  const main = asForm ? (
    <form
      onSubmit={onSubmit}
      className="flex min-h-0 flex-1 flex-col"
    >
      {body}
      {footerNode}
    </form>
  ) : (
    <>
      {body}
      {footerNode}
    </>
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger ? <SheetTrigger asChild>{trigger}</SheetTrigger> : null}
      <SheetContent
        side="right"
        showCloseButton={false}
        className={cn(
          "flex h-full flex-col gap-0 border-l border-border bg-background p-0 shadow-2xl",
          panelWidth[panel],
          className
        )}
      >
        <div className="flex shrink-0 items-center justify-between px-4 pt-5 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
          <SheetTitle className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </SheetTitle>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full border border-border bg-muted text-muted-foreground hover:bg-muted/80"
              aria-label={closeLabel}
            >
              <Icons.close size={16} />
            </Button>
          </SheetClose>
        </div>

        {toolbar ? (
          <div className="shrink-0 px-4 pb-4 sm:px-6 sm:pb-5">{toolbar}</div>
        ) : null}

        <OverlayPortalContainer className="flex min-h-0 flex-1 flex-col">
          {main}
        </OverlayPortalContainer>
      </SheetContent>
    </Sheet>
  )
}
