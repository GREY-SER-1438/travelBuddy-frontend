import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useMeStore } from "@/store/useMeStore"
import { addFavoriteByRouteId } from "@/api/favorites"
import {
  createRoutePointByRouteId,
  deleteRouteById,
  getRouteById,
  getRoutePointsByRouteId,
  publishRouteById,
  updateRouteById,
  uploadRouteImage,
} from "@/api/routes"
import {
  deleteRoutePointById,
  updateRoutePointById,
} from "@/api/route-points"
import { createReviewForRoute, getReviewsByRouteId } from "@/api/reviews"
import type {
  ReviewResponseDto,
  RoutePointResponseDto,
  RouteResponseDto,
} from "@/api/types"
import { Button } from "@/components/ui/button"
import { getRequestError } from "@/lib/get-request-error"
import { useRouteImageSrc } from "@/hooks/use-route-image-src"

export default function RouteDetailsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { routeId } = useParams()
  const numericRouteId = useMemo(() => Number(routeId), [routeId])
  const isPersonalRoutePage = location.pathname.startsWith("/cabinet/my-routes/")
  const [route, setRoute] = useState<RouteResponseDto | null>(null)
  const [points, setPoints] = useState<RoutePointResponseDto[]>([])
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionMessage, setActionMessage] = useState("")
  const [actionIsError, setActionIsError] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [pointDrafts, setPointDrafts] = useState<
    Record<number, { country: string; city: string; description: string }>
  >({})
  const [newPoint, setNewPoint] = useState({
    country: "",
    city: "",
    description: "",
  })
  const [routeTitleDraft, setRouteTitleDraft] = useState("")
  const [routeDescriptionDraft, setRouteDescriptionDraft] = useState("")
  const [routeDurationDaysDraft, setRouteDurationDaysDraft] = useState("")
  const [routeImageFile, setRouteImageFile] = useState<File | null>(null)
  const routeImageInputRef = useRef<HTMLInputElement | null>(null)
  const me = useMeStore((state) => state.me)

  useEffect(() => {
    if (!Number.isFinite(numericRouteId) || numericRouteId < 1) {
      setError("Некорректный идентификатор маршрута.")
      setLoading(false)
      return
    }

    let cancelled = false

    const loadData = async () => {
      setLoading(true)
      setError("")

      try {
        const [routeData, pointsData, reviewsData] = await Promise.all([
          getRouteById(numericRouteId),
          getRoutePointsByRouteId(numericRouteId),
          getReviewsByRouteId(numericRouteId),
        ])

        if (cancelled) return

        setRoute(routeData)
        setPoints(pointsData)
        setPointDrafts(
          Object.fromEntries(
            pointsData.map((point) => [
              point.pointId,
              {
                country: point.country,
                city: point.city,
                description: point.description || "",
              },
            ])
          )
        )
        setReviews(reviewsData)
      } catch (requestError) {
        if (cancelled) return
        setError(getRequestError(requestError))
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [numericRouteId])

  useEffect(() => {
    if (!route) return

    setRouteTitleDraft(route.title || "")
    setRouteDescriptionDraft(route.description || "")
    setRouteDurationDaysDraft(
      typeof route.durationDays === "number" && route.durationDays > 0
        ? String(route.durationDays)
        : ""
    )
    setRouteImageFile(null)
    if (routeImageInputRef.current) {
      routeImageInputRef.current.value = ""
    }
  }, [route?.routeId])

  const currentUserId = resolveUserId(me)
  const routeAuthorId = route ? resolveUserId(route.author) : null
  const isOwner = Boolean(
    me &&
      route &&
      ((currentUserId !== null &&
        routeAuthorId !== null &&
        currentUserId === routeAuthorId) ||
        (me.email && route.author.email && me.email === route.author.email))
  )
  const normalizedVisibility = normalizeVisibility(route?.visibility)
  const canManageOwnRoute = Boolean(route && isOwner && isPersonalRoutePage)
  const canPublish = Boolean(route && isOwner && normalizedVisibility !== "public")
  const canFavorite = Boolean(route && !isOwner && normalizedVisibility === "public")
  const canReview = Boolean(route && !isOwner && normalizedVisibility === "public")
  const hasCurrentUserReview = reviews.some((review) => {
    if (!me || !review.user) return false
    if (
      typeof me.userId === "number" &&
      typeof review.user.userId === "number" &&
      me.userId === review.user.userId
    ) {
      return true
    }
    return Boolean(me.email && review.user.email && me.email === review.user.email)
  })
  const canCreateReview = canReview && !hasCurrentUserReview
  const currentUserReview = reviews.find((review) => {
    if (!me || !review.user) return false
    if (
      typeof me.userId === "number" &&
      typeof review.user.userId === "number" &&
      me.userId === review.user.userId
    ) {
      return true
    }
    return Boolean(me.email && review.user.email && me.email === review.user.email)
  })
  const reviewFormDisabled = hasCurrentUserReview || actionLoading
  const nextPointPosition = useMemo(() => getNextPointPosition(points), [points])
  const coverImageUrl = useRouteImageSrc(route?.imageUrl)

  const onAddToFavorites = async () => {
    if (!route || !canFavorite) {
      setActionIsError(true)
      setActionMessage("Добавлять в избранное можно только чужие публичные маршруты.")
      return
    }
    setActionLoading(true)
    setActionMessage("")
    setActionIsError(false)
    try {
      await addFavoriteByRouteId(route.routeId)
      setActionIsError(false)
      setActionMessage("Маршрут добавлен в избранное.")
    } catch (requestError) {
      setActionIsError(true)
      setActionMessage(getRequestError(requestError))
    } finally {
      setActionLoading(false)
    }
  }

  const onPublishRoute = async () => {
    if (!route || !canPublish) {
      setActionIsError(true)
      setActionMessage("Публиковать можно только свой приватный маршрут.")
      return
    }
    setActionLoading(true)
    setActionMessage("")
    setActionIsError(false)
    try {
      const updatedRoute = await publishRouteById(route.routeId)
      setRoute(updatedRoute)
      setActionIsError(false)
      setActionMessage("Маршрут опубликован.")
    } catch (requestError) {
      setActionIsError(true)
      setActionMessage(getRequestError(requestError))
    } finally {
      setActionLoading(false)
    }
  }

  const onRouteImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setRouteImageFile(null)
      return
    }
    if (!file.type.startsWith("image/")) {
      setActionIsError(true)
      setActionMessage("Можно загрузить только изображение.")
      event.target.value = ""
      setRouteImageFile(null)
      return
    }
    setRouteImageFile(file)
  }

  const onUpdateRoute = async () => {
    if (!route || !canManageOwnRoute) return

    const normalizedTitle = routeTitleDraft.trim()
    if (!normalizedTitle) {
      setActionIsError(true)
      setActionMessage("Название маршрута не может быть пустым.")
      return
    }

    const durationText = routeDurationDaysDraft.trim()
    const parsedDuration = durationText ? Number(durationText) : undefined
    if (
      durationText &&
      (
        typeof parsedDuration !== "number" ||
        !Number.isInteger(parsedDuration) ||
        parsedDuration < 1 ||
        parsedDuration > 365
      )
    ) {
      setActionIsError(true)
      setActionMessage("Длительность должна быть числом от 1 до 365.")
      return
    }

    setActionLoading(true)
    setActionMessage("")
    setActionIsError(false)
    try {
      let nextImageUrl = route.imageUrl || undefined
      if (routeImageFile) {
        const uploaded = await uploadRouteImage(routeImageFile)
        nextImageUrl = uploaded.imageUrl
      }

      const updatedRoute = await updateRouteById(route.routeId, {
        title: normalizedTitle,
        description: routeDescriptionDraft.trim() || undefined,
        durationDays: parsedDuration,
        imageUrl: nextImageUrl,
      })

      setRoute(updatedRoute)
      setRouteImageFile(null)
      if (routeImageInputRef.current) {
        routeImageInputRef.current.value = ""
      }
      setActionIsError(false)
      setActionMessage("Маршрут обновлен.")
    } catch (requestError) {
      setActionIsError(true)
      setActionMessage(getRequestError(requestError))
    } finally {
      setActionLoading(false)
    }
  }

  const onCreateReview = async () => {
    if (!route || !canCreateReview) {
      setActionIsError(true)
      setActionMessage("Добавлять отзыв можно только один раз на чужой публичный маршрут.")
      return
    }
    setActionLoading(true)
    setActionMessage("")
    setActionIsError(false)
    try {
      const createdReview = await createReviewForRoute(route.routeId, {
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
      })
      setReviews((prev) => [createdReview, ...prev])
      setReviewComment("")
      setActionIsError(false)
      setActionMessage("Отзыв добавлен.")
    } catch (requestError) {
      setActionIsError(true)
      setActionMessage(getRequestError(requestError))
    } finally {
      setActionLoading(false)
    }
  }

  const onDeleteRoute = async () => {
    if (!route || !canManageOwnRoute) return

    setActionLoading(true)
    setActionMessage("")
    setActionIsError(false)
    try {
      await deleteRouteById(route.routeId)
      navigate("/cabinet/my-routes", { replace: true })
    } catch (requestError) {
      setActionIsError(true)
      setActionMessage(getRequestError(requestError))
    } finally {
      setActionLoading(false)
    }
  }

  const onChangePointField = (
    pointId: number,
    field: "country" | "city" | "description",
    value: string
  ) => {
    setPointDrafts((prev) => ({
      ...prev,
      [pointId]: {
        ...prev[pointId],
        [field]: value,
      },
    }))
  }

  const onUpdatePoint = async (pointId: number) => {
    if (!canManageOwnRoute) return
    const draft = pointDrafts[pointId]
    if (!draft || !draft.country.trim() || !draft.city.trim()) {
      setActionIsError(true)
      setActionMessage("Для точки укажите страну и город.")
      return
    }

    setActionLoading(true)
    setActionMessage("")
    setActionIsError(false)
    try {
      const updatedPoint = await updateRoutePointById(pointId, {
        country: draft.country.trim(),
        city: draft.city.trim(),
        description: draft.description.trim() || undefined,
      })
      setPoints((prev) =>
        prev.map((point) => (point.pointId === pointId ? updatedPoint : point))
      )
      setPointDrafts((prev) => ({
        ...prev,
        [pointId]: {
          country: updatedPoint.country,
          city: updatedPoint.city,
          description: updatedPoint.description || "",
        },
      }))
      setActionMessage("Точка обновлена.")
    } catch (requestError) {
      setActionIsError(true)
      setActionMessage(getRequestError(requestError))
    } finally {
      setActionLoading(false)
    }
  }

  const onDeletePoint = async (pointId: number) => {
    if (!canManageOwnRoute) return

    setActionLoading(true)
    setActionMessage("")
    setActionIsError(false)
    try {
      await deleteRoutePointById(pointId)
      setPoints((prev) => prev.filter((point) => point.pointId !== pointId))
      setPointDrafts((prev) => {
        const next = { ...prev }
        delete next[pointId]
        return next
      })
      setActionMessage("Точка удалена.")
    } catch (requestError) {
      setActionIsError(true)
      setActionMessage(getRequestError(requestError))
    } finally {
      setActionLoading(false)
    }
  }

  const onCreatePoint = async () => {
    if (!route || !canManageOwnRoute) return
    if (!newPoint.country.trim() || !newPoint.city.trim()) {
      setActionIsError(true)
      setActionMessage("Для новой точки укажите страну и город.")
      return
    }

    setActionLoading(true)
    setActionMessage("")
    setActionIsError(false)
    try {
      const createdPoint = await createRoutePointByRouteId(route.routeId, {
        position: nextPointPosition,
        country: newPoint.country.trim(),
        city: newPoint.city.trim(),
        description: newPoint.description.trim() || undefined,
      })
      setPoints((prev) => [...prev, createdPoint])
      setPointDrafts((prev) => ({
        ...prev,
        [createdPoint.pointId]: {
          country: createdPoint.country,
          city: createdPoint.city,
          description: createdPoint.description || "",
        },
      }))
      setNewPoint({
        country: "",
        city: "",
        description: "",
      })
      setActionMessage("Точка добавлена.")
    } catch (requestError) {
      setActionIsError(true)
      setActionMessage(getRequestError(requestError))
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Загружаем маршрут...</p>
      </div>
    )
  }

  if (error || !route) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-destructive">
          {error || "Маршрут не найден."}
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <section className="overflow-hidden rounded-[30px] border border-border bg-card shadow-[0_12px_24px_rgba(44,71,92,0.08)]">
          <div className="h-[220px] sm:h-[280px]">
            <img
              src={normalizeImageUrl(coverImageUrl)}
              alt={route.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground">
                Тип: {route.visibility === "public" ? "Публичный" : "Приватный"}
              </span>
              <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground">
                Автор: {route.author.username || route.author.email}
              </span>
            </div>

            <h1 className="mt-3 text-4xl leading-tight font-bold text-foreground sm:text-5xl">
              {route.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {route.description?.trim() || "Описание маршрута не добавлено."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-[#588096]">
              {canFavorite ? (
                <Button
                  variant="orange"
                  size="headerAuth"
                  disabled={actionLoading}
                  onClick={() => void onAddToFavorites()}
                >
                  Добавить в избранное
                </Button>
              ) : null}
              {canPublish ? (
                <Button
                  variant="transparent"
                  size="headerAuth"
                  disabled={actionLoading}
                  onClick={() => void onPublishRoute()}
                >
                  Опубликовать
                </Button>
              ) : null}
              {canManageOwnRoute ? (
                <Button
                  variant="transparent"
                  size="headerAuth"
                  disabled={actionLoading}
                  onClick={() => void onDeleteRoute()}
                >
                  Удалить маршрут
                </Button>
              ) : null}
            </div>

            {actionMessage ? (
              <p
                className={[
                  "mt-2 text-sm",
                  actionIsError ? "text-destructive" : "text-muted-foreground",
                ].join(" ")}
              >
                {actionMessage}
              </p>
            ) : null}
          </div>
        </section>

        <div className={canManageOwnRoute ? "grid gap-4" : "grid gap-4 lg:grid-cols-2"}>
          {!canManageOwnRoute ? (
            <section className="rounded-[30px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:p-5">
              <p className="text-sm font-semibold text-muted-foreground">Описание</p>
              <h2 className="mt-1 text-4xl leading-none font-bold text-foreground sm:text-5xl">
                О маршруте
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Длительность: {formatDays(route.durationDays)}
              </p>
            </section>
          ) : null}

          {canManageOwnRoute ? (
            <section className="rounded-[30px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:p-5">
              <p className="text-sm font-semibold text-muted-foreground">
                Редактирование маршрута
              </p>
              <h2 className="mt-1 text-4xl leading-none font-bold text-foreground sm:text-5xl">
                Основные данные
              </h2>

              <div className="mt-4 space-y-2.5">
                <input
                  type="text"
                  value={routeTitleDraft}
                  onChange={(event) => setRouteTitleDraft(event.target.value)}
                  placeholder="Название маршрута"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <textarea
                  rows={4}
                  value={routeDescriptionDraft}
                  onChange={(event) => setRouteDescriptionDraft(event.target.value)}
                  placeholder="Описание маршрута"
                  className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={routeDurationDaysDraft}
                  onChange={(event) => setRouteDurationDaysDraft(event.target.value)}
                  placeholder="Длительность в днях"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <input
                  ref={routeImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onRouteImageChange}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-xl file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm file:font-semibold file:text-foreground/85"
                />
                <p className="text-xs text-muted-foreground">
                  {routeImageFile
                    ? `Выбран файл: ${routeImageFile.name}`
                    : "Можно оставить текущее фото без изменений"}
                </p>
                <Button
                  variant="orange"
                  size="headerAuth"
                  disabled={actionLoading}
                  onClick={() => void onUpdateRoute()}
                >
                  Сохранить маршрут
                </Button>
              </div>
            </section>
          ) : null}

          <section className="rounded-[30px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:p-5">
            <p className="text-sm font-semibold text-muted-foreground">Точки маршрута</p>
            <h2 className="mt-1 text-4xl leading-none font-bold text-foreground sm:text-5xl">
              Список точек
            </h2>

            <ol className="mt-4 space-y-2.5">
              {points.length === 0 ? (
                <li className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                  Точки не добавлены.
                </li>
              ) : null}
              {points
                .slice()
                .sort((a, b) => a.position - b.position)
                .map((point) => (
                  <li
                    key={point.pointId}
                    className="rounded-2xl bg-muted px-4 py-3 text-lg text-foreground/90"
                  >
                    {canManageOwnRoute ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Точка маршрута №{point.position}
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input
                            type="text"
                            value={pointDrafts[point.pointId]?.country ?? point.country}
                            onChange={(event) =>
                              onChangePointField(
                                point.pointId,
                                "country",
                                event.target.value
                              )
                            }
                            className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                          />
                          <input
                            type="text"
                            value={pointDrafts[point.pointId]?.city ?? point.city}
                            onChange={(event) =>
                              onChangePointField(point.pointId, "city", event.target.value)
                            }
                            className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                          />
                        </div>
                        <input
                          type="text"
                          value={
                            pointDrafts[point.pointId]?.description ??
                            point.description ??
                            ""
                          }
                          onChange={(event) =>
                            onChangePointField(
                              point.pointId,
                              "description",
                              event.target.value
                            )
                          }
                          placeholder="Описание точки"
                          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                        />
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="orange"
                            size="routeCard"
                            disabled={actionLoading}
                            onClick={() => void onUpdatePoint(point.pointId)}
                          >
                            Сохранить точку
                          </Button>
                          <Button
                            variant="transparent"
                            size="routeCard"
                            disabled={actionLoading}
                            onClick={() => void onDeletePoint(point.pointId)}
                          >
                            Удалить точку
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {point.position}. {point.country}, {point.city}
                        {point.description ? ` - ${point.description}` : ""}
                      </>
                    )}
                  </li>
                ))}
            </ol>

            {canManageOwnRoute ? (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Добавить точку
                </h3>
                <p className="text-sm text-muted-foreground">
                  Следующая точка получит номер автоматически:{" "}
                  <span className="font-semibold text-foreground">
                    {nextPointPosition}
                  </span>
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    value={newPoint.country}
                    onChange={(event) =>
                      setNewPoint((prev) => ({ ...prev, country: event.target.value }))
                    }
                    placeholder="Страна"
                    className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  />
                  <input
                    type="text"
                    value={newPoint.city}
                    onChange={(event) =>
                      setNewPoint((prev) => ({ ...prev, city: event.target.value }))
                    }
                    placeholder="Город"
                    className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  />
                </div>
                <input
                  type="text"
                  value={newPoint.description}
                  onChange={(event) =>
                    setNewPoint((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder="Описание точки"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <Button
                  variant="orange"
                  size="headerAuth"
                  disabled={actionLoading}
                  onClick={() => void onCreatePoint()}
                >
                  Добавить точку
                </Button>
              </div>
            ) : null}
          </section>
        </div>

        {!canManageOwnRoute ? (
          <section className="rounded-[30px] border border-border bg-card p-4 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:p-5">
            <p className="text-sm font-semibold text-muted-foreground">Отзывы</p>
            <h2 className="mt-1 text-4xl leading-none font-bold text-foreground sm:text-5xl">
              Что пишут о маршруте
            </h2>

            <div className="mt-4 space-y-2.5">
              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">Отзывов пока нет.</p>
              ) : null}
              {reviews.map((review) => (
                <article
                  key={review.reviewId}
                  className="rounded-2xl bg-muted px-4 py-3"
                >
                  <p className="text-xl leading-none font-semibold text-foreground">
                    Оценка: {review.rating}/5
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {review.user?.username || review.user?.email || "Пользователь"}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {review.comment?.trim() || "Без комментария."}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              {canReview ? (
              <div
                className={[
                  "grid gap-2 sm:grid-cols-[120px_1fr]",
                  reviewFormDisabled ? "opacity-60" : "",
                ].join(" ")}
              >
                <select
                  value={
                    hasCurrentUserReview
                      ? (currentUserReview?.rating ?? reviewRating)
                      : reviewRating
                  }
                  onChange={(event) => setReviewRating(Number(event.target.value))}
                  disabled={reviewFormDisabled}
                  className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={
                    hasCurrentUserReview
                      ? (currentUserReview?.comment ?? "")
                      : reviewComment
                  }
                  onChange={(event) => setReviewComment(event.target.value)}
                  disabled={reviewFormDisabled}
                  placeholder="Комментарий к отзыву"
                  className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed"
                />
              </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Отзывы можно оставлять только на чужие публичные маршруты.
                </p>
              )}
              {canReview && hasCurrentUserReview ? (
                <p className="text-sm text-muted-foreground">
                  Вы уже оставили отзыв на этот маршрут.
                </p>
              ) : null}
              {canReview ? (
                <Button
                  variant="orange"
                  size="headerAuth"
                  disabled={reviewFormDisabled}
                  onClick={() => void onCreateReview()}
                >
                  {hasCurrentUserReview ? "Отзыв добавлен" : "Оставить отзыв"}
                </Button>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}

function normalizeImageUrl(imageUrl?: string) {
  if (imageUrl) return imageUrl
  return "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?auto=format&fit=crop&w=2000&q=80"
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

function resolveUserId(user: { userId?: number; id?: number } | null | undefined) {
  if (!user) return null
  if (typeof user.userId === "number") return user.userId
  if (typeof user.id === "number") return user.id
  return null
}

function normalizeVisibility(value: string | undefined) {
  return (value || "").trim().toLowerCase()
}

function getNextPointPosition(points: RoutePointResponseDto[]) {
  if (points.length === 0) return 1

  const maxPosition = points.reduce((max, point) => {
    return point.position > max ? point.position : max
  }, 0)

  return maxPosition + 1
}
