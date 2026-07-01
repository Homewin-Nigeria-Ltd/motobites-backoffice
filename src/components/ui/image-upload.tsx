"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { toImageSrc } from "@/lib/image-url"
import { cn } from "@/lib/utils"

type ImageUploadProps = {
  value?: File | null
  existingImageUrl?: string | null
  existingImageAlt?: string
  onChange?: (file: File | null) => void
  onExistingImageRemove?: () => void
  accept?: string
  className?: string
  disabled?: boolean
  id?: string
}

function ImageUpload({
  value = null,
  existingImageUrl = null,
  existingImageAlt = "Current image",
  onChange,
  onExistingImageRemove,
  accept = "image/png,image/jpeg,image/jpg",
  className,
  disabled = false,
  id,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const inputId = React.useId()
  const resolvedId = id ?? inputId
  const [isDragging, setIsDragging] = React.useState(false)
  const [dismissedImageUrl, setDismissedImageUrl] = React.useState<string | null>(
    null
  )

  const filePreviewUrl = React.useMemo(() => {
    if (!value) return null
    return URL.createObjectURL(value)
  }, [value])

  React.useEffect(() => {
    if (!filePreviewUrl) return
    return () => URL.revokeObjectURL(filePreviewUrl)
  }, [filePreviewUrl])

  const showExistingImage =
    Boolean(existingImageUrl) && dismissedImageUrl !== existingImageUrl

  const previewUrl =
    filePreviewUrl ??
    (showExistingImage && existingImageUrl ? toImageSrc(existingImageUrl) : null)

  const setFile = (file: File | null) => {
    onChange?.(file)
    if (!file && existingImageUrl) {
      setDismissedImageUrl(null)
    }
    if (!file && inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const clearPreview = () => {
    if (value) {
      setFile(null)
      return
    }

    if (existingImageUrl) {
      setDismissedImageUrl(existingImageUrl)
      onExistingImageRemove?.()
    }
  }

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setFile(file)
  }

  const openPicker = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  if (previewUrl) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-border bg-muted",
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt={value ? "Upload preview" : existingImageAlt}
          className="aspect-video w-full object-cover"
        />
        <div className="absolute inset-0 flex items-end justify-end gap-2 bg-linear-to-t from-foreground/50 to-transparent p-3">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={disabled}
            onClick={clearPreview}
          >
            Remove
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={disabled}
            icon={{ name: "upload", position: "left", size: 14 }}
            onClick={openPicker}
          >
            Change
          </Button>
        </div>
        <input
          ref={inputRef}
          id={resolvedId}
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    )
  }

  return (
    <div className={className}>
      <button
        type="button"
        disabled={disabled}
        onClick={openPicker}
        onDragEnter={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          if (disabled) return
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-primary/30 bg-secondary hover:bg-secondary/80",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/15">
          <Icons.upload size={28} className="text-primary" />
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">Upload Files</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Click or drag image to upload. PNG and JPG are allowed
          </p>
        </div>
      </button>
      <input
        ref={inputRef}
        id={resolvedId}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}

export { ImageUpload }
