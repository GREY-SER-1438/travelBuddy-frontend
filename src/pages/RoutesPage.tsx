import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { RouteCard } from "@/components/route-card"
import {
  getSavedRoutes,
  removeSavedRouteById,
  saveRouteById,
} from "@/api/saved"
import { getRequestError } from "@/lib/get-request-error"
import { useRoutesStore } from "@/store/useRoutesStore"

export default function RoutesPage() {
  const navigate = useNavigate()
  const routes = useRoutesStore((state) => state.routes)
  const loading = useRoutesStore((state) => state.loading)
  const error = useRoutesStore((state) => state.error)
  const getRoutes = useRoutesStore((state) => state.getRoutes)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [saveStatuses, setSaveStatuses] = useState<Record<number, "idle" | "saving" | "saved">>({})

  useEffect(() => {
    if (loading) return

    const timerId = setTimeout(() => {
      void getRoutes(category.trim() || undefined)
    }, 350)

    return () => clearTimeout(timerId)
  }, [category, getRoutes, loading])

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

  const filteredRoutes = useMemo(() => {
    const query = search.trim().toLowerCase()
    const publicRoutes = routes.filter(
      (route) => route.visibility?.toLowerCase() === "public"
    )
    if (!query) return publicRoutes

    return publicRoutes.filter((route) =>
      route.title.toLowerCase().includes(query)
    )
  }, [routes, search])

  const onSaveRoute = async (routeId: number) => {
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
    } catch (error) {
      setSaveStatuses((prev) => ({ ...prev, [routeId]: status }))
      toast.error(getRequestError(error))
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
            Каталог маршрутов
          </h1>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">
            Просмотр и фильтрация маршрутов.
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_280px]">
          <input
            type="search"
            placeholder="Поиск по названию"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
          <input
            type="text"
            placeholder="Категория"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Найдено маршрутов:{" "}
          <span className="font-semibold text-foreground">
            {filteredRoutes.length}
          </span>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-muted-foreground">Загружаем маршруты...</p>
        ) : null}

        {error ? (
          <p className="mt-6 text-sm text-destructive">
            Не удалось загрузить маршруты.
          </p>
        ) : null}
        {!loading && !error && filteredRoutes.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Маршруты не найдены.
          </p>
        ) : null}

        {!loading && !error && filteredRoutes.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredRoutes.map((route) => (
              <RouteCard
                key={route.routeId}
                title={route.title}
                author={route.author.username}
                duration={formatDays(route.durationDays)}
                secondaryLabel="Тип"
                secondaryValue={
                  route.visibility === "public" ? "Публичный" : "Приватный"
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
