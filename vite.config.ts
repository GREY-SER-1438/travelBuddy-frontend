import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const rawApiOrigin = String(process.env.VITE_BASE_URL ?? "").trim()
const apiOrigin = rawApiOrigin.replace(/\/+$/, "").replace(/\/api$/i, "") || "http://localhost:3000"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ["localhost", "cohen-mill-commit-asset.trycloudflare.com"],
    proxy: {
      "/api": {
        target: apiOrigin,
        changeOrigin: true,
      },
    },
  },
})
