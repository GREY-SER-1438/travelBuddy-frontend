import { instance } from "@/api/instance"
import type {
  CreateReviewPayload,
  MessageResponseDto,
  ReviewResponseDto,
  UpdateReviewPayload,
} from "@/api/types"

export async function createReviewForRoute(
  routeId: number,
  payload: CreateReviewPayload
) {
  const response = await instance.post<ReviewResponseDto>(
    `/routes/${routeId}/review`,
    payload
  )
  return response.data
}

export async function getReviewsByRouteId(routeId: number) {
  const response = await instance.get<ReviewResponseDto[]>(`/routes/${routeId}/reviews`)
  return response.data
}

export async function updateReviewById(
  reviewId: number,
  payload: UpdateReviewPayload
) {
  const response = await instance.patch<ReviewResponseDto>(
    `/reviews/${reviewId}`,
    payload
  )
  return response.data
}

export async function deleteReviewById(reviewId: number) {
  const response = await instance.delete<MessageResponseDto>(`/reviews/${reviewId}`)
  return response.data
}
