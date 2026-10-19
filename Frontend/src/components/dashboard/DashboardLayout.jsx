import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { House, Link2, LogOut, Menu, Plus, X } from "lucide-react";
import { useLogout } from "../../hooks/useLogout.js";
import Logo from "../Logo.jsx";
import RequireAuth from "../RequireAuth.jsx";
import CreateLinkModal from "./CreateLinkModal.jsx";

const DashboardContext = createContext({ openCreate: () => {} });

// Pages inside the dashboard call this to open the "Create a short link" dialog.
// eslint-disable-next-line react-refresh/only-export-components
export const useDashboard = () => useContext(DashboardContext);

const navClass = (active) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    active ? "bg-brand/15 text-ink" : "text-muted hover:bg-white/5 hover:text-ink"
  }`;

// The content of the sidebar. The same markup is used in the fixed desktop column and the phone drawer.
const SidebarContent = ({ onCreate, onNavigate }) => {
  const user = useSelector((state) => state.auth.user);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const logout = useLogout();
  const inDashboard = pathname.startsWith("/urls") || pathname.startsWith("/analytics");
  const initial = (user?.name ?? "?").trim().charAt(0).toUpperCase();

  return (
    <div className="flex h-full flex-col">
      <Link to="/" onClick={onNavigate} aria-label="ZipLink home" className="px-2">
        <Logo />
      </Link>

      <button type="button" className="btn-primary mt-7 w-full" onClick={onCreate}>
        <Plus size={17} aria-hidden="true" />
        Create link
      </button>

      <nav aria-label="Dashboard" className="mt-6 space-y-1">
        <Link
          to="/urls"
          onClick={onNavigate}
          className={navClass(inDashboard)}
          aria-current={inDashboard ? "page" : undefined}
        >
          <Link2 size={18} aria-hidden="true" />
          My links
        </Link>
        <Link to="/" onClick={onNavigate} className={navClass(false)}>
          <House size={18} aria-hidden="true" />
          Back to site
        </Link>
      </nav>

      <div className="mt-auto border-t border-white/8 pt-4">
        <div className="flex items-center gap-3 px-1">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-bold text-white"
            style={{ backgroundImage: "linear-gradient(135deg, #6d4df2, #3b6cf0)" }}
          >
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          className="btn-ghost mt-3 w-full"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <LogOut size={16} aria-hidden="true" />
          Log out
        </button>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const menuButton = useRef(null);
  const closeButton = useRef(null);

  // The phone drawer closes after any navigation, and on Escape.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    closeButton.current?.focus();
    const onKey = (event) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      menuButton.current?.focus();
    };
  }, [menuOpen]);

  const openCreate = () => {
    setMenuOpen(false);
    setCreateOpen(true);
  };

  return (
    <RequireAuth>
      <DashboardContext.Provider value={{ openCreate }}>
        <div className="relative z-10 min-h-screen lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside className="glass sticky top-0 hidden h-screen border-r border-white/8 px-4 py-5 lg:block">
            <SidebarContent onCreate={openCreate} />
          </aside>

          <div className="flex min-w-0 flex-col">
            <header className="glass sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/8 px-4 lg:hidden">
              <Link to="/" aria-label="ZipLink home">
                <Logo />
              </Link>
              <button
                ref={menuButton}
                type="button"
                className="btn-ghost h-9 w-9 px-0"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="dashboard-drawer"
                aria-label="Open menu"
              >
                <Menu size={18} aria-hidden="true" />
              </button>
            </header>

            <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 sm:py-10">
              <Outlet />
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <aside
              id="dashboard-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Dashboard menu"
              className="animate-fade-up absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-white/10 bg-bg-2 px-4 py-5"
            >
              <button
                ref={closeButton}
                type="button"
                className="btn-ghost absolute top-4 right-4 h-9 w-9 px-0"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={17} aria-hidden="true" />
              </button>
              <SidebarContent onCreate={openCreate} onNavigate={() => setMenuOpen(false)} />
            </aside>
          </div>
        )}

        <CreateLinkModal open={createOpen} onClose={() => setCreateOpen(false)} />
      </DashboardContext.Provider>
    </RequireAuth>
  );
};

export default DashboardLayout;
