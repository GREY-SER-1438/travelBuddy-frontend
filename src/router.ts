import { createBrowserRouter } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import RoutesPage from "./pages/RoutesPage"
import PlannerPage from "./pages/PlannerPage"
import CabinetPage from "./pages/CabinetPage"
import CategoryPage from "./pages/CategoryPage"
import RouteDetailsPage from "./pages/RouteDetailsPage"
import { RequireAuth, RequireGuest } from "@/components/auth-guards"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      {
        Component: RequireGuest,
        children: [
          { path: "login", Component: LoginPage },
          { path: "register", Component: RegisterPage },
        ],
      },
      {
        Component: RequireAuth,
        children: [
          { path: "routes", Component: RoutesPage },
          { path: "routes/:routeId", Component: RouteDetailsPage },
          { path: "categories/:category", Component: CategoryPage },
          { path: "planner", Component: PlannerPage },
          { path: "cabinet", Component: CabinetPage },
        ],
      },
    ],
  },
])
