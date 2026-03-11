import Cookies from "js-cookie"
import { instance } from "@/api/instance"

export type RegisterPayload = {
  email: string
  password: string
  username: string
}

export type RegisterResponse = {
  userId: number
  email: string
  username: string
}

export type LoginPayload = {
  email: string
  password: string
}

type LoginResponse = {
  access_token: string
}

export async function registerUser(payload: RegisterPayload) {
  const response = await instance.post<RegisterResponse>("/auth/register", payload)
  return response.data
}

export async function loginUser(payload: LoginPayload) {
  const response = await instance.post<LoginResponse>("/auth/login", payload)
  const token = response.data.access_token

  Cookies.set("token", token, {
    expires: 7,
    sameSite: "lax",
    path: "/",
  })

  return response.data
}

export function logoutUser() {
  Cookies.remove("token", { path: "/" })
}
