import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const points = [
  "Аэропорт / стартовая точка",
  "Аэропорт / стартовая точка",
  "Аэропорт / стартовая точка",
  "Аэропорт / стартовая точка",
]

export default function PlannerPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <section className="rounded-[26px] border border-border bg-card p-5 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:p-6">
          <p className="text-sm font-semibold text-muted-foreground">Планировщик</p>
          <h1 className="mt-1 text-5xl leading-none font-bold text-foreground sm:text-6xl">
            Конструктор маршрута
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Создание маршрута, точки поездки и карта собраны на одной странице.
          </p>

          <form
            className="mt-5 space-y-3.5"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Название маршрута"
                className="h-11 rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <input
                type="text"
                placeholder="Категория"
                className="h-11 rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Дата начала"
                className="h-11 rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <input
                type="text"
                placeholder="Дата окончания"
                className="h-11 rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <input
              type="text"
              placeholder="Краткое описание маршрута"
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />

            <textarea
              rows={5}
              placeholder="Описание поездки, заметки, список точек"
              className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />

            <div className="flex flex-wrap gap-2.5">
              <Button
                type="submit"
                variant="orange"
                className="h-10 rounded-2xl px-4 text-sm font-semibold"
              >
                Сохранить маршрут
              </Button>
              <Button
                type="button"
                variant="transparent"
                className="h-10 rounded-2xl px-4 text-sm font-semibold text-[#588096]"
              >
                Черновик
              </Button>
            </div>
          </form>

          <h2 className="mt-5 text-4xl leading-none font-bold text-foreground">
            Точки маршрута
          </h2>

          <div className="mt-4 space-y-3">
            {points.map((point, index) => (
              <article
                key={`${point}-${index}`}
                className="flex items-center justify-between gap-3 rounded-2xl bg-muted px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-[#f04b4b]">
                    <MapPin className="size-4" />
                  </span>
                  <p className="truncate text-sm text-foreground/85">{point}</p>
                </div>

                <Button
                  type="button"
                  variant="transparent"
                  className="h-9 rounded-xl px-4 text-sm font-semibold text-[#588096]"
                >
                  Изменить
                </Button>
              </article>
            ))}
          </div>

          <Button
            type="button"
            variant="orange"
            className="mt-4 h-10 w-full rounded-2xl text-sm font-semibold"
          >
            Добавить точку
          </Button>
        </section>

        <aside className="h-fit rounded-[26px] border border-border bg-card p-5 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:p-6">
          <p className="text-sm font-semibold text-muted-foreground">Сводка</p>
          <h2 className="mt-1 text-5xl leading-none font-bold text-foreground sm:text-6xl">
            Маршрут
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Короткая сводка без пустых технических блоков.
          </p>

          <div className="mt-5 space-y-3">
            <article className="rounded-2xl bg-muted px-4 py-3">
              <p className="text-sm text-muted-foreground">Точек в маршруте</p>
              <p className="mt-1 text-4xl leading-none font-bold text-foreground">
                12
              </p>
            </article>

            <article className="rounded-2xl bg-muted px-4 py-3">
              <p className="text-sm text-muted-foreground">Статус</p>
              <p className="mt-1 text-2xl leading-none font-semibold text-foreground">
                Черновик
              </p>
            </article>

            <article className="rounded-2xl bg-muted px-4 py-3 text-sm text-foreground/80">
              <p className="font-semibold text-muted-foreground">Подсказки</p>
              <p className="mt-3">
                Разделяй маршрут по дням, чтобы им было удобнее пользоваться.
              </p>
              <p className="mt-3">
                Сразу добавляй ключевые точки, чтобы видеть логистику поездки.
              </p>
              <p className="mt-3">
                Сохраняй черновик, если маршрут еще не готов к публикации.
              </p>
            </article>
          </div>
        </aside>
      </div>
    </div>
  )
}
