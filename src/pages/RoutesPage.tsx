import { useEffect, useMemo, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { RouteCard } from "@/components/route-card"
import { Button } from "@/components/ui/button"
import { useRoutesStore } from "@/store/useRoutesStore"

export default function RoutesPage() {
  const navigate = useNavigate()
  const routes = useRoutesStore((state) => state.routes)
  const loading = useRoutesStore((state) => state.loading)
  const loaded = useRoutesStore((state) => state.loaded)
  const lastCategory = useRoutesStore((state) => state.lastCategory)
  const error = useRoutesStore((state) => state.error)
  const getRoutes = useRoutesStore((state) => state.getRoutes)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    if ((!loaded || lastCategory !== null) && !loading) {
      void getRoutes()
    }
  }, [getRoutes, lastCategory, loaded, loading])

  const filteredRoutes = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return routes

    return routes.filter((route) =>
      route.title.toLowerCase().includes(query)
    )
  }, [routes, search])

  const onFilterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await getRoutes(category.trim() || undefined)
  }

  const onResetFilters = async () => {
    setCategory("")
    setSearch("")
    await getRoutes()
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[26px] border border-border bg-card p-6 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              Просмотр контента
            </p>
            <h1 className="mt-1 text-4xl leading-none font-bold text-foreground sm:text-5xl">
              Каталог маршрутов
            </h1>
            <p className="mt-2 text-base text-muted-foreground sm:text-lg">
              Просмотр, поиск и переход к конкретному маршруту.
            </p>
          </div>

          <Button type="button" variant="orange" size="headerAuth">
            Опубликовать
          </Button>
        </div>

        <form
          className="mt-6 grid gap-3 md:grid-cols-[1fr_280px_auto_auto]"
          onSubmit={onFilterSubmit}
        >
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
          <Button type="submit" variant="transparent" className="h-11 px-4">
            Применить
          </Button>
          <Button
            asChild
            variant="transparent"
            className="h-11 px-4"
          >
            <Link
              to={
                category.trim()
                  ? `/categories/${encodeURIComponent(category.trim())}`
                  : "/routes"
              }
            >
              Категория
            </Link>
          </Button>
          <Button
            type="button"
            variant="transparent"
            className="h-11 px-4"
            onClick={onResetFilters}
          >
            Сбросить
          </Button>
        </form>

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
                onOpen={() => navigate(`/routes/${route.routeId}`)}
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
