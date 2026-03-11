import { useEffect, useState } from "react"
import { API_ORIGIN } from "@/api/config"
import { instance } from "@/api/instance"
import { resolveRouteImageCandidates } from "@/lib/resolve-route-image-url"

export function useRouteImageSrc(imageUrl?: string | null) {
  const [src, setSrc] = useState<string | undefined>(undefined)

  useEffect(() => {
    const candidates = resolveRouteImageCandidates(imageUrl)
    let cancelled = false
    let objectUrl: string | undefined

    const resolveSrc = async () => {
      if (candidates.length === 0) {
        setSrc(undefined)
        return
      }

      for (const candidate of candidates) {
        if (!candidate.startsWith(API_ORIGIN)) {
          if (!cancelled) setSrc(candidate)
          return
        }

        try {
          const response = await instance.get<Blob>(candidate, {
            responseType: "blob",
            headers: { Accept: "image/*" },
          })
          const blob = response.data
          const headerContentType = String(response.headers["content-type"] || "")
          const blobContentType = String(blob.type || "")
          const contentType = (headerContentType || blobContentType).toLowerCase()

          if (!contentType.startsWith("image/")) {
            continue
          }

          const nextObjectUrl = URL.createObjectURL(blob)
          if (cancelled) {
            URL.revokeObjectURL(nextObjectUrl)
            return
          }

          objectUrl = nextObjectUrl
          setSrc(nextObjectUrl)
          return
        } catch {
          // Try next candidate.
        }
      }

      if (!cancelled) setSrc(undefined)
    }

    void resolveSrc()

    return () => {
      cancelled = true
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [imageUrl])

  return src
}
