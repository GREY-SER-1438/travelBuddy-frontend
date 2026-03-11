import { useState } from "react"
import { Heart } from "lucide-react"
import { API_ORIGIN } from "@/api/config"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type RouteCardMetric = {
  label: string
  value: string
}

type RouteCardProps = {
  title: string
  author: string
  duration: string
  secondaryLabel?: string
  secondaryValue: string
  imageUrl?: string | null
  description?: string
  showDescription?: boolean
  tags?: string[]
  metrics?: RouteCardMetric[]
  showFavorite?: boolean
  className?: string
  onOpen?: () => void
  onSave?: () => void
}

export function RouteCard({
  title,
  author,
  duration,
  secondaryLabel = "Страна",
  secondaryValue,
  imageUrl,
  description,
  showDescription = true,
  tags = [],
  metrics,
  showFavorite = false,
  className,
  onOpen,
  onSave,
}: RouteCardProps) {
  const [imageError, setImageError] = useState(false)
  const normalizedImageUrl = getImageUrl(imageUrl)
  const hasImage = Boolean(normalizedImageUrl) && !imageError
  const routeMetrics =
    metrics ??
    [
      { label: "Дней", value: duration },
      { label: secondaryLabel, value: secondaryValue },
    ]

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-background/60 p-3",
        className
      )}
    >
      <div
        className="relative h-36 overflow-hidden rounded-2xl sm:h-40"
        style={{
          backgroundImage:
            "linear-gradient(165deg, #c5d6e3 0%, #a8bed0 35%, #8aa8c0 100%)",
        }}
      >
        {hasImage ? (
          <img
            src={normalizedImageUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : null}

        {hasImage ? (
          <div className="absolute inset-0 bg-gradient-to-t from-black/8 to-transparent" />
        ) : (
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "repeating-linear-gradient(140deg, #d8a89b 0 10px, #b57d7d 10px 16px, #d9b6ac 16px 24px)",
            }}
          />
        )}

        {showFavorite ? (
          <Button
            type="button"
            variant="transparent"
            size="icon-sm"
            className="absolute top-2 right-2 rounded-full bg-background/95 text-foreground hover:bg-background"
            aria-label="В избранное"
          >
            <Heart className="size-4 fill-current" />
          </Button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-2 pt-3 pb-1">
        {tags.length ? (
          <div className="mb-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <h3 className="text-xl leading-tight font-semibold text-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">Автор: {author}</p>
        {showDescription ? (
          description?.trim() ? (
            <p className="mt-1 min-h-[2.75rem] line-clamp-2 text-sm text-muted-foreground/90">
              {description}
            </p>
          ) : (
            <p className="mt-1 min-h-[2.75rem] text-sm text-muted-foreground/70">
              Описание отсутствует.
            </p>
          )
        ) : (
          <div className="min-h-[0.75rem]" />
        )}

        <div
          className={cn(
            "mt-3 grid gap-2",
            routeMetrics.length >= 3 ? "grid-cols-3" : "grid-cols-2"
          )}
        >
          {routeMetrics.map((metric) => (
            <div
              key={`${metric.label}-${metric.value}`}
              className="rounded-xl bg-muted px-3 py-2 text-center"
            >
              <p className="text-[10px] leading-none font-semibold tracking-wide text-muted-foreground/80 uppercase">
                {metric.label}
              </p>
              <p className="mt-1 text-sm leading-none font-semibold text-foreground/85">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" variant="orange" size="routeCard" onClick={onOpen}>
            Открыть
          </Button>
          <Button
            type="button"
            variant="transparent"
            size="routeCard"
            onClick={onSave}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </article>
  )
}

function getImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return null
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl
  }

  if (!API_ORIGIN) return imageUrl

  const normalizedPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`

  return `${API_ORIGIN}${normalizedPath}`
}
