import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { RouteCard } from "@/components/route-card"
import {
  getSavedRoutes,
  removeSavedRouteById,
  saveRouteById,
} from "@/api/saved"
import { hasAuthToken } from "@/lib/auth"
import { getRequestError } from "@/lib/get-request-error"
import { useMeStore } from "@/store/useMeStore"
import { useRoutesStore } from "@/store/useRoutesStore"

export default function CategoryPage() {
  const navigate = useNavigate()
  const { category = "" } = useParams()
  const routes = useRoutesStore((state) => state.routes)
  const loading = useRoutesStore((state) => state.loading)
  const error = useRoutesStore((state) => state.error)
  const getRoutes = useRoutesStore((state) => state.getRoutes)
  const me = useMeStore((state) => state.me)
  const currentUserId = me?.userId ?? null
  const [saveStatuses, setSaveStatuses] = useState<Record<number, "idle" | "saving" | "saved">>({})

  useEffect(() => {
    const normalizedCategory = category.trim()
    if (!normalizedCategory) return

    void getRoutes(normalizedCategory)
  }, [category, getRoutes])

  useEffect(() => {
    let cancelled = false

    const loadSavedRoutes = async () => {
      try {
        const savedRoutes = await getSavedRoutes()
        if (cancelled) return

        setSaveStatuses((prev) => {
          const next: Record<number, "idle" | "saving" | "saved"> = { ...prev }
          savedRoutes.forEach((item) => {
            next[item.route.routeId] = "saved"
          })
          return next
        })
      } catch {
        // For guests / network issues keep default "idle" state.
      }
    }

    void loadSavedRoutes()

    return () => {
      cancelled = true
    }
  }, [])

  const title = useMemo(() => {
    if (!category.trim()) return "Категория"
    return decodeURIComponent(category)
      .replace(/[-_]+/g, " ")
      .replace(/^\p{L}/u, (match) => match.toUpperCase())
  }, [category])

  const onSaveRoute = async (routeId: number) => {
    if (!hasAuthToken()) {
      navigate("/login")
      return
    }

    const route = routes.find((item) => item.routeId === routeId)
    if (
      route &&
      currentUserId !== null &&
      route.author.userId === currentUserId
    ) {
      return
    }

    const status = saveStatuses[routeId] || "idle"
    if (status === "saving") return

    setSaveStatuses((prev) => ({ ...prev, [routeId]: "saving" }))
    try {
      if (status === "saved") {
        await removeSavedRouteById(routeId)
        setSaveStatuses((prev) => ({ ...prev, [routeId]: "idle" }))
        toast.success("Маршрут удален из сохраненных.")
      } else {
        await saveRouteById(routeId)
        setSaveStatuses((prev) => ({ ...prev, [routeId]: "saved" }))
        toast.success("Маршрут сохранен.")
      }
    } catch (requestError) {
      setSaveStatuses((prev) => ({ ...prev, [routeId]: status }))
      toast.error(getRequestError(requestError))
    }
  }

  const getRouteSaveStatus = (routeId: number) => saveStatuses[routeId] || "idle"

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[26px] border border-border bg-card p-6 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:p-8">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Просмотр контента
          </p>
          <h1 className="mt-1 text-4xl leading-none font-bold text-foreground sm:text-5xl">
            Категория: {title}
          </h1>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">
            Просмотр маршрутов выбранной категории.
          </p>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-muted-foreground">Загружаем маршруты...</p>
        ) : null}

        {error ? (
          <p className="mt-6 text-sm text-destructive">
            Не удалось загрузить маршруты категории.
          </p>
        ) : null}
        {!loading && !error && routes.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            В этой категории пока нет маршрутов.
          </p>
        ) : null}

        {!loading && !error && routes.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {routes.map((route) => (
              <RouteCard
                key={route.routeId}
                title={route.title}
                author={route.author.username || route.author.email}
                duration={formatDays(route.durationDays)}
                secondaryLabel="Тип"
                secondaryValue={
                  normalizeVisibility(route.visibility) === "public"
                    ? "Публичный"
                    : "Приватный"
                }
                imageUrl={route.imageUrl}
                description={route.description}
                secondaryActionLabel={
                  getRouteSaveStatus(route.routeId) === "saved"
                    ? "Сохранено"
                    : getRouteSaveStatus(route.routeId) === "saving"
                      ? "Обновляем..."
                      : "Сохранить"
                }
                secondaryActionClassName={
                  getRouteSaveStatus(route.routeId) === "saved"
                    ? "border-[#2c475c] bg-[#2c475c] text-white hover:bg-[#243b4c] hover:text-white"
                    : undefined
                }
                secondaryActionDisabled={
                  getRouteSaveStatus(route.routeId) === "saving"
                }
                showSecondaryAction={
                  !(
                    currentUserId !== null &&
                    route.author.userId === currentUserId
                  )
                }
                onOpen={() => navigate(`/routes/${route.routeId}`)}
                onSave={() => void onSaveRoute(route.routeId)}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}

function formatDays(days: number | null) {
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
