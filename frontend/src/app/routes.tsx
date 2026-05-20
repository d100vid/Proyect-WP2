import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Home } from "./pages/Home";
import { RecipeDetail } from "./pages/RecipeDetail";
import { SearchResults } from "./pages/SearchResults";
import { AdminDashboard } from "./pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/search",
    Component: SearchResults,
  },
  {
    path: "/recipe/:id",
    Component: RecipeDetail,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
]);