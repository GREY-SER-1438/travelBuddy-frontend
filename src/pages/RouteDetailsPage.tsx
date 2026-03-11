import { Button } from "@/components/ui/button"

const COVER_IMAGE =
  "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?auto=format&fit=crop&w=2000&q=80"

export default function RouteDetailsPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <section className="overflow-hidden rounded-[30px] border border-border bg-card shadow-[0_12px_24px_rgba(44,71,92,0.08)]">
          <div className="h-[220px] sm:h-[280px]">
            <img src={COVER_IMAGE} alt="Италия: Рим - Флоренция - Венеция" className="h-full w-full object-cover" />
          </div>

          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground">
                Классика Европы
              </span>
              <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground">
                Италия
              </span>
            </div>

            <h1 className="mt-3 text-4xl leading-tight font-bold text-foreground sm:text-5xl">
              Италия: Рим - Флоренция - Венеция
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Готовый маршрут на 7 дней с точками, описанием и публикацией.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-[#588096]">
              <Button variant="orange" size="headerAuth">
                Добавить в избранное
              </Button>
              <Button variant="transparent" size="headerAuth">
                Опубликовать
              </Button>
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-[30px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:p-5">
            <p className="text-sm font-semibold text-muted-foreground">Описание</p>
            <h2 className="mt-1 text-4xl leading-none font-bold text-foreground sm:text-5xl">
              О маршруте
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Маршрут охватывает ключевые точки трёх городов, подходит для первой поездки в Италию и не требует сложной логистики.
            </p>

            <div className="mt-4 space-y-2.5">
              <article className="rounded-2xl bg-muted px-4 py-3">
                <p className="text-xl leading-none font-semibold text-foreground">День 1</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Прогулка по Риму, Колизей, площадь Навона, вечерняя набережная.
                </p>
              </article>
              <article className="rounded-2xl bg-muted px-4 py-3">
                <p className="text-xl leading-none font-semibold text-foreground">День 2</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ватикан, музеи, кафе и вечерний обзорный маршрут.
                </p>
              </article>
              <article className="rounded-2xl bg-muted px-4 py-3">
                <p className="text-xl leading-none font-semibold text-foreground">День 3</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Переезд во Флоренцию, собор, мост Понте-Веккьо.
                </p>
              </article>
            </div>
          </section>

          <section className="rounded-[30px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:p-5">
            <p className="text-sm font-semibold text-muted-foreground">Точки маршрута</p>
            <h2 className="mt-1 text-4xl leading-none font-bold text-foreground sm:text-5xl">
              Список точек
            </h2>

            <ol className="mt-4 space-y-2.5">
              <li className="rounded-2xl bg-muted px-4 py-3 text-lg text-foreground/90">
                1. Колизей
              </li>
              <li className="rounded-2xl bg-muted px-4 py-3 text-lg text-foreground/90">
                2. Римский форум
              </li>
              <li className="rounded-2xl bg-muted px-4 py-3 text-lg text-foreground/90">
                3. Ватикан
              </li>
              <li className="rounded-2xl bg-muted px-4 py-3 text-lg text-foreground/90">
                4. Дуомо во Флоренции
              </li>
              <li className="rounded-2xl bg-muted px-4 py-3 text-lg text-foreground/90">
                5. Площадь Сан-Марко
              </li>
            </ol>

            <div className="mt-4">
              <Button variant="orange" size="headerAuth">
                Оставить отзыв
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
