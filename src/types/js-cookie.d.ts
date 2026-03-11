declare module "js-cookie" {
  export interface CookieAttributes {
    path?: string
    domain?: string
    expires?: number | Date
    secure?: boolean
    sameSite?: "strict" | "lax" | "none"
  }

  interface CookiesStatic {
    get(name: string): string | undefined
    get(): Record<string, string>
    set(name: string, value: string, options?: CookieAttributes): string | undefined
    remove(name: string, options?: CookieAttributes): void
  }

  const Cookies: CookiesStatic
  export default Cookies
}
