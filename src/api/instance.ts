import axios from "axios"
import Cookies from "js-cookie"
import { API_BASE_URL, API_ORIGIN } from "@/api/config"

const isNgrok = /ngrok-free\.app|ngrok-free\.dev/i.test(API_ORIGIN)

export const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(isNgrok ? { "ngrok-skip-browser-warning": "true" } : {}),
  },
})
instance.interceptors.request.use((config) => {
  const token = Cookies.get("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
