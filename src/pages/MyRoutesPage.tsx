import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { RouteCard } from "@/components/route-card"
import { getRequestError } from "@/lib/get-request-error"
import { getMyPrivateRoutes } from "@/api/users"
import { getMyPublishedRoutes } from "@/api/users"
import type { RouteResponseDto } from "@/api/types"

export default function MyRoutesPage() {
  const navigate = useNavigate()
  const [privateRoutes, setPrivateRoutes] = useState<RouteResponseDto[]>([])
  const [publishedRoutes, setPublishedRoutes] = useState<RouteResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadRoutes = async () => {
      setLoading(true)
      setError("")
      try {
        const [privateData, publishedData] = await Promise.all([
          getMyPrivateRoutes(),
          getMyPublishedRoutes(),
        ])
        if (cancelled) return
        setPrivateRoutes(privateData)
        setPublishedRoutes(publishedData)
      } catch (requestError) {
        if (!cancelled) {
          setError(getRequestError(requestError))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadRoutes()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[26px] border border-border bg-card p-6 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:p-8">
        <p className="text-sm font-semibold text-muted-foreground">Кабинет</p>
        <h1 className="mt-1 text-5xl leading-none font-bold text-foreground sm:text-6xl">
          Личные маршруты
        </h1>

        {loading ? (
          <p className="mt-6 text-sm text-muted-foreground">Загружаем маршруты...</p>
        ) : null}
        {error ? <p className="mt-6 text-sm text-destructive">{error}</p> : null}

        {!loading && !error ? (
          <div className="mt-6 space-y-8">
            <section>
              <h2 className="text-3xl leading-none font-bold text-foreground sm:text-4xl">
                Приватные
              </h2>
              {privateRoutes.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  Приватных маршрутов пока нет.
                </p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {privateRoutes.map((route) => (
                    <RouteCard
                      key={route.routeId}
                      title={route.title}
                      author={route.author.username || route.author.email}
                      duration={formatDays(route.durationDays)}
                      secondaryLabel="Тип"
                      secondaryValue="Приватный"
                      imageUrl={route.imageUrl}
                      description={route.description}
                      showSecondaryAction={false}
                      onOpen={() => navigate(`/cabinet/my-routes/${route.routeId}`)}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-3xl leading-none font-bold text-foreground sm:text-4xl">
                Опубликованные вами
              </h2>
              {publishedRoutes.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  Опубликованных маршрутов пока нет.
                </p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {publishedRoutes.map((route) => (
                    <RouteCard
                      key={route.routeId}
                      title={route.title}
                      author={route.author.username || route.author.email}
                      duration={formatDays(route.durationDays)}
                      secondaryLabel="Тип"
                      secondaryValue="Публичный"
                      imageUrl={route.imageUrl}
                      description={route.description}
                      showSecondaryAction={false}
                      onOpen={() => navigate(`/cabinet/my-routes/${route.routeId}`)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : null}
      </section>
    </div>
  )
}

function formatDays(days: number | null | undefined) {
  if (!days || days < 1) return "—"

  const mod10 = days % 10
  const mod100 = days % 100

  if (mod10 === 1 && mod100 !== 11) return `${days} день`
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
    return `${days} дня`
  }
  return `${days} дней`
}
