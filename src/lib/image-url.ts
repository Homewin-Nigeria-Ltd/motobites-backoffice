export function toImageSrc(url: string | null | undefined): string {
  if (!url || url.trim() === "") {
    return "/images/placeholder-menu.jpg"
  }

  return url.startsWith("http") ? url : `https://${url}`
}
