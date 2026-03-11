import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { RouteCard } from "@/components/route-card"
import { useRoutesStore } from "@/store/useRoutesStore"

const stats = [
  { label: "Маршрутов", value: "240+" },
  { label: "Пользователей", value: "18K" },
  { label: "Коллекций", value: "65" },
  { label: "Отзывов", value: "120" },
]

const quickStartSteps = [
  "Выбери направление",
  "Добавь точки",
  "Сохрани, опубликуй или отправь в избранное",
]

const reviews = [
  {
    name: "Анна",
    route: "Амстердам за 3 дня",
    text: "Маршрут удобный, точки расположены логично, но времени все равно не успеть.",
    stars: 5,
  },
  {
    name: "Илья",
    route: "Балканы на машине",
    text: "Полезный маршрут для самостоятельной поездки, особенно понравились заметки по маршруту.",
    stars: 5,
  },
  {
    name: "Вова",
    route: "Балканы на машине",
    text: "Полезный маршрут для самостоятельной поездки, особенно понравились заметки по маршруту.",
    stars: 4,
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const routes = useRoutesStore((state) => state.routes)
  const loadingRoutes = useRoutesStore((state) => state.loading)
  const routesLoaded = useRoutesStore((state) => state.loaded)
  const lastCategory = useRoutesStore((state) => state.lastCategory)
  const routesError = useRoutesStore((state) => state.error)
  const getRoutes = useRoutesStore((state) => state.getRoutes)

  useEffect(() => {
    if ((!routesLoaded || lastCategory !== null) && !loadingRoutes) {
      void getRoutes()
    }
  }, [getRoutes, lastCategory, loadingRoutes, routesLoaded])

  const availableRoutes = routes.filter((route) => route.visibility === "public")
  const featuredRoutes = (availableRoutes.length ? availableRoutes : routes).slice(
    0,
    4
  )

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 xl:grid-cols-[1.16fr_0.92fr]">
        <div className="space-y-4">
          <section
            className="overflow-hidden rounded-[30px] border border-white/25 px-5 py-6 text-white shadow-[0_22px_56px_rgba(44,71,92,0.24)] sm:px-7 sm:py-7"
            style={{
              backgroundImage:
                "radial-gradient(125% 150% at 100% 100%, rgba(141,181,214,0.45) 0%, rgba(141,181,214,0) 58%), linear-gradient(135deg, #2c475c 0%, #588096 55%, #8db5d6 100%)",
            }}
          >
            <div className="max-w-[680px]">
              <h1 className="text-4xl leading-[1.1] font-bold tracking-[-0.02em] sm:text-5xl lg:text-6xl">
                Сервис для планирования поездок, публикации маршрутов и хранения
                личных travel-коллекций.
              </h1>

              <p className="mt-3 max-w-[620px] text-lg leading-8 text-white/78 sm:text-xl">
                На главной пользователь сразу видит популярные маршруты,
                подборки, отзывы и вход в основные действия.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Button
                  asChild
                  variant="orange"
                  size="lg"
                  className="h-12 rounded-2xl px-8 text-lg font-semibold"
                >
                  <Link to="/planner">Построить маршрут</Link>
                </Button>
                <Button
                  asChild
                  variant="transparent"
                  size="lg"
                  className="h-12 rounded-2xl px-8 text-lg font-semibold"
                >
                  <Link to="/routes">Смотреть маршруты</Link>
                </Button>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {stats.map((item) => (
                <article
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/9 p-2 backdrop-blur-[1px]"
                >
                  <p className="text-sm text-white/62">{item.label}</p>
                  <p className="mt-1 text-4xl leading-none font-semibold">
                    {item.value}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[26px] border border-border bg-card px-5 py-5 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:px-6 sm:py-6">
            <p className="text-sm font-semibold text-muted-foreground/90">
              Популярное
            </p>
            <h2 className="mt-1 text-5xl leading-[1.05] font-bold text-foreground">
              Маршруты, с которых можно начать
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Живой контент сразу на главной.
            </p>

            {loadingRoutes ? (
              <p className="mt-5 text-sm text-muted-foreground">
                Загружаем маршруты...
              </p>
            ) : null}
            {routesError ? (
              <p className="mt-5 text-sm text-destructive">
                Не удалось загрузить маршруты.
              </p>
            ) : null}

            {!loadingRoutes && !routesError ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {featuredRoutes.map((item) => (
                  <RouteCard
                    key={item.routeId}
                    title={item.title}
                    author={item.author.username}
                    duration={formatDays(item.durationDays)}
                    secondaryLabel="Тип"
                    secondaryValue={
                      item.visibility === "public" ? "Публичный" : "Приватный"
                    }
                    imageUrl={item.imageUrl}
                    description={item.description}
                    onOpen={() => navigate(`/routes/${item.routeId}`)}
                  />
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-[26px] border border-border bg-card px-5 py-5 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:px-6 sm:py-6">
            <p className="text-sm font-semibold text-muted-foreground/90">
              Быстрый старт
            </p>
            <h2 className="mt-1 text-5xl leading-[1.08] font-bold text-foreground">
              Собери поездку за 3 шага
            </h2>

            <ul className="mt-5 space-y-3">
              {quickStartSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background text-sm font-bold text-foreground/85">
                    {index + 1}
                  </span>
                  <span className="text-lg text-foreground/75">{step}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[26px] border border-border bg-card px-5 py-5 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:px-6 sm:py-6">
            <p className="text-sm font-semibold text-muted-foreground/90">
              Отзывы
            </p>
            <h2 className="mt-1 text-5xl leading-[1.08] font-bold text-foreground">
              Что пишут о маршрутах
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Социальное подтверждение делает главную живее и полезнее.
            </p>

            <div className="mt-4 space-y-3">
              {reviews.map((review) => (
                <article
                  key={review.name}
                  className="rounded-2xl bg-muted px-4 py-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {review.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {review.route}
                      </p>
                    </div>

                    <div className="flex gap-1 text-accent">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={`${review.name}-${starIndex}`}
                          className="size-4"
                          strokeWidth={1.5}
                          fill={
                            starIndex < review.stars ? "currentColor" : "none"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {review.text}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
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
