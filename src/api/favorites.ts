import { instance } from "@/api/instance"
import type {
  FavoriteResponseDto,
  MessageResponseDto,
} from "@/api/types"

export async function addFavoriteByRouteId(routeId: number) {
  const response = await instance.post<FavoriteResponseDto>(`/favorites/${routeId}`)
  return response.data
}

export async function removeFavoriteByRouteId(routeId: number) {
  const response = await instance.delete<MessageResponseDto>(`/favorites/${routeId}`)
  return response.data
}

export async function getFavorites() {
  const response = await instance.get<FavoriteResponseDto[]>("/favorites")
  return response.data
}
