import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { RouteCard } from "@/components/route-card"
import { Button } from "@/components/ui/button"
import { createCategory, getCategories } from "@/api/categories"
import { getFavorites, removeFavoriteByRouteId } from "@/api/favorites"
import { getAccountReport } from "@/api/reports"
import { getSavedRoutes, removeSavedRouteById } from "@/api/saved"
import type {
  CategoryResponseDto,
  FavoriteResponseDto,
  ReportFormat,
  SavedRouteResponseDto,
} from "@/api/types"
import { getCurrentUserProfile, updateUserById } from "@/api/users"
import { getRequestError } from "@/lib/get-request-error"

export default function CabinetPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [requestError, setRequestError] = useState("")
  const [message, setMessage] = useState("")
  const [userId, setUserId] = useState<number | null>(null)
  const [username, setUsername] = useState("")
  const [hasProfileUsername, setHasProfileUsername] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [savedRoutes, setSavedRoutes] = useState<SavedRouteResponseDto[]>([])
  const [favorites, setFavorites] = useState<FavoriteResponseDto[]>([])
  const [categories, setCategories] = useState<CategoryResponseDto[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [downloadingReport, setDownloadingReport] = useState<ReportFormat | null>(
    null
  )
  const [reportError, setReportError] = useState("")
  const [reportMessage, setReportMessage] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadPageData = async () => {
      setLoading(true)
      setRequestError("")
      try {
        const [profile, saved, favoritesList, categoriesList] =
          await Promise.all([
            getCurrentUserProfile(),
            getSavedRoutes(),
            getFavorites(),
            getCategories(),
          ])

        if (cancelled) return

        const myCategories = categoriesList.filter(
          (category) => category.creator?.userId === profile.userId
        )
        const normalizedFavorites = favoritesList.filter((item) => {
          const visibility = normalizeVisibility(item.route.visibility)
          const isOwnRoute = item.route.author.userId === profile.userId
          return visibility === "public" && !isOwnRoute
        })

        const normalizedProfileUsername = (profile.username || "").trim()

        setUserId(profile.userId)
        setHasProfileUsername(Boolean(normalizedProfileUsername))
        setUsername(
          normalizedProfileUsername ||
            getDisplayUsername(undefined, profile.email)
        )
        setEmail(profile.email || "")
        setSavedRoutes(saved)
        setFavorites(normalizedFavorites)
        setCategories(myCategories.length ? myCategories : categoriesList)
      } catch (error) {
        if (!cancelled) {
          setRequestError(getRequestError(error))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadPageData()

    return () => {
      cancelled = true
    }
  }, [])

  const onSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!userId) return

    setSavingProfile(true)
    setRequestError("")
    setMessage("")
    try {
      const normalizedUsername = username.trim()
      const emailFallbackUsername = getDisplayUsername(undefined, email)
      const shouldSendUsername =
        hasProfileUsername || normalizedUsername !== emailFallbackUsername

      const updated = await updateUserById(userId, {
        username: shouldSendUsername
          ? normalizedUsername || undefined
          : undefined,
        email: email.trim() || undefined,
        password: password.trim() || undefined,
      })
      const normalizedUpdatedUsername = (updated.username || "").trim()
      const nextEmail = updated.email || email
      setHasProfileUsername(Boolean(normalizedUpdatedUsername))
      setUsername(
        normalizedUpdatedUsername || getDisplayUsername(undefined, nextEmail)
      )
      setEmail(updated.email || email)
      setPassword("")
      setMessage("Профиль обновлен.")
    } catch (error) {
      setRequestError(getRequestError(error))
    } finally {
      setSavingProfile(false)
    }
  }

  const onCreateCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedName = newCategoryName.trim()
    if (!normalizedName) return

    setCreatingCategory(true)
    setRequestError("")
    setMessage("")
    try {
      const createdCategory = await createCategory({
        name: normalizedName,
        isPublic: false,
      })
      setCategories((prev) => [createdCategory, ...prev])
      setNewCategoryName("")
      setMessage("Категория создана.")
    } catch (error) {
      setRequestError(getRequestError(error))
    } finally {
      setCreatingCategory(false)
    }
  }

  const onRemoveSaved = async (routeId: number) => {
    setRequestError("")
    setMessage("")
    try {
      await removeSavedRouteById(routeId)
      setSavedRoutes((prev) =>
        prev.filter((item) => item.route.routeId !== routeId)
      )
      setMessage("Маршрут удален из сохраненных.")
    } catch (error) {
      setRequestError(getRequestError(error))
    }
  }

  const onRemoveFavorite = async (routeId: number) => {
    setRequestError("")
    setMessage("")
    try {
      await removeFavoriteByRouteId(routeId)
      setFavorites((prev) =>
        prev.filter((item) => item.route.routeId !== routeId)
      )
      setMessage("Маршрут удален из избранного.")
    } catch (error) {
      setRequestError(getRequestError(error))
    }
  }

  const onDownloadReport = async (format: ReportFormat) => {
    if (downloadingReport) return

    setDownloadingReport(format)
    setReportError("")
    setReportMessage("")
    try {
      const report = await getAccountReport(format)
      downloadFile(report.blob, report.filename)
      setReportMessage(`Отчет ${format.toUpperCase()} успешно загружен.`)
    } catch (error) {
      setReportError(getRequestError(error))
    } finally {
      setDownloadingReport(null)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Загружаем кабинет...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <section className="rounded-[22px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)]">
          <p className="text-sm font-semibold text-muted-foreground">Клиент</p>
          <h1 className="mt-1 text-5xl leading-none font-bold text-foreground sm:text-6xl">
            Профиль и настройки
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Панель данных и параметры аккаунта в одном разделе.
          </p>

          <form className="mt-4 space-y-3" onSubmit={onSaveProfile}>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Имя"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
              />
            </div>

            <input
              type="password"
              placeholder="Новый пароль (опционально)"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
            />

            <Button
              type="submit"
              variant="orange"
              disabled={savingProfile}
              className="h-9 rounded-xl px-4 text-sm font-semibold"
            >
              Сохранить изменения
            </Button>
          </form>

          {requestError ? (
            <p className="mt-2 text-sm text-destructive">{requestError}</p>
          ) : null}
          {message ? (
            <p className="mt-2 text-sm text-emerald-700">{message}</p>
          ) : null}
        </section>

        <section className="rounded-[22px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)]">
          <h2 className="mt-1 text-5xl leading-none font-bold text-foreground sm:text-6xl">
            Отчет по аккаунту
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Выберите формат и скачайте отчет.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="orange"
              disabled={Boolean(downloadingReport)}
              onClick={() => void onDownloadReport("html")}
              className="h-10 rounded-xl px-4 text-sm font-semibold"
            >
              {downloadingReport === "html"
                ? "Готовим HTML..."
                : "Скачать HTML"}
            </Button>
            <Button
              type="button"
              variant="transparent"
              disabled={Boolean(downloadingReport)}
              onClick={() => void onDownloadReport("xml")}
              className="h-10 rounded-xl px-4 text-sm font-semibold"
            >
              {downloadingReport === "xml" ? "Готовим XML..." : "Скачать XML"}
            </Button>
          </div>

          {reportError ? (
            <p className="mt-2 text-sm text-destructive">{reportError}</p>
          ) : null}
          {reportMessage ? (
            <p className="mt-2 text-sm text-emerald-700">{reportMessage}</p>
          ) : null}
        </section>

        <section className="rounded-[22px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)]">
          <p className="text-sm font-semibold text-muted-foreground">
            Сохраненное
          </p>
          <h2 className="mt-1 text-5xl leading-none font-bold text-foreground sm:text-6xl">
            Сохраненные маршруты
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Быстрый доступ к интересующим поездкам.
          </p>

          {savedRoutes.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              У вас пока нет сохраненных маршрутов.
            </p>
          ) : null}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {savedRoutes.map((item) => (
              <RouteCard
                key={item.savedRouteId}
                title={item.route.title}
                author={item.route.author.username || item.route.author.email}
                duration={formatDays(item.route.durationDays)}
                secondaryLabel="Тип"
                secondaryValue={getVisibilityLabel(item.route.visibility)}
                imageUrl={item.route.imageUrl}
                description={item.route.description}
                showActions
                primaryActionLabel="Открыть"
                secondaryActionLabel="Удалить"
                onOpen={() => navigate(`/routes/${item.route.routeId}`)}
                onSave={() => void onRemoveSaved(item.route.routeId)}
              />
            ))}
          </div>
        </section>

        <section className="rounded-[22px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)]">
          <p className="text-sm font-semibold text-muted-foreground">
            Избранное
          </p>
          <h2 className="mt-1 text-5xl leading-none font-bold text-foreground sm:text-6xl">
            Избранные маршруты
          </h2>

          {favorites.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              У вас пока нет избранных маршрутов.
            </p>
          ) : null}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {favorites.map((item) => (
              <RouteCard
                key={item.favoriteId}
                title={item.route.title}
                author={item.route.author.username || item.route.author.email}
                duration={formatDays(item.route.durationDays)}
                secondaryLabel="Тип"
                secondaryValue={getVisibilityLabel(item.route.visibility)}
                imageUrl={item.route.imageUrl}
                description={item.route.description}
                showActions
                primaryActionLabel="Открыть"
                secondaryActionLabel="Удалить"
                onOpen={() => navigate(`/routes/${item.route.routeId}`)}
                onSave={() => void onRemoveFavorite(item.route.routeId)}
              />
            ))}
          </div>
        </section>

        <section className="rounded-[22px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)]">
          <p className="text-sm font-semibold text-muted-foreground">
            Коллекции
          </p>
          <h2 className="mt-1 text-5xl leading-none font-bold text-foreground sm:text-6xl">
            Мои категории маршрутов
          </h2>

          <div className="mt-4 space-y-2.5">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Категорий пока нет.
              </p>
            ) : null}
            {categories.map((category) => (
              <CategoryRow
                key={category.categoryId}
                name={category.name}
                count={category.isPublic ? "Публичная" : "Приватная"}
                href={`/categories/${encodeURIComponent(category.name)}`}
              />
            ))}
          </div>

          <form
            className="mt-3 flex flex-wrap gap-2"
            onSubmit={onCreateCategory}
          >
            <input
              type="text"
              placeholder="Название категории"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              className="h-10 min-w-[230px] flex-1 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
            />
            <Button
              type="submit"
              variant="orange"
              disabled={creatingCategory}
              className="h-10 rounded-xl px-5 text-sm font-semibold"
            >
              Создать категорию
            </Button>
          </form>
        </section>
      </div>
    </div>
  )
}

function CategoryRow({
  name,
  count,
  href,
}: {
  name: string
  count: string
  href: string
}) {
  return (
    <article className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted px-3 py-2.5">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{name}</h3>
        <p className="text-xs text-muted-foreground">{count}</p>
      </div>
      <Button
        asChild
        variant="transparent"
        className="h-8 rounded-xl px-3 text-sm font-semibold"
      >
        <Link to={href}>Открыть</Link>
      </Button>
    </article>
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

function getVisibilityLabel(value: string | undefined) {
  return normalizeVisibility(value) === "public" ? "Публичный" : "Приватный"
}

function getDisplayUsername(
  username: string | undefined,
  email: string | undefined
) {
  const normalizedUsername = (username || "").trim()
  if (normalizedUsername) return normalizedUsername

  const normalizedEmail = (email || "").trim()
  if (!normalizedEmail) return ""

  const [localPart] = normalizedEmail.split("@")
  return localPart || normalizedEmail
}

function downloadFile(blob: Blob, filename: string) {
  const fileUrl = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = fileUrl
  link.download = filename || "account-report"
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(fileUrl)
}
