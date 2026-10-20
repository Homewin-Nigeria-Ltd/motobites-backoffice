"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"

import {
  usePromotionalVideo,
  usePromotionalVideos,
} from "@/features/restaurant/hooks/use-restaurant-queries"
import {
  useCreatePromotionalVideo,
  useDeletePromotionalVideo,
  useUpdatePromotionalVideo,
} from "@/features/restaurant/hooks/use-restaurant-mutations"
import type { PromotionalVideo } from "@/features/restaurant/types"
import {
  buildPromotionalVideoFormData,
  isPromotionalVideoTooLarge,
} from "@/features/restaurant/utils/promotional-video"
import { AppLoader } from "@/components/ui/app-loader"
import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { SlideInModal } from "@/components/ui/slide-in-modal"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toImageSrc } from "@/lib/image-url"
import { toast } from "@/lib/toast"

type PromotionalVideosSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type FormState = {
  title: string
  description: string
  duration: string
  sortOrder: string
  isActive: boolean
  thumbnail: File | null
  video: File | null
}

const emptyForm: FormState = {
  title: "",
  description: "",
  duration: "",
  sortOrder: "0",
  isActive: true,
  thumbnail: null,
  video: null,
}

function formFromVideo(video: PromotionalVideo): FormState {
  return {
    title: video.title,
    description: video.description,
    duration: String(video.duration || ""),
    sortOrder: String(video.sortOrder),
    isActive: video.isActive,
    thumbnail: null,
    video: null,
  }
}

function readVideoDuration(file: File) {
  return new Promise<number>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const el = document.createElement("video")
    el.preload = "metadata"
    el.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve(Math.round(el.duration) || 0)
    }
    el.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not read video duration"))
    }
    el.src = url
  })
}

function PromotionalVideoForm({
  videoId,
  onDone,
}: {
  videoId?: string
  onDone: () => void
}) {
  const isEdit = Boolean(videoId)
  const {
    data: video,
    isPending,
    isError,
    error,
  } = usePromotionalVideo(videoId, { enabled: isEdit })

  if (isEdit && isPending) {
    return <AppLoader className="py-12" />
  }

  if (isEdit && isError) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error
          ? error.message
          : "Failed to load promotional video."}
      </p>
    )
  }

  if (isEdit && !video) {
    return <AppLoader className="py-12" />
  }

  return (
    <PromotionalVideoFormFields
      key={videoId ?? "new"}
      initialVideo={video}
      onDone={onDone}
    />
  )
}

function PromotionalVideoFormFields({
  initialVideo,
  onDone,
}: {
  initialVideo?: PromotionalVideo
  onDone: () => void
}) {
  const isEdit = Boolean(initialVideo)
  const [form, setForm] = useState<FormState>(
    initialVideo ? formFromVideo(initialVideo) : emptyForm
  )
  const [error, setError] = useState("")
  const { createPromotionalVideo, isPending: isCreating } =
    useCreatePromotionalVideo()
  const { updatePromotionalVideo, isPending: isUpdating } =
    useUpdatePromotionalVideo()
  const isSaving = isCreating || isUpdating

  const thumbnailObjectUrl = useMemo(() => {
    if (!form.thumbnail) {
      return null
    }

    return URL.createObjectURL(form.thumbnail)
  }, [form.thumbnail])
  const thumbnailPreview =
    thumbnailObjectUrl ?? initialVideo?.thumbnailUrl ?? null

  useEffect(() => {
    return () => {
      if (thumbnailObjectUrl) {
        URL.revokeObjectURL(thumbnailObjectUrl)
      }
    }
  }, [thumbnailObjectUrl])

  const handleThumbnail = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setForm((current) => ({ ...current, thumbnail: file }))
  }

  const handleVideo = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return

    if (isPromotionalVideoTooLarge(file)) {
      setError("Video must be 100MB or less.")
      return
    }

    let duration = form.duration
    try {
      const seconds = await readVideoDuration(file)
      if (seconds > 0) {
        duration = String(seconds)
      }
    } catch {
      // keep manual duration
    }

    setError("")
    setForm((current) => ({ ...current, video: file, duration }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const title = form.title.trim()
    const duration = Number(form.duration)

    if (!title) {
      setError("Title is required.")
      return
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      setError("Duration in seconds is required.")
      return
    }

    if (!isEdit && (!form.thumbnail || !form.video)) {
      setError("Thumbnail and video are required.")
      return
    }

    const formData = buildPromotionalVideoFormData({
      title,
      description: form.description,
      duration,
      sortOrder: Number(form.sortOrder) || 0,
      isActive: form.isActive,
      thumbnail: form.thumbnail,
      video: form.video,
    })

    try {
      if (initialVideo) {
        await updatePromotionalVideo({ videoId: initialVideo.id, formData })
      } else {
        await createPromotionalVideo(formData)
      }
      onDone()
    } catch {
      // toast handled in mutation
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Field>
        <FieldLabel htmlFor="promo-title">Title</FieldLabel>
        <Input
          id="promo-title"
          value={form.title}
          onChange={(e) =>
            setForm((current) => ({ ...current, title: e.target.value }))
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="promo-description">Description</FieldLabel>
        <Textarea
          id="promo-description"
          value={form.description}
          onChange={(e) =>
            setForm((current) => ({
              ...current,
              description: e.target.value,
            }))
          }
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="promo-duration">Duration (seconds)</FieldLabel>
          <Input
            id="promo-duration"
            type="number"
            min={1}
            value={form.duration}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                duration: e.target.value,
              }))
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="promo-sort">Sort order</FieldLabel>
          <Input
            id="promo-sort"
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                sortOrder: e.target.value,
              }))
            }
          />
        </Field>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
        <FieldLabel htmlFor="promo-active" className="cursor-pointer">
          Active
        </FieldLabel>
        <Switch
          id="promo-active"
          checked={form.isActive}
          onCheckedChange={(checked) =>
            setForm((current) => ({ ...current, isActive: checked }))
          }
        />
      </div>
      <Field>
        <FieldLabel>Thumbnail {isEdit ? "(optional)" : ""}</FieldLabel>
        {thumbnailPreview ? (
          <div className="relative mb-2 h-32 overflow-hidden rounded-lg bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                form.thumbnail
                  ? thumbnailPreview
                  : toImageSrc(thumbnailPreview)
              }
              alt=""
              className="size-full object-cover"
            />
          </div>
        ) : null}
        <Input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => handleThumbnail(e.target.files)}
        />
      </Field>
      <Field>
        <FieldLabel>
          Video {isEdit ? "(optional, max 100MB)" : "(max 100MB)"}
        </FieldLabel>
        {form.video ? (
          <p className="mb-1 text-xs text-muted-foreground">{form.video.name}</p>
        ) : initialVideo?.videoUrl ? (
          <a
            href={initialVideo.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-1 inline-block text-xs font-medium text-primary hover:underline"
          >
            Current video
          </a>
        ) : null}
        <Input
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          onChange={(e) => {
            void handleVideo(e.target.files)
          }}
        />
      </Field>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="h-11 w-full" disabled={isSaving}>
        {isSaving
          ? isEdit
            ? "Saving..."
            : "Uploading..."
          : isEdit
            ? "Save changes"
            : "Add video"}
      </Button>
    </form>
  )
}

export function PromotionalVideosSheet({
  open,
  onOpenChange,
}: PromotionalVideosSheetProps) {
  const [view, setView] = useState<"list" | "form">("list")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: videos = [], isPending, isError, error: loadError } =
    usePromotionalVideos({ enabled: open })
  const { deletePromotionalVideo, isPending: isDeleting, pendingVideoId } =
    useDeletePromotionalVideo()

  const resetSheet = () => {
    setView("list")
    setEditingId(null)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      resetSheet()
    }
    onOpenChange(next)
  }

  const openCreate = () => {
    setEditingId(null)
    setView("form")
  }

  const openEdit = (videoId: string) => {
    setEditingId(videoId)
    setView("form")
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deletePromotionalVideo(deleteId)
      setDeleteId(null)
    } catch {
      toast.error("Failed to delete promotional video.")
    }
  }

  return (
    <>
      <SlideInModal
        title={
          view === "form"
            ? editingId
              ? "Edit promotional video"
              : "Add promotional video"
            : "Promotional Videos"
        }
        panel="wide"
        open={open}
        onOpenChange={handleOpenChange}
        closeLabel="Close promotional videos"
        bodyClassName="space-y-4"
        toolbar={
          view === "list" ? (
            <Button
              className="h-10"
              icon={{ name: "add", position: "left" }}
              onClick={openCreate}
            >
              Add video
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="h-10"
              onClick={() => {
                setView("list")
                setEditingId(null)
              }}
            >
              Back
            </Button>
          )
        }
      >
        {view === "list" ? (
          isPending ? (
            <AppLoader className="py-12" />
          ) : isError ? (
            <p className="text-sm text-destructive">
              {loadError instanceof Error
                ? loadError.message
                : "Failed to load promotional videos."}
            </p>
          ) : videos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No promotional videos yet.
            </p>
          ) : (
            <div className="space-y-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex gap-3 rounded-xl border border-border p-3"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {video.thumbnailUrl ? (
                      <Image
                        src={toImageSrc(video.thumbnailUrl)}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <Icons.video size={20} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {video.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {video.durationFormatted}
                          {video.videoStatus ? ` · ${video.videoStatus}` : ""}
                          {video.isActive ? " · Active" : " · Inactive"}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(video.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          disabled={isDeleting && pendingVideoId === video.id}
                          onClick={() => setDeleteId(video.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    {video.videoUrl ? (
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
                      >
                        Preview
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <PromotionalVideoForm
            videoId={editingId ?? undefined}
            onDone={resetSheet}
          />
        )}
      </SlideInModal>

      <BaseAlertDialog
        title="Delete promotional video"
        open={Boolean(deleteId)}
        onOpenChange={(next) => {
          if (!next) setDeleteId(null)
        }}
        confirmLabel="Delete"
        pendingLabel="Deleting..."
        confirmVariant="destructive"
        isPending={isDeleting}
        onConfirm={() => {
          void handleDelete()
        }}
      >
        This video will be removed from promotional videos.
      </BaseAlertDialog>
    </>
  )
}
