"use client"

import {
  formatDocumentDate,
  getDocumentFileName,
  getDocumentUrl,
} from "../utils/format-rider-profile"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

type RiderProfileDocumentProps = {
  url: string | null | undefined
  uploadedAt?: string | null
  label?: string
}

function isPdfDocument(url: string) {
  return /\.pdf($|\?)/i.test(url)
}

function isImageDocument(url: string) {
  return /\.(png|jpe?g|gif|webp|bmp|svg)($|\?)/i.test(url)
}

function DocumentPreview({ url, fileName }: { url: string; fileName: string }) {
  if (isImageDocument(url)) {
    return (
      <img
        src={url}
        alt={fileName}
        className="mx-auto max-h-[min(70vh,48rem)] w-full rounded-lg object-contain"
      />
    )
  }

  if (isPdfDocument(url)) {
    return (
      <iframe
        src={url}
        title={fileName}
        className="h-[min(70vh,48rem)] w-full rounded-lg border border-border bg-muted/20"
      />
    )
  }

  return (
    <iframe
      src={url}
      title={fileName}
      className="h-[min(70vh,48rem)] w-full rounded-lg border border-border bg-muted/20"
    />
  )
}

export function RiderProfileDocument({
  url,
  uploadedAt,
  label = "View document",
}: RiderProfileDocumentProps) {
  const fileName = getDocumentFileName(url)
  const fileUrl = getDocumentUrl(url)
  const uploadedLabel = formatDocumentDate(uploadedAt)

  if (!fileName || !fileUrl) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-8 text-center text-sm text-muted-foreground">
        No document uploaded
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-muted/20 px-6 py-8 text-center">
      <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <Icons.check size={20} />
      </div>
      <p className="text-sm font-semibold text-foreground">Upload Successful</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {fileName}
        {uploadedLabel ? ` · ${uploadedLabel}` : ""}
      </p>
      <BaseModal
        title={fileName}
        layout="detail"
        size="xl"
        trigger={
          <Button variant="outline" size="sm" className="mt-4">
            {label}
          </Button>
        }
      >
        <DocumentPreview url={fileUrl} fileName={fileName} />
      </BaseModal>
    </div>
  )
}
