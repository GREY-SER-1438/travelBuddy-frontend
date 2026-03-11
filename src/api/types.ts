export type RouteVisibility = "private" | "public" | string

export type UserSummaryDto = {
  userId: number
  email: string
  username?: string
}

export type JwtUserDto = {
  userId: number
  email: string
  username?: string
}

export type UpdateUserPayload = {
  email?: string
  username?: string
  password?: string
}

export type RouteShortDto = {
  routeId: number
  title: string
  visibility: RouteVisibility
  author?: UserSummaryDto
}

export type RouteResponseDto = {
  routeId: number
  title: string
  description?: string | null
  imageUrl?: string | null
  visibility: RouteVisibility
  durationDays?: number | null
  isCompleted: boolean
  author: UserSummaryDto
}

export type CreateRoutePayload = {
  title: string
  description?: string
  imageUrl?: string
  visibility?: "private" | "public"
  durationDays?: number
}

export type UpdateRoutePayload = Partial<CreateRoutePayload>

export type UploadImageResponseDto = {
  imageUrl: string
}

export type DeleteResultDto = {
  affected: number
  raw: unknown
}

export type MessageResponseDto = {
  message: string
}

export type ReviewResponseDto = {
  reviewId: number
  rating: number
  comment?: string
  user?: UserSummaryDto
  route?: RouteShortDto
}

export type CreateReviewPayload = {
  rating: number
  comment?: string
}

export type UpdateReviewPayload = Partial<CreateReviewPayload>

export type CategoryResponseDto = {
  categoryId: number
  name: string
  isPublic: boolean
  creator?: UserSummaryDto
}

export type RouteCategoryResponseDto = {
  routeCategoryId: number
  route: RouteShortDto
  category: CategoryResponseDto
}

export type AddRouteCategoryPayload = {
  categoryId: number
}

export type CreateCategoryPayload = {
  name: string
  isPublic?: boolean
}

export type RoutePointResponseDto = {
  pointId: number
  position: number
  country: string
  city: string
  description?: string
  route?: RouteShortDto
}

export type CreateRoutePointPayload = {
  position: number
  country: string
  city: string
  description?: string
}

export type UpdateRoutePointPayload = Partial<CreateRoutePointPayload>

export type SavedRouteResponseDto = {
  savedRouteId: number
  user?: UserSummaryDto
  route: RouteResponseDto
}

export type FavoriteResponseDto = {
  favoriteId: number
  user?: UserSummaryDto
  route: RouteResponseDto
}

export type ReportFormat = "html" | "xml"
