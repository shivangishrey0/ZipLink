import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import RootLayout from "../RootLayout.jsx";
import HomePage from "../pages/HomePage.jsx";

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const routeTree = rootRoute.addChildren([homeRoute]);

export const router = createRouter({ routeTree });
