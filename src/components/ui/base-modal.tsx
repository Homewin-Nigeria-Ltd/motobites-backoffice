"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from "@/components/ui/icons"
import { OverlayPortalContainer } from "@/components/overlay-portal-container"
import { cn } from "@/lib/utils"

export type BaseModalLayout = "centered" | "detail"
export type BaseModalSize = "md" | "lg" | "xl"

const modalSizeClass: Record<BaseModalSize, string> = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-4xl",
}

export type BaseModalProps = {
  title: string
  children: React.ReactNode
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  closeLabel?: string
  headerIcon?: React.ReactNode
  footer?: React.ReactNode
  layout?: BaseModalLayout
  size?: BaseModalSize
  className?: string
  bodyClassName?: string
  headerClassName?: string
  closeButtonClassName?: string
  asForm?: boolean
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}

export function BaseModal({
  title,
  children,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  closeLabel = "Close",
  headerIcon,
  footer,
  layout = "centered",
  size = "md",
  className,
  bodyClassName,
  headerClassName,
  closeButtonClassName,
  asForm = false,
  onSubmit,
}: BaseModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const isDetail = layout === "detail"
  const resolvedSize = isDetail ? (size === "md" ? "xl" : size) : size

  const body = isDetail ? (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]",
        bodyClassName
      )}
    >
      <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6">{children}</div>
    </div>
  ) : (
    <div className={cn("flex flex-col gap-4 px-6 pb-6", bodyClassName)}>
      {children}
    </div>
  )

  const footerNode = footer ? (
    <div className="shrink-0 border-t border-border px-6 py-5">{footer}</div>
  ) : null

  const main = asForm ? (
    <form onSubmit={onSubmit} className="flex flex-col">
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
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        showCloseButton={false}
        className={cn(
          modalSizeClass[resolvedSize],
          "gap-0 overflow-hidden p-0",
          isDetail &&
            "flex max-h-[min(92dvh,calc(100vh-2rem))] flex-col",
          className
        )}
      >
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn(
              "absolute top-4 right-4 z-10 rounded-full bg-muted text-muted-foreground hover:bg-muted/80",
              isDetail && "top-5 right-5 size-9",
              closeButtonClassName
            )}
            aria-label={closeLabel}
          >
            <Icons.close size={16} />
          </Button>
        </DialogClose>

        {isDetail ? (
          <div className="flex shrink-0 items-center border-b border-border px-4 py-4 pr-12 sm:px-6 sm:py-5 sm:pr-14">
            <DialogTitle className="text-left text-xl font-semibold text-foreground">
              {title}
            </DialogTitle>
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col items-center px-6 pt-8 pb-2 text-center",
              headerClassName
            )}
          >
            {headerIcon ? (
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                {headerIcon}
              </div>
            ) : null}
            <DialogTitle className="text-lg font-semibold text-foreground">
              {title}
            </DialogTitle>
          </div>
        )}

        <OverlayPortalContainer
          className={isDetail ? "flex min-h-0 flex-1 flex-col" : undefined}
        >
          {main}
        </OverlayPortalContainer>
      </DialogContent>
    </Dialog>
  )
}
