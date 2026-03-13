import { Link } from "react-router-dom"

const sectionLinks = [
  "Главная",
  "Маршруты",
  "Планировщик",
  "Кабинет",
  "Сообщество",
]
const featureLinks = [
  "Создание маршрутов",
  "Коллекции и избранное",
  "Отзывы и публикации",
  "Публикации маршрутов",
]
const accountLinks = ["Вход", "Регистрация"]

export function Footer() {
  return (
    <footer className="mt-auto bg-[#2c475c] text-[#fbfbfd] dark:bg-[#14222d] dark:text-[#e9f1fd]">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[minmax(280px,1.4fr)_1fr_1fr_0.8fr] md:gap-10">
          <div>
            <Link to="/" className="inline-flex items-start gap-3">
              <span className="mt-0.5 flex size-11 items-center justify-center rounded-full bg-[#f59a23] text-xl font-bold text-white">
                TB
              </span>
              <span>
                <span className="block text-xl leading-none font-semibold tracking-[-0.02em] sm:text-2xl">
                  TravelBuddy
                </span>
                <span className="mt-1 block text-xs leading-none text-[#d3e2ee]/75 dark:text-[#b8d1e4]/80 sm:text-sm">
                  Планируй поездки удобно
                </span>
              </span>
            </Link>

            <p className="mt-7 max-w-[430px] text-sm leading-6 text-[#d3e2ee]/85 dark:text-[#b8d1e4]/85 sm:text-base">
              Удобный сервис для планирования поездок, хранения маршрутов,
              публикации идей и отслеживания истории путешествий.
            </p>
          </div>

          <FooterColumn title="Разделы" links={sectionLinks} />
          <FooterColumn title="Возможности" links={featureLinks} />
          <FooterColumn title="Аккаунт" links={accountLinks} />
        </div>

        <div className="mt-12 border-t border-[#d3e2ee]/25 dark:border-[#8db5d6]/25 pt-7">
          <div className="flex flex-col gap-3 text-xs text-[#d3e2ee]/75 dark:text-[#b8d1e4]/80 sm:text-sm lg:flex-row lg:items-center lg:justify-between">
            <p>© 2026 TravelBuddy. Все права защищены.</p>
            <p>Политика конфиденциальности · Пользовательское соглашение</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-lg leading-none font-semibold tracking-[-0.01em]">
        {title}
      </h3>
      <ul className="mt-6 space-y-4">
        {links.map((label) => (
          <li key={label}>
            <Link
              to="/"
              className="text-sm text-[#d3e2ee]/80 transition-colors hover:text-white dark:text-[#b8d1e4]/85 dark:hover:text-[#fbfbfd]"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
