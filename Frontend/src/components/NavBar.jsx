import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useLogout } from "../hooks/useLogout.js";
import Logo from "./Logo.jsx";

const SECTIONS = [
  { label: "Features", id: "features" },
  { label: "How it works", id: "how-it-works" },
];

const NavBar = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // The bar gets a visible edge once the page has scrolled under it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after any navigation, and on Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const logout = useLogout(() => setOpen(false));

  const scrollBehavior = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  // On the home page, scroll to the section. From any other page, go home first, the home page scrolls.
  const goToSection = (event, id) => {
    event.preventDefault();
    setOpen(false);

    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      window.history.replaceState(null, "", `/#${id}`);
    } else {
      navigate({ to: "/", hash: id });
    }
  };

  const goHome = (event) => {
    setOpen(false);
    if (pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: scrollBehavior() });
      window.history.replaceState(null, "", "/");
    }
  };

  const linkClass =
    "rounded-md px-3 py-2 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-ink";

  const links = (
    <>
      <Link to="/" onClick={goHome} className={linkClass}>
        Home
      </Link>
      {SECTIONS.map((section) => (
        <a
          key={section.id}
          href={`/#${section.id}`}
          onClick={(event) => goToSection(event, section.id)}
          className={linkClass}
        >
          {section.label}
        </a>
      ))}
      {user && (
        <Link
          to="/urls"
          className={linkClass}
          activeProps={{ className: "rounded-md px-3 py-2 text-sm font-medium text-ink bg-white/5" }}
        >
          Dashboard
        </Link>
      )}
    </>
  );

  return (
    <header
      className={`glass sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-white/10" : "border-transparent"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link to="/" onClick={goHome} aria-label="ZipLink home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">{links}</div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="mr-1 hidden max-w-[10rem] truncate text-sm text-muted lg:inline">
                {user.name}
              </span>
              <Link to="/urls" className="btn-primary">
                <LayoutDashboard size={16} aria-hidden="true" />
                Dashboard
              </Link>
              <button
                type="button"
                className="btn-ghost px-3"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={16} aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn-ghost px-3 md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="animate-fade-up container-page border-t border-white/10 pt-3 pb-5 md:hidden">
          <div className="flex flex-col gap-1">{links}</div>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <p className="px-1 text-sm text-muted">Signed in as {user.name}</p>
                <Link to="/urls" className="btn-primary">
                  <LayoutDashboard size={16} aria-hidden="true" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => logout.mutate()}
                  disabled={logout.isPending}
                >
                  <LogOut size={16} aria-hidden="true" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
