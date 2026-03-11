import { instance } from "@/api/instance"
import type {
  FavoriteResponseDto,
  JwtUserDto,
  RouteResponseDto,
  SavedRouteResponseDto,
  UpdateUserPayload,
} from "@/api/types"

export async function getCurrentUserProfile() {
  const response = await instance.get<JwtUserDto>("/users/me")
  return response.data
}

export async function updateUserById(userId: number, payload: UpdateUserPayload) {
  const response = await instance.patch<JwtUserDto>(`/users/${userId}`, payload)
  return response.data
}

export async function getMyPrivateRoutes() {
  const response = await instance.get<RouteResponseDto[]>("/users/me/routes/private")
  return response.data
}

export async function getMyPublishedRoutes() {
  const response = await instance.get<RouteResponseDto[]>(
    "/users/me/routes/published"
  )
  return response.data
}

export async function getMySavedRoutes() {
  const response = await instance.get<SavedRouteResponseDto[]>("/users/me/saved")
  return response.data
}

export async function getMyFavorites() {
  const response = await instance.get<FavoriteResponseDto[]>("/users/me/favorites")
  return response.data
}
