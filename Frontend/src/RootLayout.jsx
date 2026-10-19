import { useEffect } from "react";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { LoaderCircle } from "lucide-react";
import AmbientBackground from "./components/AmbientBackground.jsx";
import Footer from "./components/Footer.jsx";
import NavBar from "./components/NavBar.jsx";

// Pages that draw their own full-width layout. Everything else sits in a centered container.
const FULL_WIDTH = ["/"];

const RootLayout = () => {
  const checked = useSelector((state) => state.auth.checked);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const fullWidth = FULL_WIDTH.includes(pathname);

  // A new page starts at the top (the home page handles its own #section scrolling).
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <a
        href="#content"
        className="sr-only z-[60] rounded-md bg-surface px-3 py-2 text-sm text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <AmbientBackground />
      <NavBar />
      <main id="content" className="relative z-10 flex-1">
        {checked ? (
          fullWidth ? (
            <Outlet />
          ) : (
            <div className="container-page py-10 sm:py-14">
              <Outlet />
            </div>
          )
        ) : (
          // Wait for the "who is logged in" answer so pages do not flash the wrong state.
          <div className="flex justify-center py-32 text-muted" role="status" aria-label="Loading">
            <LoaderCircle className="animate-spin" />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
