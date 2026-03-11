import Cookies from "js-cookie"

export function hasAuthToken() {
  return Boolean(Cookies.get("token"))
}
