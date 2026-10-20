import type { ApiPromotionalVideo, PromotionalVideo } from "../types"

const MAX_VIDEO_BYTES = 100 * 1024 * 1024

export function mapApiPromotionalVideo(
  video: ApiPromotionalVideo
): PromotionalVideo {
  const duration = video.duration_seconds ?? video.duration ?? 0

  return {
    id: String(video.id),
    title: video.title || "Untitled video",
    description: video.description?.trim() || "",
    duration,
    durationFormatted:
      video.duration_formatted?.trim() || formatVideoDuration(duration),
    sortOrder: video.sort_order ?? 0,
    isActive: video.is_active === true || video.is_active === 1,
    thumbnailUrl: video.thumbnail_url ?? video.thumbnail ?? null,
    videoUrl: video.video_url ?? video.video ?? null,
    videoStatus: video.video_status ?? null,
  }
}

export function formatVideoDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "—"
  }

  const total = Math.round(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60

  return `${mins}:${String(secs).padStart(2, "0")}`
}

export function isPromotionalVideoTooLarge(file: File) {
  return file.size > MAX_VIDEO_BYTES
}

export function buildPromotionalVideoFormData({
  title,
  description,
  duration,
  sortOrder,
  isActive,
  thumbnail,
  video,
}: {
  title: string
  description: string
  duration: number
  sortOrder: number
  isActive: boolean
  thumbnail?: File | null
  video?: File | null
}) {
  const formData = new FormData()
  formData.append("title", title.trim())
  formData.append("description", description.trim())
  formData.append("duration", String(Math.max(0, Math.round(duration))))
  formData.append("sort_order", String(Math.max(0, Math.round(sortOrder))))
  formData.append("is_active", isActive ? "1" : "0")

  if (thumbnail) {
    formData.append("thumbnail", thumbnail)
  }

  if (video) {
    formData.append("video", video)
  }

  return formData
}
