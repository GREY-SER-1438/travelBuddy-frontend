import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="travelbuddy-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  </StrictMode>
)
