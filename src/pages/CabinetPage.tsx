import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const DEMO_IMAGE =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80"

export default function CabinetPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <section className="rounded-[22px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)]">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-bold text-muted-foreground">
                SB
              </span>

              <div className="min-w-0">
                <h2 className="text-[1.8rem] leading-none font-bold text-foreground">
                  Sergey Buddy
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">Путешественник</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    6 поездок
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    4 коллекции
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[22px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)]">
            <p className="text-sm font-semibold text-muted-foreground">Клиент</p>
            <h1 className="mt-1 text-5xl leading-none font-bold text-foreground sm:text-6xl">
              Профиль и настройки
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Панель данных и параметры аккаунта в одном разделе.
            </p>

            <form
              className="mt-4 space-y-3"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Имя"
                  className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Страна"
                  className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <input
                  type="text"
                  placeholder="Любимый тип поездки"
                  className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <textarea
                rows={4}
                placeholder="О себе"
                className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />

              <Button
                type="submit"
                variant="orange"
                className="h-9 rounded-xl px-4 text-sm font-semibold"
              >
                Сохранить изменения
              </Button>
            </form>
          </section>
        </div>

        <section className="rounded-[22px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)]">
          <p className="text-sm font-semibold text-muted-foreground">Избранное</p>
          <h2 className="mt-1 text-5xl leading-none font-bold text-foreground sm:text-6xl">
            Сохраненные маршруты
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Быстрый доступ к интересующим поездкам.
          </p>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <SavedRouteCard />
            <SavedRouteCard />
            <SavedRouteCard />
            <SavedRouteCard />
          </div>
        </section>

        <section className="rounded-[22px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)]">
          <p className="text-sm font-semibold text-muted-foreground">Коллекции</p>
          <h2 className="mt-1 text-5xl leading-none font-bold text-foreground sm:text-6xl">
            Мои категории маршрутов
          </h2>

          <div className="mt-4 space-y-2.5">
            <CategoryRow name="Летние поездки" count="6 элементов" />
            <CategoryRow name="Европа" count="14 элементов" />
            <CategoryRow name="На выходные" count="8 элементов" />
          </div>

          <form
            className="mt-3 flex flex-wrap gap-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="text"
              placeholder="Название подборки"
              className="h-10 min-w-[230px] flex-1 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
            <Button
              type="submit"
              variant="orange"
              className="h-10 rounded-xl px-5 text-sm font-semibold"
            >
              Создать подборку
            </Button>
          </form>
        </section>
      </div>
    </div>
  )
}

function SavedRouteCard() {
  const [imageError, setImageError] = useState(false)

  return (
    <article className="overflow-hidden rounded-[20px] border border-border bg-background shadow-[0_10px_20px_rgba(44,71,92,0.08)]">
      <div className="relative h-40 overflow-hidden">
        {!imageError ? (
          <img
            src={DEMO_IMAGE}
            alt="Маршрут"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(160deg, #d2dbe6 0%, #a9bed0 42%, #89a7c0 100%)",
            }}
          />
        )}

        <Button
          type="button"
          variant="transparent"
          size="icon-sm"
          className="absolute top-2 right-2 rounded-full bg-background/95 text-foreground hover:bg-background"
          aria-label="В избранном"
        >
          <Heart className="size-4 fill-current" />
        </Button>
      </div>

      <div className="p-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted-foreground">
            Бюджетно
          </span>
          <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted-foreground">
            Классика
          </span>
        </div>

        <h3 className="mt-2 text-[1.9rem] leading-none font-bold text-foreground">
          Амстердам за 3 дня
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">Автор: Sergey</p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-muted px-2 py-2 text-center">
            <p className="text-[10px] leading-none text-muted-foreground">Длительность</p>
            <p className="mt-1 text-sm leading-none font-semibold text-foreground">3 дн.</p>
          </div>
          <div className="rounded-xl bg-muted px-2 py-2 text-center">
            <p className="text-[10px] leading-none text-muted-foreground">Страна</p>
            <p className="mt-1 text-sm leading-none font-semibold text-foreground">
              Нидерланды
            </p>
          </div>
          <div className="rounded-xl bg-muted px-2 py-2 text-center">
            <p className="text-[10px] leading-none text-muted-foreground">Рейтинг</p>
            <p className="mt-1 text-sm leading-none font-semibold text-foreground">4.9</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[#588096]">
          <Button variant="orange" size="routeCard">
            Открыть
          </Button>
          <Button variant="transparent" size="routeCard">
            Удалить
          </Button>
        </div>
      </div>
    </article>
  )
}

function CategoryRow({ name, count }: { name: string; count: string }) {
  return (
    <article className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted px-3 py-2.5">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{name}</h3>
        <p className="text-xs text-muted-foreground">{count}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[#588096]">
        <Button variant="transparent" className="h-8 rounded-xl px-3 text-sm font-semibold">
          Редактировать
        </Button>
        <Button variant="orange" className="h-8 rounded-xl px-3 text-sm font-semibold">
          Открыть
        </Button>
      </div>
    </article>
  )
}
