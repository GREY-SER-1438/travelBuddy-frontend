import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type RouteCardProps = {
  title: string
  author: string
  duration: string
  country: string
  className?: string
  onOpen?: () => void
  onSave?: () => void
}

export function RouteCard({
  title,
  author,
  duration,
  country,
  className,
  onOpen,
  onSave,
}: RouteCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border border-border/70 bg-background/60 p-3",
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
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "repeating-linear-gradient(140deg, #d8a89b 0 10px, #b57d7d 10px 16px, #d9b6ac 16px 24px)",
          }}
        />
      </div>

      <div className="px-2 pt-3 pb-1">
        <h3 className="text-xl leading-tight font-semibold text-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">Автор: {author}</p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-muted px-3 py-2 text-center">
            <p className="text-[10px] leading-none font-semibold tracking-wide text-muted-foreground/80 uppercase">
              Дней
            </p>
            <p className="mt-1 text-sm leading-none font-semibold text-foreground/85">
              {duration}
            </p>
          </div>
          <div className="rounded-xl bg-muted px-3 py-2 text-center">
            <p className="text-[10px] leading-none font-semibold tracking-wide text-muted-foreground/80 uppercase">
              Страна
            </p>
            <p className="mt-1 text-sm leading-none font-semibold text-foreground/85">
              {country}
            </p>
          </div>
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
