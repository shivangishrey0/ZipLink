import { Outlet } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { LoaderCircle } from "lucide-react";
import NavBar from "./components/NavBar.jsx";

const RootLayout = () => {
  const checked = useSelector((state) => state.auth.checked);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-12">
        {checked ? (
          <Outlet />
        ) : (
          // Wait for the "who is logged in" answer so pages do not flash the wrong state.
          <div className="flex justify-center py-24 text-muted" role="status" aria-label="Loading">
            <LoaderCircle className="animate-spin" />
          </div>
        )}
      </main>
    </div>
  );
};

export default RootLayout;
