import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { RouteCard } from "@/components/route-card"
import { getRequestError } from "@/lib/get-request-error"
import { getSavedRoutes, removeSavedRouteById } from "@/api/saved"
import type { SavedRouteResponseDto } from "@/api/types"

export default function SavedRoutesPage() {
  const navigate = useNavigate()
  const [savedRoutes, setSavedRoutes] = useState<SavedRouteResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadRoutes = async () => {
      setLoading(true)
      setError("")
      try {
        const response = await getSavedRoutes()
        if (cancelled) return
        setSavedRoutes(response)
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

  const onRemoveSaved = async (routeId: number) => {
    setError("")
    setMessage("")
    try {
      await removeSavedRouteById(routeId)
      setSavedRoutes((prev) => prev.filter((item) => item.route.routeId !== routeId))
      setMessage("Маршрут удален из сохраненных.")
    } catch (requestError) {
      setError(getRequestError(requestError))
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[26px] border border-border bg-card p-6 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:p-8">
        <p className="text-sm font-semibold text-muted-foreground">Кабинет</p>
        <h1 className="mt-1 text-5xl leading-none font-bold text-foreground sm:text-6xl">
          Сохраненные маршруты
        </h1>

        {loading ? (
          <p className="mt-6 text-sm text-muted-foreground">Загружаем маршруты...</p>
        ) : null}
        {error ? <p className="mt-6 text-sm text-destructive">{error}</p> : null}
        {message ? <p className="mt-6 text-sm text-emerald-700">{message}</p> : null}

        {!loading && !error && savedRoutes.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            У вас пока нет сохраненных маршрутов.
          </p>
        ) : null}

        {!loading && savedRoutes.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {savedRoutes.map((item) => (
              <RouteCard
                key={item.savedRouteId}
                title={item.route.title}
                author={item.route.author.username || item.route.author.email}
                duration={formatDays(item.route.durationDays)}
                secondaryLabel="Тип"
                secondaryValue={
                  normalizeVisibility(item.route.visibility) === "public"
                    ? "Публичный"
                    : "Приватный"
                }
                imageUrl={item.route.imageUrl}
                description={item.route.description}
                primaryActionLabel="Открыть"
                secondaryActionLabel="Удалить"
                onOpen={() => navigate(`/routes/${item.route.routeId}`)}
                onSave={() => void onRemoveSaved(item.route.routeId)}
              />
            ))}
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

function normalizeVisibility(value: string | undefined) {
  return (value || "").trim().toLowerCase()
}
