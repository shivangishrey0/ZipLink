import { createRootRoute, createRoute, createRouter, lazyRouteComponent } from "@tanstack/react-router";
import RootLayout from "../RootLayout.jsx";
import HomePage from "../pages/HomePage.jsx";
import AuthPage from "../pages/AuthPage.jsx";
import UrlsPage from "../pages/UrlsPage.jsx";
import GoogleCallbackPage from "../pages/GoogleCallbackPage.jsx";
import ExpiredLinkPage from "../pages/ExpiredLinkPage.jsx";
import LinkNotActive from "../pages/LinkNotActive.jsx";
import ProtectedLinkPage from "../pages/ProtectedLinkPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  // ?error=<code> is how the backend reports a Google sign-in problem.
  validateSearch: (search) => ({
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  component: () => <AuthPage mode="login" />,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => <AuthPage mode="register" />,
});

const googleCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/google/callback",
  component: GoogleCallbackPage,
});

const urlsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/urls",
  component: UrlsPage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics/$code",
  // The charting library is large, so this page is only downloaded when someone opens it.
  component: lazyRouteComponent(() => import("../pages/AnalyticsPage.jsx")),
});

const expiredRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/expired",
  component: ExpiredLinkPage,
});

const notActiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/not-active",
  component: LinkNotActive,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/protected/$code",
  component: ProtectedLinkPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  googleCallbackRoute,
  urlsRoute,
  analyticsRoute,
  expiredRoute,
  notActiveRoute,
  protectedRoute,
]);

export const router = createRouter({ routeTree });
